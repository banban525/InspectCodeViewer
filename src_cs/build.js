let shell = require("shelljs");
let Msbuild = require("msbuild");

let basedir = `${__dirname}/..`;
let version     = shell.env["npm_package_version"];



$assemblyInfoContent =`
using System.Reflection;

[assembly: AssemblyVersion("${version}")]
[assembly: AssemblyFileVersion("${version}")]
`;

let FileSystem = require('fs');
FileSystem.writeFileSync(`${basedir}/src_cs/SharedAssemblyInfo.cs`, $assemblyInfoContent);


let msbuild = new Msbuild();

msbuild.sourcePath = `${basedir}/InspectCodeViewer.sln`;
msbuild.configuration='Release';
msbuild.version = "14.0";
msbuild.on('done',function(err,results){ 
  shell.cp(`${basedir}/src_cs/UpdateRevisions/bin/Release/*.exe`, `${basedir}/bin/`);
  shell.cp(`${basedir}/src_cs/UpdateRevisions/bin/Release/*.dll`, `${basedir}/bin/`);
  shell.cp(`${basedir}/src_cs/UpdateRevisions/bin/Release/*.json`, `${basedir}/bin/`);
  shell.cp(`${basedir}/src_cs/UpdateRevisions/bin/Release/*.config`, `${basedir}/bin/`);
});
msbuild.build();

