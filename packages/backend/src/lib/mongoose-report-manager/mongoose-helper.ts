import type { MExtendedReport } from '../models/mongoose/mongoose-extended-report-schema';
import type { MFeature } from '../models/mongoose/mongoose-feature-schemas';
import type { MSTep } from '../models/mongoose/mongoose-step-schemas';
import type { MScenario } from '../models/mongoose/mongoose-scenario-schemas';
import type { Models } from 'cucumber-html-report-generator';
import type { MongoDbConfiguration } from '../models/common/application-properties';
import type { MongooseModels } from '../models/mongoose/mongoose-models';
import MongooseQueries from './mongoose-queries';
import MoongooseConnection from './mongoose-connection';
import type { ObjectID } from 'bson';
import { featureSchema } from '../models/mongoose/mongoose-feature-schemas';
import { reportsSchema } from '../models/mongoose/mongoose-extended-report-schema';
import { scenarioSchema } from '../models/mongoose/mongoose-scenario-schemas';
import { stepSchema } from '../models/mongoose/mongoose-step-schemas';

export class MongooseHelper {
  public mongooseConnection: MoongooseConnection;

  public readonly mongodbConfiguration: MongoDbConfiguration;

  private readonly ascendingOrder = -1;

  private readonly descendingOrder = 1;

  public constructor ( mongodbConfiguration: MongoDbConfiguration ) {
    this.mongodbConfiguration = mongodbConfiguration;
    this.mongooseConnection = new MoongooseConnection( this.mongodbConfiguration );
  }

  public async insertReport ( report: Models.ExtendedReport ): Promise<ObjectID> {
    const models = await this.initializeModels();
    let objectId = <ObjectID>{};
    try {
      objectId = await new MongooseQueries( models ).insertReport( report );
    } catch ( err: unknown ) {
      console.log( `error inserting a report ${( <Error>err ).message}` );
    }
    await this.mongooseConnection.close();
    return objectId;
  }

  public async getReportById ( id: ObjectID | string ): Promise<Models.ExtendedReport | null> {
    const models = await this.initializeModels();
    // let report = <Models.ExtendedReport | null>{};
    const report = await new MongooseQueries( models ).getReportById( id );
    await this.mongooseConnection.close();
    return report;
  }

  public async getAllTheElementsOrderedAndFiltered (
    orderValue: string,
    orderDirection: string,
    filterValue: string
  ): Promise<Models.Reports[]> {
    const order = orderDirection === 'asc' ? this.descendingOrder : this.ascendingOrder;
    const models = await this.initializeModels();
    const reports = await new MongooseQueries( models ).getAllTheElementsOrderedAndFiltered(
      orderValue,
      order,
      filterValue
    );
    await this.mongooseConnection.close();
    return reports;
  }

  public async deleteReportById ( id: ObjectID | string ): Promise<number> {
    const models = await this.initializeModels();
    const result = await new MongooseQueries( models ).deleteReportById( id );
    await this.mongooseConnection.close();

    return result!;
  }

  public async getDatabaseSize (): Promise<number> {
    const databaseSize = await this.mongooseConnection.getDatabaseSize();
    await this.mongooseConnection.close();
    return databaseSize;
  }

  public async isReportInDatabase ( reportId: string ): Promise<boolean> {
    const models = await this.initializeModels();
    return new MongooseQueries( models ).isReportInDatabase( reportId );
  }

  private async initializeModels (): Promise<MongooseModels> {
    await this.mongooseConnection.connect();
    return {
      featureModel: this.mongooseConnection.activeConnection.model<MFeature>(
        'Feature',
        featureSchema,
        this.mongodbConfiguration.collections!.features
      ),
      reportModel: this.mongooseConnection.activeConnection.model<MExtendedReport>(
        'ExtendedReport',
        reportsSchema,
        this.mongodbConfiguration.collections!.reports
      ),
      scenarioModel: this.mongooseConnection.activeConnection.model<MScenario>(
        'Scenario',
        scenarioSchema,
        this.mongodbConfiguration.collections!.scenarios
      ),
      stepModel: this.mongooseConnection.activeConnection.model<MSTep>(
        'Step',
        stepSchema,
        this.mongodbConfiguration.collections!.steps
      )
    };
  }
}
