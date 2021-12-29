param(
    [String]$configFile
)

function startServer($configurationPath)
{
    $scriptsParentPath = (Get-Item -Path ".\").FullName
    $nodeModulesFolder = "$([string]$scriptsParentPath)\node_modules"
    if(-Not (Test-Path $nodeModulesFolder))
    {
        & npm i
    }
    & npx ts-node -r tsconfig-paths/register -T .\src\scripts\ts\startServer.ts "$configurationPath"
}

startServer "$configFile"
