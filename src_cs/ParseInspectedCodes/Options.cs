using CommandLine;

namespace ParseInspectedCodes
{
    class Options
    {
        [Option('i', "input", Required = true, HelpText = "path fro a InspectCode result file")]
        public string Input { get; set; }

        [Option("id", Required = false, HelpText = "revision id if you want to change id")]
        public string Id { get; set; }

        [Option('o', "output", Required = false, HelpText = "\"revisions\" folder path for output.")]
        public string OutputDirectory { get; set; }

        [Option('b', "base", Required = false, HelpText = "base directory to seach source codes.")]
        public string ProgramBaseDirectory { get; set; }

        [Option('t', "title", Required = false, HelpText = "")]
        public string Title { get; set; }

        [Option('l', "link", Required = false, HelpText = "")]
        public string Link { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            var help = new CommandLine.Text.HelpText {AddDashesToOption = true};

            help.AddPreOptionsLine("Usage: InspectCodeVisualizer.exe -i <InspectCode Result file>");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("Usage: InspectCodeVisualizer.exe -i <InspectCode Result file> -b <source code base directory>");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("Usage: InspectCodeVisualizer.exe -i <InspectCode Result file> -o <\"revisions\" directory>");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("option:");
            help.AddOptions(this);


            return help;
        }
    }
}
