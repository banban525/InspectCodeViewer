
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path ( & {$MyInvocation.ScriptName}) -Parent

$inspectCodePath = "C:\temp\JetBrains.ReSharper.CommandLineTools.2017.1.20170613.162720\inspectcode.exe"
$sourceCodePath = "C:\temp\InspectCodeViewer"
$parseToolPath = Join-Path $scriptDir "dist\ParseInspectedCodes.exe"
$updateToolPath = Join-Path $scriptDir "dist\UpdateRevisions.exe"
$solutionsFileNames = @(
,".\InspectCodeVisualizer.sln"
,".\InspectCodeViewer.sln"
);
$repositoryUrlBase = "https://github.com/banban525/InspectCodeViewer/commit/{0}"


Push-Location $sourceCodePath
try
{
    & git checkout master -q
    $hashes = & git log --pretty=format:"%H"
    $hashes = $hashes[($hashes.length-1)..0]
    foreach($hash in $hashes)
    {
        $hash
        & git checkout "$hash" -q

        $solutionsFile = @($solutionsFileNames | Where-Object { Test-Path $_ } )[0]

        & $inspectCodePath --output="C:\Temp\InspectCodeVisualizer\inspectCode.result.xml" $solutionsFile "--disable-settings-layers:GlobalAll;GlobalPerProduct;SolutionPersonal;ProjectPersonal"
        
        & $parseToolPath --input "C:\Temp\InspectCodeVisualizer\inspectCode.result.xml" --base $sourceCodePath --link ($repositoryUrlBase -f ($hash)) --title ($hash.Substring(0,8))
        #break
    }
    & $updateToolPath
}
finally
{
    Pop-Location
}