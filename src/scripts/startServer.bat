@echo off
SET scriptFolder=%~dp0
echo scriptFolder "%scriptFolder%"

for %%I in ("%scriptFolder%\..") do set "batchScriptFolderParentPathName=%%~fI"
echo scriptParentFolder "%batchScriptFolderParentPathName%"

echo nodeModulesFolder "%batchScriptFolderParentPathName%\node_modules"
if not exist "%batchScriptFolderParentPathName%/node_modules" (
	cd "%batchScriptFolderParentPathName%"  && npm install && cd "%currentFolder%"
)

cd %batchScriptFolderParentPathName% && cd .. && node "%batchScriptFolderParentPathName%/server/server.js"