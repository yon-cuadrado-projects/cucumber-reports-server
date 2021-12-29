import * as fse from 'fs-extra';
import * as path from 'path';
import { Server } from '../../lib/server/server';
import type { ServerProperties } from '../../lib/models/common/application-properties';

export class StartServer{ 
  public startServer(  ): void{
    const args = process.argv.slice( 0 );
    let config = <ServerProperties>{};
    if( args.length > 1 ){
      console.log( `provided parameters file: ${args[2]}` );
      config = <ServerProperties>fse.readJSONSync( args[2] );
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
