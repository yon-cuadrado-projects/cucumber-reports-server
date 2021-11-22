import * as path from 'path';
import { CommonFunctions, dependencyModificationFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';
const resourcesData =  '../configuration/resources-data.json';
const resourcesFolder = path.join( __dirname,'../../resources/dependencies' );
const indexEjsFile = path.join( __dirname,'../lib/server/views/index.ejs' );

const updateResourcesProperties = async ( ): Promise<void> =>{
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( path.join( __dirname, resourcesData ) );
  let dependenciesUpdated = false;
  for ( const dependency of configurationData ! ){
    // eslint-disable-next-line no-await-in-loop
    const updatedDependency = await dependencyModificationFunctions.updateResourcesForOneDependency( dependency, resourcesFolder,[ indexEjsFile ] );
      
    if( updatedDependency ){
      dependenciesUpdated = true;
    }
  }

  if( dependenciesUpdated ){
    await CommonFunctions.saveJsonFile<Models.ResourceProperties[]>( path.join( __dirname,'./' ),resourcesData, configurationData! );
  }else{
    console.log( 'All the html resources are already updated' );
  }
};

updateResourcesProperties( ).catch( error => {
  console.log( error ); 
} );
