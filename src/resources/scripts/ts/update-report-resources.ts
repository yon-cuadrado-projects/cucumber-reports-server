import * as path from 'path';
import { CommonFunctions, dependencyModificationFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';

const updateResourcesProperties = async (): Promise<void> => {
  const resourcesData = '../configuration/resources-data.json';
  const resourcesFolder = path.join( __dirname, '../resources/dependencies' );
  const indexEjsFile = path.join( __dirname,'../../../lib/server/views/index.ejs' );
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( path.join( __dirname, resourcesData ) );
  if ( configurationData ) {
    await dependencyModificationFunctions.updateResources( configurationData, resourcesData, resourcesFolder, [ indexEjsFile ] );
  }
};

updateResourcesProperties().catch( error => {
  console.log( error );
} );
