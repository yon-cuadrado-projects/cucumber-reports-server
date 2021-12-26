import * as fs from 'fs';
import * as path from 'path';
import type { MongoDbConfiguration, ServerDisplayProperties, ServerProperties } from '../../src/lib/models/common/application-properties';
import { CommonFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';
import { Server } from '../../src/lib/server/server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';

chai.use( chaiHttp );
chai.use( sinonChai );

const { expect } = chai;
const okStatus = 200;

describe( 'server.ts', () => {
  // Given
  const serverProperties: ServerProperties = {
    mongoDb: {
      mongoDbOptions:{
        bufferCommands: false
      },
      collections: {
        features: 'Features',
        outputs: 'Outputs',
        reports: 'Reports',
        scenarios: 'Scenarios',
        steps: 'Steps'
      },
      dbHost: '127.0.0.1',
      dbName: 'test-multiple-cucumber-html-reports-server',
      dbPort: 27017,
    },
    reportDisplay: {
      navigateToFeatureIfThereIsOnlyOne: false,
      openReportInBrowser: false,
      theme: 'Dark'
    },
    serverDisplay: {
      port: 3101,
      theme: 'Dark'
    }
  };
  const server = new Server( serverProperties );
  const jsonFile = path.resolve( process.cwd(), './test/unit/data/enriched-joined-cucumber-jsons/enriched-output.json' );
  let reportSaved = <Models.ExtendedReport>{};
  
  before( async () =>{
    reportSaved = ( await CommonFunctions.readJsonFile<Models.ExtendedReport>( jsonFile ) )!;    
    const dir = path.resolve( process.cwd(), '.tmp' );
    if ( !fs.existsSync( dir ) ){
      fs.mkdirSync( dir );
    }
  } );
  
  describe( 'Happy flows', () => {
    it( 'returns an html page', async () => {
      // When
      server.configureServer();
      server.startServer();

      const res = await chai.request( server.app ).get( '/' );

      // Then
      expect( res ).to.have.status( okStatus );
      expect( res.body ).to.be.an( 'object' );
      expect( res ).to.have.property( 'type', 'text/html' );
      server.closeServer();
    } );

    it( 'returns a report from the database', async () => {
      // Given
      server.serverConfiguration.reportDisplay.reportPath = undefined;
      server.configureServer();
      server.startServer();
      const reportInsertResponse = await chai.request( server.app )
        .post( '/insertReport' )
        .send( reportSaved );

      // When
      const reportId = ( <Models.ResponseBody>reportInsertResponse.body ).reportId;
      const res = await chai.request( server.app )
        .get( '/generateReport' )
        .query( { id: reportId } );

      // Then
      expect( res ).to.have.status( okStatus );
      expect( res.body ).to.have.property( 'htmlreport' );
      expect( res ).to.have.property( 'type', 'application/json' );

      await chai.request( server.app )
        .post( '/deleteReport' ).query( { id: reportId } );
      server.closeServer();
    } );
    it( 'returns a report from the database with a value in the reportPath parameter', async () => {
      // Given
      server.serverConfiguration.reportDisplay.reportPath = path.resolve( process.cwd(), '.tmp' );
      server.configureServer();
      server.startServer();
      const reportInsertResponse = await chai.request( server.app )
        .post( '/insertReport' )
        .send( reportSaved );

      // When
      const reportId = ( <Models.ResponseBody>reportInsertResponse.body ).reportId;
      const res = await chai.request( server.app )
        .get( '/generateReport' )
        .query( { id: reportId } );

      // Then
      expect( res ).to.have.status( okStatus );
      expect( res.body ).to.have.property( 'htmlreport' );
      expect( res ).to.have.property( 'type', 'application/json' );

      await chai.request( server.app ).post( '/deleteReport' ).query( { id: reportId } );
      server.closeServer();
    } );
    it( 'can insert a json file into the database', async () => {
      // Given
      server.serverConfiguration.mongoDb.collections = undefined;
      serverProperties.mongoDb.mongoDbOptions = undefined;
      server.configureServer();
      server.startServer();

      // When
      const reportInsertResponse = await chai.request( server.app )
        .post( '/insertReport' )
        .set( 'content-type', 'application/x-www-form-urlencoded' )
        .send( reportSaved );
      const reportId = ( <Models.ResponseBody>reportInsertResponse.body ).reportId;

      // Then
      expect( reportInsertResponse ).to.have.status( okStatus );
      expect( reportInsertResponse.body ).to.have.property( 'reportInsertionResult', true );
      await chai.request( server.app )
        .post( '/deleteReport' ).query( { id: reportId } );
      server.closeServer();
    } );

    it( 'can delete a report from the database', async () => {
      // Given
      
      server.serverConfiguration.serverDisplay = <ServerDisplayProperties>{};
      server.serverConfiguration.reportDisplay = <Models.ReportDisplay>{};
      server.serverConfiguration.mongoDb = <MongoDbConfiguration>{};
      server.configureServer();
      server.startServer();
      const reportInsertResponse = await chai.request( server.app )
        .post( '/insertReport' )
        .send( reportSaved );
      const reportId = ( <Models.ResponseBody>reportInsertResponse.body ).reportId;

      // When
      const res = await chai.request( server.app )
        .post( '/deleteReport' ).query( { id: reportId } );

      // Then
      expect( res ).to.have.status( okStatus );
      expect( res.body ).to.have.property( 'isReportInDatabase', false );
      server.closeServer();
    } );
    it( 'updates the datatable sorted by the first column with descending order', async () => {
      // Given
      server.serverConfiguration = serverProperties;
      server.configureServer();
      server.startServer();
      const reportInsertResponse = await chai.request( server.app )
        .post( '/insertReport' )
        .send( reportSaved );
      const reportId = ( <Models.ResponseBody>reportInsertResponse.body ).reportId;

      // When
      const res = await chai.request( server.app )
        .get( '/mongo/get/datatable' )
        .query( { id: reportId } )
        .query( { 'columns[0]': [ { 'data': 'title', 'name': '', 'orderable': 'true', 'search': { 'regex': 'false', 'value': '' }, 'searchable': 'true' } ] } )
        .query( { 'columns[1]': [ { 'data': 'result', 'name': '', 'orderable': 'true', 'search': { 'regex': 'false', 'value': '' }, 'searchable': 'true' } ] } )
        .query( { 'columns[2]': [ { 'data': 'executionDate', 'name': '', 'orderable': 'true', 'search': { 'regex': 'false', 'value': '' }, 'searchable': 'true' } ] } )
        .query( { 'columns[3]': [ { 'data': '_id', 'name': '', 'orderable': 'true', 'regex': 'false', 'search': { 'searchable': 'true', 'value': '' } } ] } )
        .query( { 'order[0]': { 'column': '0', 'dir': 'desc' } } )
        .query( { 'search': [ { 'regex': 'false', 'value': '' } ] } );

      // Then
      expect( res ).to.have.status( okStatus );
      expect( res.body ).to.have.property( 'data' );
      expect( ( <Models.ResponseBody>res.body ).data ).not.to.equal( null );
      expect( ( <Models.ResponseBody>res.body ).data[0] ).to.have.property( '_id' );
      await chai.request( server.app )
        .post( '/deleteReport' ).query( { id: reportId } );
      server.closeServer();
    } );
  } );

  describe( 'Failures', () => {
    it( 'cannot return an non-existent report from the database', async () => {
      // Given

      // When
      server.configureServer();
      server.startServer();
      const reportId = '60ab7b0c5b4b0c84d73f3596';
      const res = await chai.request( server.app )
        .get( '/generateReport' )
        .query( { id: reportId } );

      // Then
      expect( res ).to.have.status( okStatus );
      expect( res.body ).to.have.property( 'htmlreport' );
      expect( res ).to.have.property( 'type', 'application/json' );

      server.closeServer();
    } );
  } );
} );
