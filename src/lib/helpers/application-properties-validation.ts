import * as CommonFunctions from '@common-functions';
import type * as Models from '@models';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import moment from 'moment';

class ApplicationPropertiesValidation {

  public checkServerProperties( serverProperties: Models.ServerProperties ): Models.ServerProperties{
    const localServerProperties = serverProperties;
    return this.initializeServerParameters( localServerProperties );
  }

  public initializeReportDisplayParameters( reportConfigurationParameters: Models.ReportDisplay | undefined ): Models.ReportDisplay{
    const localReportDisplayParameters = reportConfigurationParameters ?? <Models.ReportDisplay>{} ;
    localReportDisplayParameters.navigateToFeatureIfThereIsOnlyOne = localReportDisplayParameters.navigateToFeatureIfThereIsOnlyOne ?? true;    
    localReportDisplayParameters.openReportInBrowser = localReportDisplayParameters.openReportInBrowser ?? false;     
    localReportDisplayParameters.disableLog = localReportDisplayParameters.disableLog ?? false;
    localReportDisplayParameters.theme = localReportDisplayParameters.theme === 'Dark' ? localReportDisplayParameters.theme : 'Light';

    const result = CommonFunctions.checkFolder( localReportDisplayParameters.reportPath );

    if ( !result ) {
      const date = moment().format( 'YYYY-MM-DD__HH-mm-ss' );
      localReportDisplayParameters.reportPath = path.join( os.tmpdir(),'cucumber-html-report-generator',date );
      fs.mkdirSync( localReportDisplayParameters.reportPath, { recursive: true } );
    }
    return localReportDisplayParameters;
  }

  public initializeServerParameters( serverParameters: Models.ServerProperties | undefined ): Models.ServerProperties{
       
    const reportConfiguration = this.initializeReportDisplayParameters( serverParameters?.reportDisplay );
    const mongoDbParameters = this.initializeMongoDbParameters( serverParameters?.mongoDb );
    const serverConfiguration = this.initializeServerDisplayConfiguration( serverParameters?.serverDisplay );

    return {
      mongoDb: mongoDbParameters,
      reportDisplay: reportConfiguration,
      serverDisplay: serverConfiguration
    };
  }

  public initializeServerDisplayConfiguration ( parameters: Models.ServerDisplayProperties | undefined ): Models.ServerDisplayProperties{
    return{
      port: parameters?.port ?? 3100,
      theme: parameters?.theme === 'dark' || parameters?.theme === 'light' ? parameters.theme : 'dark',
      useCDN: typeof parameters?.useCDN === 'undefined' ? false : parameters.useCDN
    };
  }

  public initializeMongoDbParameters( mongoDbParameters: Models.MongoDbConfiguration | undefined ): Models.MongoDbConfiguration{
    let localMongoDbParameters = mongoDbParameters;
    localMongoDbParameters = localMongoDbParameters ??
      {
        collections: {
          features: 'Features',
          outputs: 'Outputs',
          reports: 'Reports',
          scenarios: 'Scenarios',
          steps: 'Steps'
        },
        dbHost: 'localhost',
        dbName: 'test-multiple-cucumber-html-reports-server',
        dbPort: 27017,
      };
    
    localMongoDbParameters.collections = localMongoDbParameters.collections ?? 
    {
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
