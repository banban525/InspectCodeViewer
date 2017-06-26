using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Xml;
using System.Xml.Serialization;

namespace InspectCodeVisualizer
{
    class Program
    {
        static void Main(string[] args)
        {
            //var inputFile = args[0];
            var inputFile = @"C:\work\InspectCodeVisualizer\inspectCodeResult.xml";
            var programBaseDir = @"C:\work\NoahsArk\Source";
            var inspectId = Guid.NewGuid().ToString("N");
            var lastWriteTime = new FileInfo(inputFile).LastWriteTime;
            var caption = $"{lastWriteTime:yyyy-MM-dd}({inspectId.Substring(0, 8)})";
            var outputBaseDir = @"C:\work\InspectCodeVisualizer\bin\revisions";

            Report report;
            using (var fileStream = new FileStream(inputFile, FileMode.Open))
            {
                var reportSerializer = new XmlSerializer(typeof(Report));
                report = (Report) reportSerializer.Deserialize(fileStream);
            }

            var filePaths = report.Issues.SelectMany(_ => _.Issue).GroupBy(_ => _.File).Select(_ => _.Key).ToArray();

            var issues = report.Issues
                .SelectMany(_ => _.Issue.Select(issue => new {issue, Project = _.Name}))
                .Select(_ => new Issue("", _.issue.TypeId, _.issue.File, _.issue.Offset, _.issue.Message,_.issue.Line, _.Project))
                .Select(_ => new Issue(CreateId(_, programBaseDir), _.TypeId, _.File, _.Offset, _.Message, _.Line,_.Project))
                .ToArray();
            var issueTypes = report.IssueTypes
                .Select(_ => new IssueType(_.Id, _.Category, _.CategoryId, _.Description, _.Severity, _.WikiUrl,
                    _.SubCategory))
                .ToArray();


            var inspectResults = new InspectResults(issues, issueTypes, new RevisionInfo(
                inspectId,
                caption,
                lastWriteTime.ToString("s"),
                issues.Length
                ));


            // Prepare output directories.
            var outputDir = Path.Combine(outputBaseDir, inspectId);
            var dataFilePath = Path.Combine(outputDir, "data.js");
            var summaryFilePath = Path.Combine(outputBaseDir, "summary.js");
            var codeDir = Path.Combine(outputDir, "codes");
            {
                if (Directory.Exists(outputDir))
                {
                    Directory.Delete(outputDir, true);
                    while (Directory.Exists(outputDir))
                    {
                        Thread.Sleep(1);
                    }
                }
                Directory.CreateDirectory(outputDir);
                while (Directory.Exists(outputDir) == false)
                {
                    Thread.Sleep(1);
                }
                if (Directory.Exists(codeDir))
                {
                    Directory.Delete(codeDir, true);
                    while (Directory.Exists(codeDir))
                    {
                        Thread.Sleep(1);
                    }
                }
                Directory.CreateDirectory(codeDir);
                while (Directory.Exists(codeDir) == false)
                {
                    Thread.Sleep(1);
                }
            }

            // Output issues json data.
            {
                var jsonContent = InspectResults.Serialize(inspectResults);
                var temP = InspectResults.Deserialize(jsonContent);
                File.WriteAllText(dataFilePath, "var __data = \r\n" + jsonContent, Encoding.UTF8);
            }

            // Output source code html
            {
                var template = "";
                using (var stream = Assembly.GetExecutingAssembly()
                    .GetManifestResourceStream("InspectCodeVisualizer.template.html"))
                {
                    template = new StreamReader(stream).ReadToEnd();
                }

                foreach (var filePath in filePaths)
                {
                    var absoleteFilePath = Path.Combine(programBaseDir, filePath);
                    if (File.Exists(absoleteFilePath) == false)
                    {
                        continue;
                    }
                    var content = File.ReadAllText(absoleteFilePath, Encoding.UTF8);
                    var htmlFileName = filePath.Replace("\\", "_") + ".html";
                    var htmlFilePath = Path.Combine(codeDir, htmlFileName);

                    var htmlContent = template.Replace("@CODE@", content);
                    File.WriteAllText(htmlFilePath, htmlContent, Encoding.UTF8);
                }
            }

            // Update summary json
            {
                var list = new List<RevisionInfo>();
                var directories = Directory.GetDirectories(outputBaseDir, "*", SearchOption.TopDirectoryOnly);
                foreach (var directory in directories)
                {
                    var dataJsFilePath = Path.Combine(directory, "data.js");
                    if (File.Exists(dataJsFilePath) == false)
                    {
                        continue;
                    }
                    InspectResults inspcResults;
                    using (var reader = new StreamReader(dataJsFilePath, Encoding.UTF8))
                    {
                        reader.ReadLine();  //ignore first line.
                        var json = reader.ReadToEnd();
                        inspcResults = InspectResults.Deserialize(json);
                    }
                    list.Add(inspcResults.MetaInfo);
                }
                var summary = new InspectResultsSummary(list.ToArray());
                var summaryJson = InspectResultsSummary.Serialize(summary);
                File.WriteAllText(summaryFilePath, "var __data = \r\n" + summaryJson, Encoding.UTF8);
            }
        }

        static string CreateId(Issue issue, string baseDir)
        {
            var fullPath = Path.Combine(baseDir, issue.File);
            var lines = new string[0];
            if (File.Exists(fullPath))
            {
                lines = File.ReadAllLines(fullPath);
            }

            var content = "";
            for (int i = issue.Line - 5; i <= issue.Line + 5; i++)
            {
                if (i < 0 || lines.Length <= i)
                {
                    continue;
                }
                if (string.IsNullOrEmpty(content) == false)
                {
                    content += Environment.NewLine;
                }
                content += lines[i];
            }

            var issueForHash = new IssueForHash(issue.TypeId, issue.File, issue.Message, content);
            var serializer = new DataContractJsonSerializer(typeof(IssueForHash));
            var stringWriter = new StringWriter();

            serializer.WriteObject(new XmlTextWriter(stringWriter), issueForHash);
            return GetMD5HashString(stringWriter.ToString());
        }

        public static int GetColumnNo(Issue issue, string baseDir)
        {
            var splitedOffset = issue.Offset.Split('-');
            var offsetStart = Convert.ToInt32(splitedOffset.First());

            var fullPath = Path.Combine(baseDir, issue.File);
            var content = "";
            if (File.Exists(fullPath))
            {
                content = File.ReadAllText(fullPath);
            }
            var lastLfOffset = content.LastIndexOf("\n", offsetStart);
            var lineOffset = offsetStart - (lastLfOffset + 1);
            return lineOffset;
        }

        public static string GetMD5HashString(string text)
        {
            // 文字列をバイト型配列に変換する
            byte[] data = Encoding.UTF8.GetBytes(text);

            // MD5ハッシュアルゴリズム生成
            var algorithm = new MD5CryptoServiceProvider();

            // ハッシュ値を計算する
            byte[] bs = algorithm.ComputeHash(data);

            // リソースを解放する
            algorithm.Clear();

            // バイト型配列を16進数文字列に変換
            var result = new StringBuilder();
            foreach (byte b in bs)
            {
                result.Append(b.ToString("X2"));
            }
            return result.ToString();
        }
    }

    [DataContract]
    class IssueForHash
    {
        public IssueForHash(string typeId, string file, string message, string sourceCodeFragment)
        {
            TypeId = typeId;
            File = file;
            Message = message;
            SourceCodeFragment = sourceCodeFragment;
        }

        [DataMember(Name = "typeId", Order = 1)]
        public string TypeId { get; private set; }

        [DataMember(Name = "file", Order = 2)]
        public string File { get; private set; }

        [DataMember(Name = "message", Order = 3)]
        public string Message { get; private set; }

        [DataMember(Name = "sourceCodeFragment", Order = 4)]
        public string SourceCodeFragment { get; private set; }
    }


    [DataContract]
    class InspectResults
    {
        public InspectResults(Issue[] issues, IssueType[] issueTypess, RevisionInfo metaInfo)
        {
            Issues = issues;
            IssueTypess = issueTypess;
            MetaInfo = metaInfo;
        }

        [DataMember(Name = "issues", Order = 1)]
        public Issue[] Issues { get; private set; }

        [DataMember(Name = "issueTypes", Order = 2)]
        public IssueType[] IssueTypess { get; private set; }

        [DataMember(Name = "metaInfo", Order = 3)]
        public RevisionInfo MetaInfo { get; private set; }

        public static InspectResults Deserialize(string text)
        {
            var serializer = new DataContractJsonSerializer(typeof(InspectResults));
            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream, Encoding.Default);
            writer.Write(text);
            writer.Flush();

            memoryStream.Position = 0;
            var value = (InspectResults)serializer.ReadObject(memoryStream);
            return value;
        }

        public static string Serialize(InspectResults value)
        {
            var serializer = new DataContractJsonSerializer(typeof(InspectResults));
            var memoryStream = new MemoryStream();
            serializer.WriteObject(memoryStream, value);
            memoryStream.Position = 0;
            var jsonContent = new StreamReader(memoryStream, Encoding.Default).ReadToEnd();
            return jsonContent;
        }
    }

    [DataContract]
    class InspectResultsSummary
    {
        public InspectResultsSummary(RevisionInfo[] revisionInfos)
        {
            RevisionInfos = revisionInfos;
        }

        [DataMember(Name= "revisionInfos", Order = 1)]
        public RevisionInfo[] RevisionInfos { get; set; }

        public static InspectResultsSummary Deserialize(string text)
        {
            var serializer = new DataContractJsonSerializer(typeof(InspectResultsSummary));
            var memoryStream = new MemoryStream();
            var writer = new StreamWriter(memoryStream, Encoding.Default);
            writer.Write(text);
            writer.Flush();
            memoryStream.Position = 0;
            var value = (InspectResultsSummary)serializer.ReadObject(memoryStream);
            return value;
        }

        public static string Serialize(InspectResultsSummary value)
        {
            var serializer = new DataContractJsonSerializer(typeof(InspectResultsSummary));
            var memoryStream = new MemoryStream();
            serializer.WriteObject(memoryStream, value);
            memoryStream.Position = 0;
            var jsonContent = new StreamReader(memoryStream, Encoding.Default).ReadToEnd();
            return jsonContent;
        }
    }

    [DataContract]
    class RevisionInfo
    {
        public RevisionInfo(string inspectId, string caption, string dateTime, int issueCount)
        {
            InspectId = inspectId;
            Caption = caption;
            DateTime = dateTime;
            IssueCount = issueCount;
        }

        [DataMember(Name = "id", Order = 1)]
        public string InspectId { get; private set; }

        [DataMember(Name = "caption", Order = 2)]
        public string Caption { get; private set; }

        [DataMember(Name = "dateTime", Order = 3)]
        public string DateTime { get; private set; }

        [DataMember(Name = "issueCount", Order = 4)]
        public int IssueCount { get; private set; }
    }

    [DataContract]
    class IssueType
    {
        public IssueType(string id, string category, string categoryId, string description, string severity, string wikiUrl, string subCategory)
        {
            Id = id;
            Category = category;
            CategoryId = categoryId;
            Description = description;
            Severity = severity;
            WikiUrl = wikiUrl;
            SubCategory = subCategory;
        }

        [DataMember(Name = "id", Order = 0)]
        public string Id { get; private set; }

        [DataMember(Name = "category", Order = 1)]
        public string Category { get; private set; }

        [DataMember(Name = "categoryId", Order = 2)]
        public string CategoryId { get; private set; }

        [DataMember(Name = "description", Order = 3)]
        public string Description { get; private set; }

        [DataMember(Name = "severity", Order = 4)]
        public string Severity { get; private set; }

        [DataMember(Name = "wikiUrl", Order = 5)]
        public string WikiUrl { get; private set; }

        [DataMember(Name = "subCategory", Order = 6)]
        public string SubCategory { get; private set; }
    }


    [DataContract]
    class Issue
    {
        public Issue(string id, string typeId, string file, string offset, string message, ushort line, string project)
        {
            Id = id;
            TypeId = typeId;
            File = file;
            Offset = offset;
            Message = message;
            Line = line;
            Project = project;
        }

        [DataMember(Name="id", Order = 0)]
        public string Id { get; private set; }
        [DataMember(Name = "typeId", Order = 1)]
        public string TypeId { get; private set; }

        [DataMember(Name = "file", Order = 2)]
        public string File { get; private set; }

        [DataMember(Name = "offset", Order = 3)]
        public string Offset { get; private set; }

        [DataMember(Name = "message", Order = 4)]
        public string Message { get; private set; }

        [DataMember(Name = "line", Order = 5)]
        public ushort Line { get; private set; }

        [DataMember(Name = "project", Order = 6)]
        public string Project { get; private set; }
    }
}
