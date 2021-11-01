import type * as Models from '@models';
import * as fse from 'fs-extra';
import * as path from 'path';
import { Server } from '../lib/server/server';

export class StartServer{ 
  public startServer(  ): void{
    const args = process.argv.slice( 2 );
    let config = <Models.ServerProperties>{};
    if( args.length > 1 ){
      config = <Models.ServerProperties>fse.readJSONSync( args[0] );
    }else{
      config = <Models.ServerProperties>fse.readJSONSync( path.resolve( process.cwd(), './src/scripts/serverConfiguration.json' ) );
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
