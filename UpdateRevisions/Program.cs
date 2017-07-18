using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InspectCodeVisualizer;

namespace UpdateRevisions
{
    class Program
    {
        static void Main(string[] args)
        {
            var options = new Options();
            var isValid = CommandLine.Parser.Default.ParseArgumentsStrict(args, options);
            if (isValid == false)
            {
                return;
            }
            var outputBaseDir = options.OutputDirectory;

            // Update summary json
            {
                var list = new List<RevisionInfo>();
                InspectResults previous = null;
                InspectResults first = null;
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

                    var revisionInfo = CreateRevisionInfo(inspcResults, previous, first);
                    list.Add(revisionInfo);

                    if (first == null)
                    {
                        first = inspcResults;
                    }
                    previous = inspcResults;

                }

                var summary = new InspectResultsSummary(list.ToArray());
                var summaryJson = InspectResultsSummary.Serialize(summary);
                var summaryFilePath = Path.Combine(outputBaseDir, "summary.js");
                File.WriteAllText(summaryFilePath, "var __data = \r\n" + summaryJson, Encoding.UTF8);
            }
        }


        private static RevisionInfo CreateRevisionInfo(InspectResults current, InspectResults previous, InspectResults first)
        {
            var currentRevisionInfo = CalcRevisionInfo(current.Issues, current.IssueTypess);
            
            if (previous == null || first == null)
            {
                return new RevisionInfo(
                    current.MetaInfo.InspectId,
                    current.MetaInfo.Caption,
                    current.MetaInfo.DateTime,
                    current.MetaInfo.IssueCount,
                    currentRevisionInfo,
                    currentRevisionInfo,
                    currentRevisionInfo,
                    RevisionIssuesInfo.Empty,
                    RevisionIssuesInfo.Empty);
            }

            var incresedFromPrevious = CalcRevisionInfo(
                current.Issues.Where(issue => previous.Issues.All(_ => _.Id != issue.Id)),
                current.IssueTypess);

            var incresedFromFirst = CalcRevisionInfo(
                current.Issues.Where(issue => first.Issues.All(_ => _.Id != issue.Id)),
                current.IssueTypess);

            var fixedFromPrevious = CalcRevisionInfo(
                previous.Issues.Where(issue => current.Issues.All(_ => _.Id != issue.Id)),
                previous.IssueTypess);

            var fixedFromFirst = CalcRevisionInfo(
                first.Issues.Where(issue => current.Issues.All(_ => _.Id != issue.Id)),
                first.IssueTypess);

            return new RevisionInfo(
                current.MetaInfo.InspectId,
                current.MetaInfo.Caption,
                current.MetaInfo.DateTime,
                current.MetaInfo.IssueCount,
                currentRevisionInfo,
                incresedFromPrevious,
                incresedFromFirst,
                fixedFromPrevious,
                fixedFromFirst);
        }

        private static RevisionIssuesInfo CalcRevisionInfo(IEnumerable<Issue> issues, IssueType[] issueTypes)
        {
            var groupBy = issues
                .GroupBy(_ => issueTypes.First(type => type.Id == _.TypeId).Severity)
                .Select(_ => new { Severity = _.Key, Count = _.Count() })
                .ToArray();

            var errorCount = groupBy.FirstOrDefault(_ => _.Severity == "ERROR")?.Count ?? 0;
            var warningCount = groupBy.FirstOrDefault(_ => _.Severity == "WARNING")?.Count ?? 0;
            var suggestionCount = groupBy.FirstOrDefault(_ => _.Severity == "SUGGESTION")?.Count ?? 0;
            var hintCount = groupBy.FirstOrDefault(_ => _.Severity == "HINT")?.Count ?? 0;

            var currentRevisionInfo = new RevisionIssuesInfo(errorCount, warningCount, suggestionCount, hintCount);
            return currentRevisionInfo;
        }

    }
}
