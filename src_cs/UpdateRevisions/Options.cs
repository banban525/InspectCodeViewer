using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommandLine;

namespace UpdateRevisions
{
    class Options
    {
        [Option('o', "output", Required = true, HelpText = "")]
        public string OutputDirectory { get; set; }

        [HelpOption]
        public string GetUsage()
        {
            var help = new CommandLine.Text.HelpText { AddDashesToOption = true };

            help.AddPreOptionsLine("Usage: UpdateRevisions.exe -o <output directory>");
            help.AddPreOptionsLine("");
            help.AddPreOptionsLine("option:");
            help.AddOptions(this);


            return help;
        }
    }
}
