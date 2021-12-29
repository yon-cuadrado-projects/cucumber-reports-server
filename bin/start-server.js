#!/usr/bin/env node
const path = require('path');
const shell = require('shelljs');
const scriptName = path.basename( __filename );
const rootPath = path.join( path.dirname( require.resolve( `./${scriptName}` ) ), '../' );
console.log(`project path: ${rootPath}`);
const scriptPath = process.argv[2] ?? ""

shell.exec(`npm run-script --prefix ${rootPath} start:server "${scriptPath}"`); 