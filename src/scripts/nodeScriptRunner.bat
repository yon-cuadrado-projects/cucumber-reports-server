@echo off
SET scriptFolder=%~dp0
echo scriptFolder "%scriptFolder%"
set currentFolder=%cd%
echo currentFolder: "%currentFolder%"
REM SET "batcScriptFolderPathName=%~pd0"
REM echo batchScriptFolderPathName "%batchScriptFolderPathName%"
for %%I in ("%scriptFolder%\..") do set "batchScriptFolderParentPathName=%%~fI"
REM echo scriptParentFolder "%scriptParentFolder%"
echo batchScriptFolderParentPathName "%batchScriptFolderParentPathName%"


if "%~1"== "" (
	echo no argument
	set projectFolder=%currentFolder%
	echo projectFolder: %currentFolder%
) else (
	echo argument
	set projectFolder=%1
	echo projectFolder: %currentFolder%
)

rem echo projectFolder "%projectFolder%"

for %%a in ("%projectFolder%") do set "projectName=%%~nxa"
echo projectName: "%projectName%"

echo nodeModulesFolder "%batchScriptFolderParentPathName%\node_modules"
if not exist "%batchScriptFolderParentPathName%/node_modules" (
	cd "%batchScriptFolderParentPathName%"  && npm install && cd "%currentFolder%"
)

REM remove backslash from variable
IF "%scriptFolder:~-1%"=="\" SET scriptFolder=%scriptFolder:~0,-1%
rem set BuildDir=%~dp0 && set BuildDir=!BuildDir:~0,-1!
echo variableWithBackSlashRemoved "%scriptFolder%"

rem echo projectFolder: "%projectFolder%" scriptFolder: "%scriptFolder%" projectName: "%projectName%"
echo node "%scriptFolder%/executeJsFunctionGenerateReport.js" "%projectFolder%" "%scriptFolder%" "%projectName%"
node "%scriptFolder%/executeJsFunctionGenerateReport.js" "%projectFolder%" "%scriptFolder%" "%projectName%"


