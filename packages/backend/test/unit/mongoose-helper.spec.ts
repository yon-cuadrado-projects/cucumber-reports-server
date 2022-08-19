import * as ConsoleMessages from '../../src/lib/helpers/console-messages';
import * as path from 'path';
import { CommonFunctions } from 'cucumber-html-report-generator';
import type { Models } from 'cucumber-html-report-generator';
import type { MongoDbConfiguration } from '../../src/lib/models/common/application-properties';
import { MongooseHelper } from '../../src/lib/mongoose-report-manager/mongoose-helper';
import type { ObjectID } from 'bson';
import { mongo } from 'mongoose';
import { parse } from 'date-fns';

describe( 'mongoose-helper', () => {
  const mongoDb: MongoDbConfiguration = {
    collections: {
      features: 'Features',
      outputs: 'Outputs',
      reports: 'Reports',
      scenarios: 'Scenarios',
      steps: 'Steps'
    },
    dbHost: '127.0.0.1',
    dbName: 'test-multiple-cucumber-html-reports-mongoose',
    dbPort: 27017
  };

  const mongooseHelper = new MongooseHelper( mongoDb );
  const jsonFile1 = path.resolve( process.cwd(), './packages/backend/test/unit/data/enriched-joined-cucumber-jsons/enriched-output1.json' );
  const jsonFile2 = path.resolve( process.cwd(), './packages/backend/test/unit/data/enriched-joined-cucumber-jsons/enriched-output.json' );
  const jsonFileFeatureFiltering = path.resolve( process.cwd(), './packages/backend/test/unit/data/enriched-joined-cucumber-jsons/enriched-output-feature-filter.json' );
  const jsonFileScenarioFiltering = path.resolve( process.cwd(), './packages/backend/test/unit/data/enriched-joined-cucumber-jsons/enriched-output-scenario-filter.json' );
  const jsonFileWithErrors = path.resolve( process.cwd(),'./packages/backend/test/unit/data/enriched-joined-cucumber-jsons/invalid-report.json' );


  const descendingOrder = 'desc';
  const ascendingOrder = 'asc';
  let reportSaved1 = <Models.ExtendedReport>{};
  let reportSaved2 = <Models.ExtendedReport>{};
  let reportSavedFeatureFiltering = <Models.ExtendedReport>{};
  let reportSavedScenarioFiltering = <Models.ExtendedReport>{};
  let invalidReport = <Models.ExtendedReport>{};

  beforeAll( async () => {
    reportSaved1 = ( await CommonFunctions.readJsonFile( jsonFile1 ) )!;
    reportSaved2 = ( await CommonFunctions.readJsonFile( jsonFile2 ) )!;
    reportSavedFeatureFiltering = ( await CommonFunctions.readJsonFile( jsonFileFeatureFiltering ) )!;
    reportSavedScenarioFiltering = ( await CommonFunctions.readJsonFile( jsonFileScenarioFiltering ) )!;
    invalidReport = ( await CommonFunctions.readJsonFile( jsonFileWithErrors ) )!;
  } );

  describe( 'Happy paths', () => {
    test( 'can save a report', async () => {
      // Given
      const id = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const reportRecovered = await mongooseHelper.getReportById( id );

      // Then
      expect( reportRecovered ).toStrictEqual( reportSaved2 );
      await mongooseHelper.deleteReportById( id );
    } );

    test( 'can delete a report', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );

      // When
      await mongooseHelper.deleteReportById( id1 );
      const databaseReportId1 = await mongooseHelper.getReportById( id1 );

      // Then
      expect( databaseReportId1 ).toBeNull( );
    } );

    test( 'can get a report with id as as string', async () => {
      // Given
      const id = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const reportRecovered = await mongooseHelper.getReportById( id.toHexString() );

      // Then
      expect( reportRecovered ).toStrictEqual( reportSaved2 );
      await mongooseHelper.deleteReportById( id );
    } );

    test( 'can return all the reports filtered by feature name', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSavedFeatureFiltering );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered(
        '',
        ascendingOrder,
        "feature:Feature to use for filtering ^'@#"
      );

      // Then
      expect( results.length ).toBe( 1 );
      await mongooseHelper.deleteReportById( id1.toHexString() );
      await mongooseHelper.deleteReportById( id2.toHexString() );
    } );

    test( 'can return all the reports filtered by scenario name', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSavedScenarioFiltering );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered(
        '',
        ascendingOrder,
        'scenario:scenario for filtering:{&/%'
      );

      // Then
      expect( results.length ).toBe( 1 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    test( 'can return all the reports filtered by step name', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered(
        '',
        ascendingOrder,
        'step:Ambiguous Johnny visits the Angular homepage Ñ)/&%$'
      );

      // Then
      expect( results.length ).toBe( 1 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    test( 'can return all the reports ordered by title', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'title', ascendingOrder, '' );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'title', descendingOrder, '' );

      const resultsOrderedAsc = [ ...resultsAsc ].sort( ( firstReport, secondReport ) =>
        firstReport.title < secondReport.title ? -1 : 1
      );
      const resultsOrderedDesc = [ ...resultsDesc ].sort( ( firstReport, secondReport ) =>
        firstReport.title > secondReport.title ? -1 : 1
      );

      // Then
      expect( resultsAsc ).toStrictEqual( resultsOrderedAsc );
      expect( resultsDesc ).toStrictEqual( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    test( 'can return all the reports ordered by results.overview.date', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'executionDate', descendingOrder, '' );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'executionDate', ascendingOrder, '' );
      const resultsOrderedAsc = [ ...resultsAsc ].sort(
        ( firstReport, secondReport ) =>
          parse( `${firstReport.executionDateTime}`, 'MM-dd-yyyy hh:mm:ss', new Date() ).getTime() -
          parse( `${secondReport.executionDateTime}`, 'MM-dd-yyyy hh:mm:ss', new Date() ).getTime()
      );
      const resultsOrderedDesc = [ ...resultsDesc ].sort(
        ( firstReport, secondReport ) =>
          parse( `${secondReport.executionDateTime}`, 'MM-dd-yyyy hh:mm:ss', new Date() ).getTime() -
          parse( `${firstReport.executionDateTime}`, 'MM-cc-yyyy hh:mm:ss', new Date() ).getTime()
      );

      // Then
      expect( resultsAsc ).toStrictEqual( resultsOrderedAsc );
      expect( resultsDesc ).toStrictEqual( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    test( 'can return all the reports ordered by id', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '_id', ascendingOrder, '' );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '_id', descendingOrder, '' );

      const resultsOrderedAsc = [ ...resultsAsc ].sort( ( firstReport, secondReport ) =>
        firstReport._id > secondReport._id ? 1 : -1
      );
      const resultsOrderedDesc = [ ...resultsDesc ].sort( ( firstReport, secondReport ) =>
        firstReport._id > secondReport._id ? -1 : 1
      );

      // Then
      expect( resultsAsc ).toStrictEqual( resultsOrderedAsc );
      expect( resultsDesc ).toStrictEqual( resultsOrderedDesc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    test( 'can return all the reports ordered by result', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const resultsAsc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'result', ascendingOrder, '' );
      const resultsDesc = await mongooseHelper.getAllTheElementsOrderedAndFiltered( 'result', descendingOrder, '' );

      const resultsOrderedAsc = [ ...resultsAsc ].sort( ( firstReport, secondReport ) =>
        firstReport.resultsJoined > secondReport.resultsJoined ? 1 : -1
      );
      const resultsOrderedDesc = [ ...resultsDesc ].sort( ( firstReport, secondReport ) =>
        firstReport.resultsJoined > secondReport.resultsJoined ? -1 : 1
      );

      // Then
      expect( resultsDesc ).toStrictEqual( resultsOrderedDesc );
      expect( resultsAsc ).toStrictEqual( resultsOrderedAsc );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );

    test( 'can return all the elements', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getAllTheElementsOrderedAndFiltered( '', ascendingOrder, '' );

      // Then
      expect( results.length ).toBeGreaterThanOrEqual( 2 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );
    test( 'can get database size', async () => {
      // Given
      const id1 = await mongooseHelper.insertReport( reportSaved1 );
      const id2 = await mongooseHelper.insertReport( reportSaved2 );

      // When
      const results = await mongooseHelper.getDatabaseSize();

      // Then
      expect( results ).toBeGreaterThanOrEqual( 5.269391059875488 );
      await mongooseHelper.deleteReportById( id1 );
      await mongooseHelper.deleteReportById( id2 );
    } );
  } );
  describe( 'Failures', () => {
    test( 'returns an error when it cannot save the report', async () => {
      // Given
      const consoleStub = jest.spyOn( console, 'info' ).mockImplementation();
      // console.warn(ConsoleMessages.incorrectReport);
      // const consoleStub = sinon.stub( console, 'log' );

      // When
      await mongooseHelper.insertReport( invalidReport );

      // Then
      expect( consoleStub ).toHaveBeenCalledWith( ConsoleMessages.incorrectReport );
      consoleStub.mockRestore();
    } );

    test( 'returns an error when it cannot delete the report', async () => {
      // Given
      // const consoleStub = sinon.stub( console, 'log' );
      const consoleStub = jest.spyOn( console, 'info' ).mockImplementation();
      const oId: ObjectID = new mongo.ObjectId();

      // When
      await mongooseHelper.deleteReportById( oId );

      // Then
      expect( consoleStub ).toHaveBeenCalledWith( ConsoleMessages.reportNotFound( oId ) );
      // expect( consoleStub.calledWith( ConsoleMessages.reportNotFound( oId ) ) ).to.be.true;
      consoleStub.mockRestore();
    } );

    test( 'returns an error when it cannot display the report', async () => {
      // Given
      const consoleStub = jest.spyOn( console, 'info' ).mockImplementation();
      // const consoleStub = sinon.stub( console, 'log' );
      const oId = new mongo.ObjectId();

      // When
      await mongooseHelper.getReportById( oId );

      // Then
      expect( consoleStub ).toHaveBeenCalledWith( ConsoleMessages.reportNotFound( oId ) );
      // expect( consoleStub.calledWith( ConsoleMessages.reportNotFound( oId ) ) ).to.be.true;
      consoleStub.mockRestore();
    } );

    test( 'returns an error when it cannot connect', async () => {
      // Given
      mongooseHelper.mongodbConfiguration.dbPort = 25;
      // When
      mongooseHelper.mongodbConfiguration.mongoDbOptions = {
        serverSelectionTimeoutMS: 2,
        socketTimeoutMS: 1,
        connectTimeoutMS: 1,
        waitQueueTimeoutMS: 1
      };

      await mongooseHelper.getDatabaseSize().catch( ( err: Error ) => {
        // Then
        expect( err.message ).toContain( ConsoleMessages.invalidUrl );
      } );
    } );
  } );
} );
