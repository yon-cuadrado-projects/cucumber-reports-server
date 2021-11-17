import * as fse from 'fs-extra';
import * as path from 'path';
import { Server } from '../lib/server/server';
import type { ServerProperties } from '../lib/models/common/application-properties';

export class StartServer{ 
  public startServer(  ): void{
    const args = process.argv.slice( 2 );
    let config = <ServerProperties>{};
    if( args.length > 1 ){
      config = <ServerProperties>fse.readJSONSync( args[0] );
    }else{
      config = <ServerProperties>fse.readJSONSync( path.resolve( process.cwd(), './src/scripts/serverConfiguration.json' ) );
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
