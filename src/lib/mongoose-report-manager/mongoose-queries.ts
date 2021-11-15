import * as ConsoleMessages from '../helpers/console-messages';
import * as lodash from 'lodash';
import type { FilterQuery } from 'mongoose';
import type { Models } from 'cucumber-html-report-generator';
import type { ObjectID } from 'bson';
import { mongo } from 'mongoose';

export default class MongooseQueries {
  public models: Models.MongooseModels;

  public constructor( mongooseModels: Models.MongooseModels ) {
    this.models = mongooseModels;
  }

  /**
   * Get all the elements from mongodb database with features stored in another document
   *
   * @param {searchValue} value that is going to be searched in the name of the report.
   * if the value of the search is feature:some_text, then the database is going filtered by the reports with features with name, some_text
   * if the value of the search is scenario:some_text, then the database is going filtered by the reports with scenarios with name some_text
   * if the value of the search is step:some_text, then the database is going filtered by the reports with steps with name some_text
   * @private
   */
  public async getAllTheElementsOrderedAndFiltered(
    orderValue: string,
    orderDirection: number,
    filterValue: string,
  ): Promise<Models.Reports[]> {
    const sortObj: Record<string, number> = this.getOrderObject( orderValue, orderDirection );

    const parsedFilterValue = filterValue ? filterValue.replace( /[-[\]{}()*+?.,\\/^$|#\s]/gu, '\\$&' ) : 'undefined';
    if ( typeof parsedFilterValue !== 'undefined' && parsedFilterValue.includes( 'feature:' ) ) {
      const ids = await this.getReportIDs( parsedFilterValue );
      return this.getReportsData( sortObj, ids );
    } else if ( typeof parsedFilterValue !== 'undefined' && parsedFilterValue.includes( 'scenario:' ) ) {
      const featureIds = await this.getFeatureIDs( parsedFilterValue );
      const ids = await this.getReportIDs( '',featureIds );
      return this.getReportsData( sortObj, ids );
    } else if ( typeof parsedFilterValue !== 'undefined' && parsedFilterValue.includes( 'step:' ) ) {
      const scenariosId = await this.getScenarioIDs( parsedFilterValue );
      const featuresIds = await this.getFeatureIDs( '', scenariosId );
      const ids = await this.getReportIDs( '',featuresIds );
      return this.getReportsData( sortObj, ids );
    }
    return this.getReportsData( sortObj );
  }

  public async getFeatureIDs( filterValue: string, scenariosId?: ObjectID[] ): Promise<ObjectID[]>{
    /* istanbul ignore else */
    if( filterValue.includes( 'scenario:' ) ){
      return <ObjectID[]>( await this.models.scenarioModel.find( { name: { $regex: `${filterValue.replace( 'scenario:', '' )}` } } , { featureId: 1 } ) )
        .map( element => element.featureId );
    }else if( scenariosId?.length ) {
      return <ObjectID[]>( await this.models.scenarioModel.find().select( { featureId:1 } ) .where( '_id' ).in( scenariosId ) )
        .map( element => element.featureId );
    }
    /* istanbul ignore next */
    return <ObjectID[]>( await this.models.scenarioModel.find().select( { featureId:1 } ) )
      .map( element => element.featureId );

  }

  public async getReportIDs( filterValue: string, featureIds?: ObjectID[] ): Promise<ObjectID[]>{
    /* istanbul ignore else */
    if( filterValue.includes( 'feature:' ) ){
      return <ObjectID[]>( await this.models.featureModel.find( { name: { $regex: `${filterValue.replace( 'feature:', '' )}` } } , { reportId : 1 } ) )
        .map( element => element.reportId );
    }else if ( featureIds ){
      return <ObjectID[]>( await this.models.featureModel.find().select( { reportId: 1 } ).where( '_id' ).in( featureIds ) )
        .map( element => element.reportId );
    }
    /* istanbul ignore next */
    return <ObjectID[]>( await this.models.featureModel.find() ).map( element => element.reportId );
  }

  public async getScenarioIDs( filterValue: string ): Promise<ObjectID[]>{
    return <ObjectID[]>( await this.models.stepModel.find( { name: { $regex: filterValue.replace( 'step:', '' ) } } , { scenarioId : 1 } ) )
      .map( element => element.scenarioId );
  }

  public async getReportsData( sortOption: Record<string, number> ,ids?: ObjectID[] ): Promise<Models.Reports[]>{
    const filter: FilterQuery<Models.ExtendedReport> = ids ? { '_id': { $in: ids } }: {};
    const result =  this.models.reportModel
      .aggregate( [
        { $match: filter },
        { $project: { reportTitle: '$reportTitle', result: '$results.overview.result', date: '$results.overview.date', _id: '$_id' } },
        { $sort: sortOption }
      ] );
    return result;
  }

  public async getReportById( id: ObjectID | string ): Promise<Models.ExtendedReport | null> {
    const oId: ObjectID = typeof id === 'string' ? new mongo.ObjectID( id ) : id;
    const report = <Models.ExtendedReport>( await this.models.reportModel.findById( { _id: oId } )
      .populate( { options: { sort: { '_id': 1 } }, path: 'features' ,
                   populate : { options: { sort: { '_id': 1 } }, path: 'elements' ,
                                populate: { options: { sort: { '_id': 1 } },path: 'steps', select: '-_id' }, select: '-_id' },select: '-_id' } )
    )?.toJSON( { versionKey: false,virtuals: true } );

    if( typeof report === 'undefined' ){
      console.log( ConsoleMessages.reportNotFound( oId ) );
      return null;
    }

    report.features = report.features.map( feature => {
      feature.elements = ( feature.elements! ).map( scenario => {
        if( scenario.before?.steps.length ){
          scenario.before.steps = scenario.before.steps.map( step => this.removeFieldsFromStep( step ) );
        }
        if( scenario.after?.steps.length ){
          scenario.after.steps = scenario.after.steps.map( step => this.removeFieldsFromStep( step ) );
        }
        scenario.steps = scenario.steps?.map( step => this.removeFieldsFromStep( step ) );
        delete scenario.featureId;
        delete scenario._id;
        return scenario;
      } );
      delete feature.reportId;
      delete feature._id;
      return feature;
    }
    );
    delete report.id;
    delete report._id;
    return report;
  }

  public async isReportInDatabase( id: string ): Promise<boolean>{
    const oId = new mongo.ObjectID( id );

    const reportsFound = await this.models.reportModel.findById( { _id: oId } );
    return reportsFound !== null;
  }

  public async deleteReportById( id: ObjectID | string ): Promise<number|undefined> {
    const oId: ObjectID = typeof id === 'string' ? new mongo.ObjectId( id ) : id;
    const result = await this.models.reportModel.deleteOne( { _id: oId } );
    const features = await this.models.featureModel.find( { reportId: oId } );

    await Promise.all(
      features.map( async ( feature ) => {
        const scenariosLocal = await this.models.scenarioModel.find( { featureId: <ObjectID>feature._id } );
        await Promise.all(
          scenariosLocal.map( async ( scenario ) => {
            await this.models.stepModel.deleteMany( { scenarioId: <ObjectID>scenario._id } );
          } )
        );
        await this.models.scenarioModel.deleteMany( { featureId: scenariosLocal[0]?.featureId } );
      } )
    );
    await this.models.featureModel.deleteMany( { reportId: oId } );
    if( result.deletedCount !== 1 ){
      console.log( ConsoleMessages.reportNotFound( oId ) );
    }
    return result.deletedCount;
  }

  public async insertReport( report: Models.ExtendedReport ): Promise<ObjectID> {
    const mongoReport: Models.ExtendedReport = lodash.cloneDeep( report );
    const features = lodash.cloneDeep( report.features );
    mongoReport.features = [];    
    const element = await this.models.reportModel.create( mongoReport );
    await element.save();

    await Promise.all(
      features.map( async ( feature ) => {
        const scenarios: Models.Scenario[] | null | undefined = lodash.cloneDeep( feature.elements );
        feature.reportId = <ObjectID>element._id;
        delete feature.elements;
        const featureInDb = await this.models.featureModel.create( feature );
        await this.insertScenarios( scenarios!, <ObjectID>featureInDb._id );
      } ),
    );

    return <ObjectID>element._id;
  }

  private async insertScenarios( scenarios: Models.Scenario[], reportFeaturesId: ObjectID ): Promise<void> {
    await Promise.all(
      scenarios.map( async ( scenario ) => {
        scenario.featureId = reportFeaturesId;
        const scenarioSteps = lodash.cloneDeep( scenario.steps );
        delete scenario.steps;
        const scenarioDb = await this.models.scenarioModel.create( scenario );
        await this.insertScenarioSteps( scenarioSteps!, <ObjectID>scenarioDb._id );
      } )
    );
  }

  private async insertScenarioSteps( scenarioSteps: Models.Step[], scenarioStepsId: ObjectID ): Promise<void> {
    await Promise.all(
      scenarioSteps.map( async ( step ) => {
        step.scenarioId = scenarioStepsId;
        await this.models.stepModel.create( step );
      } )
    );
  }

  private removeFieldsFromStep( step: Models.Step ): Models.Step{
    delete step.scenarioId;
    delete step._id;
    return step;
  }

  private getOrderObject( orderValue: string, orderDirection: number ): Record<string, number>{
    const sortObj: Record<string, number> = {};
    switch( orderValue ){
    case 'title':
      sortObj.reportTitle = orderDirection;
      break;
    case 'result':
      sortObj.result = orderDirection;
      break;
    case 'executionDate':
      sortObj['results.overview.date'] = orderDirection;
      break;
    case '_id':
      sortObj._id = orderDirection;
      break;
      
    default:
      sortObj['results.overview.date'] = orderDirection;
    }
      
    return sortObj;
  }
}
