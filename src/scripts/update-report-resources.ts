import * as CommonFunctions from '@common-functions';
import type * as Models from '@models';
import * as dependencyModifycationFunctions from '@htmlResourceReferencesUpdateFunctions';
import * as path from 'path';
const resourcesData =  './resources-data.json';
const resourcesFolder = path.join( __dirname,'../resources/dependencies' );
const indexEjsFile = path.join( __dirname,'../lib/server/views/index.ejs' );

const updateResourcesProperties = async ( ): Promise<void> =>{
  const configurationData = await CommonFunctions.readJsonFile<Models.ResourceProperties[]>( path.join( __dirname, resourcesData ) );
  let dependenciesUpdated = false;
  for ( const dependency of configurationData ! ){
    // eslint-disable-next-line no-await-in-loop
    const updatedDependency = await dependencyModifycationFunctions.updateResourcesForOneDependency( dependency, resourcesFolder,[ indexEjsFile ] );
      
    if( updatedDependency ){
      dependenciesUpdated = true;
    }
  }

  if( dependenciesUpdated ){
    await CommonFunctions.saveJsonFile<Models.ResourceProperties[]>( path.join( __dirname,'./' ),resourcesData, configurationData! );
  }
};

updateResourcesProperties( ).catch( error => {
  console.log( error ); 
} );

