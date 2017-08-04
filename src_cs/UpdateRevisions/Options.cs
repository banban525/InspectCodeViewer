using CommandLine;

namespace UpdateRevisions
{
    class Options
    {
        [Option('o', "output", Required = false, HelpText = "\"revisions\" folder path for update.")]
        public string OutputDirectory { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            var help = new CommandLine.Text.HelpText { AddDashesToOption = true };

            help.AddPreOptionsLine("Usage: UpdateRevisions.exe");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("Usage: UpdateRevisions.exe -o <\"revisions\" directory path>");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("option:");
            help.AddOptions(this);


            return help;
        }
    }
}
