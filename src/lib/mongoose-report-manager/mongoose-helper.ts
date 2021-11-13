import { Models } from 'cucumber-html-report-generator';
import MongooseQueries from './mongoose-queries';
import MoongooseConnection from './mongoose-connection';
import type { ObjectID } from 'bson';

export class MongooseHelper {
  public mongooseConnection: MoongooseConnection;
  public readonly mongodbConfiguration: Models.MongoDbConfiguration;
  private readonly ascendingOrder = -1;
  private readonly descendingOrder = 1;

  public constructor( mongodbConfiguration: Models.MongoDbConfiguration ) {
    this.mongodbConfiguration = mongodbConfiguration;
    this.mongooseConnection = new MoongooseConnection( this.mongodbConfiguration );
  }

  public async insertReport( report: Models.ExtendedReport ): Promise<ObjectID> {
    const models = await this.initalizeModels( );
    let objectId=<ObjectID>{} ;
    try{
      objectId = await new MongooseQueries( models ).insertReport( report );
    }catch( err: unknown ){
      console.log( ( <Error>err ).message );
    }
    await this.mongooseConnection.activeConnection.close();
    return objectId;
  }

  public async getReportById( id: ObjectID | string ): Promise<Models.ExtendedReport| null> {
    const models = await this.initalizeModels( );
    let report = <Models.ExtendedReport | null>{};
    report = await new MongooseQueries( models ).getReportById( id );
    await this.mongooseConnection.activeConnection.close();
    return report;
  }

  public async getAllTheElementsOrderedAndFiltered( orderValue: string, orderDirection: string, filterValue: string ): Promise<Models.Reports[]> {
    const order = orderDirection === 'asc' ? this.descendingOrder : this.ascendingOrder;
    const models = await this.initalizeModels( );
    const reports = await new MongooseQueries( models ).getAllTheElementsOrderedAndFiltered( orderValue, order, filterValue );
    await this.mongooseConnection.activeConnection.close();
    return reports;
  }

  public async deleteReportById( id: ObjectID | string ): Promise<number> {
    const models = await this.initalizeModels( );
    const result = await new MongooseQueries( models ).deleteReportById( id );
    await this.mongooseConnection.activeConnection.close();

    return result!;
  }

  public async getDatabaseSize(): Promise<number>{
    const databaseSize = await this.mongooseConnection.getDatabaseSize();
    await this.mongooseConnection.activeConnection.close();
    return databaseSize;
  }

  public async isReportInDatabase( reportId: string ): Promise<boolean>{
    const models = await this.initalizeModels( );
    return new MongooseQueries( models ).isReportInDatabase( reportId );
  }

  private async initalizeModels( ): Promise<Models.MongooseModels> {
    await this.mongooseConnection.connect();
    return {
      featureModel: this.mongooseConnection.activeConnection.model<Models.MFeature>(
        'Feature',
        Models.featureSchema,
        this.mongodbConfiguration.collections!.features,
      ),
      reportModel: this.mongooseConnection.activeConnection.model<Models.MExtendedReport>(
        'ExtendedReport',
        Models.reportsSchema,
        this.mongodbConfiguration.collections!.reports,
      ),
      scenarioModel: this.mongooseConnection.activeConnection.model<Models.MScenario>(
        'Scenario',
        Models.scenarioSchema,
        this.mongodbConfiguration.collections!.scenarios,
      ),
      stepModel: this.mongooseConnection.activeConnection.model<Models.MSTep>(
        'Step',
        Models.stepSchema,
        this.mongodbConfiguration.collections!.steps,
      ),
    };
  }
}
