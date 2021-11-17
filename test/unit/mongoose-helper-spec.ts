import * as ConsoleMessages from '../../src/lib/helpers/console-messages';
import * as chai from 'chai';
import * as path from 'path';
import { CommonFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';
import { MongooseHelper } from '../../src/lib/mongoose-report-manager/mongoose-helper';
import type { ObjectID } from 'bson';
import chaiAsPromised from 'chai-as-promised';
import moment from 'moment';
import { mongo } from 'mongoose';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use( sinonChai );

chai.should();
chai.use( chaiAsPromised );
const { expect } = chai;

describe( 'mongoose-helper', () => {
  const mongoDb: Models.MongoDbConfiguration ={
    collections: {
      features: 'Features',
      outputs: 'Outputs',
      reports: 'Reports',
      scenarios: 'Scenarios',
      steps: 'Steps',
    },
    dbHost: 'localhost',
    dbName: 'test-multiple-cucumber-html-reports-mongoose',
    dbPort: 27017,
  };

  const mongooseHelper = new MongooseHelper( mongoDb );
  const jsonFile1 = path.resolve( process.cwd(), './test/unit/data/enriched-joined-cucumber-jsons/enriched-output1.json' );
  const jsonFile2 = path.resolve( process.cwd(), './test/unit/data/enriched-joined-cucumber-jsons/enriched-output.json' );
  const jsonFileWithErrors = path.resolve( process.cwd(), './test/unit/data/enriched-joined-cucumber-jsons/invalid-report.json' );

  const descendingOrder = 'desc';
  const ascendingOrder = 'asc';
  let reportSaved1 = <Models.ExtendedReport>{};
  let reportSaved2 = <Models.ExtendedReport>{};
  let invalidReport = <Models.ExtendedReport>{};

  before( async () =>{
    reportSaved1 = ( await CommonFunctions.readJsonFile( jsonFile1 ) )!;
    reportSaved2 = ( await CommonFunctions.readJsonFile( jsonFile2 ) )!;
    invalidReport = ( await CommonFunctions.readJsonFile( jsonFileWithErrors ) )!;
  } );

  describe( 'Happy paths', () => {
    it( 'can save a report', async () => {
      // Given
      const id = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const reportRecovered = await mongooseHelper.getReportById( id );

      // Then
      expect( reportRecovered ).to.eql( reportSaved2 );
      await mongooseHelper.deleteReportById( id );
    } );

    it( 'can delete a report', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );
      const oId2: ObjectID | string = new mongo.ObjectId( id2 );

      // When
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( oId2 );
      const results = await mongooseHelper.getDatabaseSize();

      // Then
      expect( results ).to.eql( 0 );
    } );

    it( 'can get a report with id as as string', async () => {
    // Given
      const id = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const reportRecovered = await mongooseHelper.getReportById( id.toHexString() );

      // Then
      expect( reportRecovered ).to.eql( reportSaved2 );
      await mongooseHelper.deleteReportById( id );
    } );

    it( 'can return all the reports filtered by feature name', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered(
        '',
        ascendingOrder,
        "feature:Feature with all scenarios in status ambigous ^'@#",
      );

      // Then
      expect( results.length ).to.equal( 1 );
      await mongooseHelper.deleteReportById( id1.toHexString() );
      await mongooseHelper.deleteReportById( id2.toHexString() );
    } );

    it( 'can return all the reports filtered by scenario name', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered(
        '',
        ascendingOrder,
        'scenario:scenario with ambiguous steps:{&/%',
      );

      // Then
      expect( results.length ).to.equal( 1 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    it( 'can return all the reports filtered by step name', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered(
        '',
        ascendingOrder,
        'step:Ambiguous Johnny visits the Angular homepage Ñ)/&%$',
      );

      // Then
      expect( results.length ).to.equal( 1 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    it( 'can return all the reports ordered by title', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'title', ascendingOrder, '', );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'title',descendingOrder,'', );

      const resultsOrderedAsc = [ ...resultsAsc ].sort( ( firstReport, secondReport ) => firstReport.title < secondReport.title ? -1 : 1 );
      const resultsOrderedDesc = [ ...resultsDesc ].sort( ( firstReport, secondReport ) => firstReport.title > secondReport.title ? -1 : 1 );

      // Then
      expect( resultsAsc ).to.be.deep.equal( resultsOrderedAsc );
      expect( resultsDesc ).to.be.deep.equal( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    it( 'can return all the reports ordered by results.overview.date', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'executionDate', descendingOrder, '', );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'executionDate',ascendingOrder, '', );
      const resultsOrderedAsc = [ ...resultsAsc ].sort(
        ( firstReport, secondReport ) =>
          moment( `${firstReport.executionDateTime}`,'MM-DD-YYYY hh:mm:ss' ).toDate().getTime()
          - moment( `${secondReport.executionDateTime}`,'MM-DD-YYYY hh:mm:ss' ).toDate().getTime(),
      );
      const resultsOrderedDesc = [ ...resultsDesc ].sort(
        ( firstReport, secondReport ) =>
          moment( `${secondReport.executionDateTime}`,'MM-DD-YYYY hh:mm:ss' ).toDate().getTime()
          - moment( `${firstReport.executionDateTime}`,'MM-DD-YYYY hh:mm:ss' ).toDate().getTime(),
      );

      // Then
      expect( resultsAsc ).to.be.deep.equal( resultsOrderedAsc );
      expect( resultsDesc ).to.be.deep.equal( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    it( 'can return all the reports ordered by id', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '_id', ascendingOrder, '', );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '_id',descendingOrder,'', );

      const resultsOrderedAsc = [ ...resultsAsc ].sort( ( firstReport, secondReport ) => firstReport._id > secondReport._id ? 1 : -1 );
      const resultsOrderedDesc = [ ...resultsDesc ].sort( ( firstReport, secondReport ) => firstReport._id > secondReport._id ? -1 : 1 );

      // Then
      expect( resultsAsc ).to.be.deep.equal( resultsOrderedAsc );
      expect( resultsDesc ).to.be.deep.equal( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    it( 'can return all the reports ordered by result', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'result', ascendingOrder, '', );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'result', descendingOrder, '', );

      const resultsOrderedAsc = [ ...resultsAsc ].sort( ( firstReport, secondReport ) => firstReport.resultsJoined > secondReport.resultsJoined ? 1: -1 );
      const resultsOrderedDesc = [ ...resultsDesc ].sort( ( firstReport, secondReport ) => firstReport.resultsJoined > secondReport.resultsJoined ? -1: 1 );

      // Then
      expect( resultsAsc ).to.be.deep.equal( resultsOrderedAsc );
      expect( resultsDesc ).to.be.deep.equal( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    it( 'can return all the elements', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '',ascendingOrder,'' );

      // Then
      expect( results.length ).to.be.least( 2 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );
    it( 'can get database size', async () => {
    // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getDatabaseSize();

      // Then
      expect( results ).to.be.least( 5.269391059875488 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );
  } );
  describe( 'Failures', () => {
    it( 'returns an error when it cannot save the report', async () => {
    // Given
      const consoleStub = sinon.stub( console, 'log' );

      // When
      await mongooseHelper.insertReport( invalidReport );

      // Then
      expect( consoleStub.calledWith( ConsoleMessages.incorrectReport ) ).to.be.true;
      consoleStub.restore();
    } );

    it( 'returns an error when it cannot delete the report', async () => {
    // Given
      const consoleStub = sinon.stub( console, 'log' );
      const oId: ObjectID = new mongo.ObjectId();

      // When
      await mongooseHelper.deleteReportById( oId );

      // Then
      expect( consoleStub.calledWith( ConsoleMessages.reportNotFound( oId ) ) ).to.be.true;
      consoleStub.restore();
    } );

    it( 'returns an error when it cannot display the report', async () => {
    // Given
      const consoleStub = sinon.stub( console, 'log' );
      const oId = new mongo.ObjectId();

      // When
      await mongooseHelper.getReportById( oId );

      // Then
      expect( consoleStub.calledWith( ConsoleMessages.reportNotFound( oId ) ) ).to.be.true;
      consoleStub.restore();
    } );
    it( 'returns an error when it cannot connect', async () => {
    // Given
      mongooseHelper.mongodbConfiguration.dbPort = 25;

      // When
      mongooseHelper.mongodbConfiguration.mongoDbOptions = {
        serverSelectionTimeoutMS: 1,
        socketTimeoutMS: 0
      };

      await mongooseHelper.getDatabaseSize().catch( ( err: Error ) => {
      // Then
        expect( err.message ).to.contain( ConsoleMessages.connectionRefused );
      } );
    } );
  } );
} );
