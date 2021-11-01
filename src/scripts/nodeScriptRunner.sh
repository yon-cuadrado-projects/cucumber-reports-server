#!/bin/bash

scriptFolder="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "scriptFolder: " $scriptFolder
echo "script first argument: " $1

if [ $# -eq 0 ]; then
    projectFolder=$PWD
else    
    projectFolder="$1"
fi

echo "projectFolder:" $projectFolder

scriptParentFolder="$(dirname "$scriptFolder")"
echo "scriptParentFolder: " $scriptParentFolder

nodeModulesFolder="$scriptParentFolder"/node_modules
echo "nodeModulesFolder: " "$nodeModulesFolder"

IFS='/'; arrIN=($projectFolder); unset IFS;
projectName=${arrIN[-1]}
echo $projectName

if [ ! -d "$nodeModulesFolder" ]; then
    cd "$scriptParentFolder";npm install;cd "$projectFolder"
fi

echo "command: " node "$scriptFolder"/generate-report.js "$projectFolder" "$scriptFolder" "$projectName"
node "$scriptFolder"/executeJsFunctionGenerateReport.js "$projectFolder" "$scriptFolder" "$projectName"