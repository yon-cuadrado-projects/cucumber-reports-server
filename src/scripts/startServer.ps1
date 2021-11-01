function startServer()
{
    $scriptsParentPath = (Get-Item -Path ".\").FullName
    $nodeModulesFolder = "$($scriptsParentPath)\node_modules"
    if(-Not (Test-Path $nodeModulesFolder))
    {
        & npm i
    }
    & npx ts-node -r tsconfig-paths/register -T .\src\scripts\startServer.ts
}

startServer