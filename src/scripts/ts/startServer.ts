import * as fse from 'fs-extra';
import * as path from 'path';
import { Server } from '../../lib/server/server';
import type { ServerProperties } from '../../lib/models/common/application-properties';

export class StartServer{ 
  public startServer(  ): void{
    const args = process.argv.slice( 0 );
    let config = <ServerProperties>{};
    console.log( `parameter1: ${args[0]} parameter2: ${args[1]} parameter3: "${process.argv[2]}"` );
    const filePath = process.argv[2];
    if( args.length > 1 && filePath ){
      console.log( `provided parameters file: "${filePath}"` );
      config = <ServerProperties>fse.readJSONSync( filePath );
    }else{
      console.log( 'The script will use the configuration file ./src/scripts/configuration/serverConfiguration.json' );
      config = <ServerProperties>fse.readJSONSync( path.resolve( process.cwd(), './src/scripts/configuration/serverConfiguration.json' ) );
    }
    const server = new Server( config );
    server.configureServer();
    server.startServer();
  };
}

new StartServer().startServer();

export default interface Arguments {
  [x: string]: unknown;
  browser: string;
  debug: boolean;
  maxInstances: number;
}
