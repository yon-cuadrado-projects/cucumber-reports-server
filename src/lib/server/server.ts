// import type * as Models from '@models';
import type * as http from 'http';
import * as path from 'path';
import type { Application, Request, Response } from 'express';
import type { Models } from 'cucumber-html-report-generator';
import { MongooseHelper } from '../../lib/mongoose-report-manager/mongoose-helper';
import type { ParamsDictionary } from 'express-serve-static-core';
import type QueryString from 'qs';
import express from 'express';
import { generateReport } from 'cucumber-html-report-generator';
import { userPropertiesValidation } from '../helpers/application-properties-validation';

/**
 *
 *
 * @export
 * @class Server
 */
export class Server {
  public app: Application;

  public server!: http.Server;

  public serverConfiguration: Models.ServerProperties;

  public constructor( serverConfiguration: Models.ServerProperties ) {
    this.serverConfiguration = serverConfiguration;
    this.app = express();
  }

  public configureServer (): void {
    this.serverConfiguration = userPropertiesValidation.checkServerProperties( this.serverConfiguration );
    const ascendingOrder = 'asc';
    const mongooseHelper = new MongooseHelper( this.serverConfiguration.mongoDb! );
    this.app.set( 'port', this.serverConfiguration.serverDisplay.port );
    this.app.use( '/resources', express.static( path.join( __dirname, '../../resources/dependencies' ) ) );
    this.app.set( 'views', path.join( __dirname, 'views' ) );
    this.app.set( 'view engine', 'ejs' );
    this.app.use( express.urlencoded( { extended: true, limit: '50mb', parameterLimit: 50000 } ) );
    this.app.use( express.json( { limit: '50mb' } ) );

    this.app.get( '/', async ( req, res: Response ): Promise<void> => {
      const allCollectionData = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '', ascendingOrder, '' );
      res.render( 'index', { collectionData: allCollectionData, config: this.serverConfiguration } );
    } );

    this.app.get( '/mongo/get/datatable', async ( req: Request<ParamsDictionary, unknown, unknown, QueryString.ParsedQs>, res: Response ) => {
      const orderColumnNumber = <QueryString.ParsedQs[]>req.query.order;
      const columnArray = <QueryString.ParsedQs>req.query.columns;
      const orderColumnName = ( <QueryString.ParsedQs>( columnArray[<string>( orderColumnNumber[0] ).column] ) ).data;
      const searchValue = <string>( ( <QueryString.ParsedQs>req.query.search ).value );
      const allCollectionData = await mongooseHelper.getAllTheElementsOrderedAndFiltered( <string>orderColumnName, <string>orderColumnNumber[0].dir, searchValue );
      const returnData = { data: allCollectionData, recordsFiltered: allCollectionData.length, recordsTotal: allCollectionData.length };
      res.send( returnData );
    } );

    this.app.get( '/generateReport', async ( req, res ) => {
      const reportId = req.query.id;
      const jsonReport = await mongooseHelper.getReportById( <string>reportId );
      if( jsonReport ){
        await generateReport.generateHtmlReport( this.serverConfiguration.reportDisplay, jsonReport  );
      }
      res.setHeader( 'Content-Type', 'application/json' );
      res.json( { htmlreport: jsonReport } );
    } );

    this.app.post( '/deleteReport', async ( req, res ) => {
      const reportId = <string>req.query.id;
      await mongooseHelper.deleteReportById( reportId );
      const isReportInDatabase = await mongooseHelper.isReportInDatabase( reportId );
      res.setHeader( 'Content-Type', 'application/json' );
      res.json( { isReportInDatabase } );
    } );

    this.app.post( '/insertReport', async ( req, res ) => {
      const report = <Models.ExtendedReport>req.body;
      const reportId = await mongooseHelper.insertReport( report );
      const isReportInDatabase = await mongooseHelper.isReportInDatabase( reportId.toHexString() );
      res.setHeader( 'Content-Type', 'application/json' );
      res.json( { reportInsertionResult: isReportInDatabase, reportId } );
    } );
  }

  public startServer (): void {
    this.server = this.app.listen( this.app.get( 'port' ) );
    console.log( `Server started at port ${this.serverConfiguration.serverDisplay.port}` );
  }

  public closeServer (): void {
    this.server.close();
  }
}