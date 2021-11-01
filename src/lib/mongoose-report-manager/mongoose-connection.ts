import type * as Models from '@models';
import mongoose from 'mongoose';

export default class MoongooseConnection {
  public mongodbConfiguration: Models.MongoDbConfiguration;

  public url: string;

  public activeConnection: mongoose.Connection;

  public constructor( mongodbConfiguration: Models.MongoDbConfiguration ) {
    this.mongodbConfiguration = mongodbConfiguration;
    this.url = `mongodb://${mongodbConfiguration.dbHost}:${mongodbConfiguration.dbPort}/${mongodbConfiguration.dbName}`;
    this.setDefaultConnectionOptions();
    this.activeConnection = <mongoose.Connection>{};
  }

  public async connect(): Promise<void> {
    this.url = `mongodb://${this.mongodbConfiguration.dbHost}:${this.mongodbConfiguration.dbPort}/${this.mongodbConfiguration.dbName}`;
    await mongoose.connect( this.url, this.mongodbConfiguration.mongoDbOptions ).catch( ( error: Error ) => {
      console.log( error.message );
      throw error;
    } );

    const { connection } = mongoose;
    this.activeConnection = connection;
  }

  public async getDatabaseSize(): Promise<number> {
    await this.connect();
    const result: Models.Stats = <Models.Stats>( await this.activeConnection.db.stats( { scale: 1024 * 1024 } ) );
    return result.dataSize;
  }

  private setDefaultConnectionOptions(): void{

    if( !this.mongodbConfiguration.mongoDbOptions ){
      this.mongodbConfiguration.mongoDbOptions = <mongoose.ConnectOptions>{};
    }
  }
}
