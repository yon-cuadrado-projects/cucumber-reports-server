import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import type { 
  MongoDbConfiguration,
  ServerDisplayProperties,
  ServerProperties 
} from '../models/common/application-properties';
import { CommonFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';
import { format } from 'date-fns';

const defaultPort = 3100;

class ApplicationPropertiesValidation {
  public checkServerProperties ( serverProperties: ServerProperties ): ServerProperties {
    const localServerProperties = serverProperties;
    return this.initializeServerParameters( localServerProperties );
  }

  public initializeReportDisplayParameters ( reportConfigurationParameters: Models.ReportDisplay ): Models.ReportDisplay {
    const localReportDisplayParameters = reportConfigurationParameters;
    localReportDisplayParameters.navigateToFeatureIfThereIsOnlyOne =
      localReportDisplayParameters.navigateToFeatureIfThereIsOnlyOne ?? true;
    localReportDisplayParameters.openReportInBrowser = localReportDisplayParameters.openReportInBrowser ?? false;
    localReportDisplayParameters.theme =
      localReportDisplayParameters.theme === 'Dark' ? localReportDisplayParameters.theme : 'Light';

    const result = CommonFunctions.checkFolder( localReportDisplayParameters.reportPath );

    if ( !result ) {
      const date = format( new Date(), 'yyyy-MM-dd__HH-mm-ss' );
      localReportDisplayParameters.reportPath = path.join( os.tmpdir(), 'cucumber-html-report-generator', date );
      fs.mkdirSync( localReportDisplayParameters.reportPath, { recursive: true } );
    }
    return localReportDisplayParameters;
  }

  public initializeServerParameters ( serverParameters: ServerProperties ): ServerProperties {
    const reportConfiguration = this.initializeReportDisplayParameters( serverParameters.reportDisplay );
    const mongoDbParameters = this.initializeMongoDbParameters( serverParameters.mongoDb );
    const serverConfiguration = this.initializeServerDisplayConfiguration( serverParameters.serverDisplay );

    return {
      mongoDb: mongoDbParameters,
      reportDisplay: reportConfiguration,
      serverDisplay: serverConfiguration
    };
  }

  public initializeServerDisplayConfiguration (
    parameters: ServerDisplayProperties | undefined
  ): ServerDisplayProperties {
    return {
      port: parameters?.port ?? defaultPort,
      theme: parameters?.theme === 'Dark' || parameters?.theme === 'Light' ? parameters.theme : 'Dark',
      useCDN: typeof parameters?.useCDN === 'undefined' ? false : parameters.useCDN
    };
  }

  public initializeMongoDbParameters ( mongoDbParameters: MongoDbConfiguration ): MongoDbConfiguration {
    const localMongoDbParameters = mongoDbParameters;

    localMongoDbParameters.collections = localMongoDbParameters.collections ?? {
      features: 'Features',
      outputs: 'Outputs',
      reports: 'Reports',
      scenarios: 'Scenarios',
      steps: 'Steps'
    };

    return localMongoDbParameters;
  }
}

export const userPropertiesValidation = new ApplicationPropertiesValidation();
