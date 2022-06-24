import * as path from 'path';
import { CommonFunctions, dependencyModificationFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';
const resourcesData =  '../configuration/resources-data.json';
const resourcesFolder = path.join( __dirname,'../../../resources/dependencies' );
const indexEjsFile = path.join( __dirname,'../../../lib/server/views/index.ejs' );

const updateResourcesPropertiesInConfigurationFiles = async ( configurationData: Models.ResourceProperties[] ): Promise<boolean> =>{
  const resourcesModification = configurationData.map( async dependency => dependencyModificationFunctions.updateResourcesForOneDependency( dependency, resourcesFolder,[ indexEjsFile ] ) );

  return ( await Promise.all( resourcesModification ) ).filter( modification => modification ).length > 0;
};

const updateResourcesPropertiesConfigurationJson = async ( configurationData: Models.ResourceProperties[] ): Promise<void> =>{
  await CommonFunctions.saveJsonFile<Models.ResourceProperties[]>( path.join( __dirname,'./' ),resourcesData, configurationData );
};

const updateResourcesProperties = async (): Promise<void> =>{
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( path.join( __dirname, resourcesData ) );
  if( configurationData ){
    const isConfigurationUpdated = await updateResourcesPropertiesInConfigurationFiles( configurationData );
    if( isConfigurationUpdated ){
      await updateResourcesPropertiesConfigurationJson( configurationData );
    }
  }
};

updateResourcesProperties( ).catch( error => {
  console.log( error ); 
} );
