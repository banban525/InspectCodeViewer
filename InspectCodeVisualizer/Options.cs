using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommandLine;

namespace InspectCodeVisualizer
{
    class Options
    {
        [Option('i', "input", Required = true, HelpText = "set a InspectCode result file")]
        public string Input { get; set; }

        [Option("id", Required = false, HelpText = "")]
        public string Id { get; set; }

        [Option('o', "output", Required = true, HelpText = "")]
        public string OutputDirectory { get; set; }

        [Option('b', "base", Required = true, HelpText = "")]
        public string ProgramBaseDirectory { get; set; }

        [Option('t', "title", Required = false, HelpText = "")]
        public string Title { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            var help = new CommandLine.Text.HelpText {AddDashesToOption = true};

            help.AddPreOptionsLine("Usage: InspectCodeVisualizer.exe -i <InspectCode Result file> -o <output directory>");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("option:");
            help.AddOptions(this);


            return help;
        }
    }
}
