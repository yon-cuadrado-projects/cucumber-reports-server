const GenerateReport = require('../dist/src/lib/generate-report/GenerateReport.js');

var path = process.argv[2];
var projectName = process.argv[4];

console.log(`path with the json reports and the feature files: ${path}`);
console.log(`project name: ${projectName}`);

let options = {
    reportConfigurationParameters:{        
        openReportInBrowser: false,
        reportPath,
        showExecutionTime: true,
        customStyle: `${process.cwd()}/src/lib/generate-report/templates/style-dark-theme.css`
      },
      reportGenerationParameters:{
        date: new Date(),
        featuresFolder: `${process.cwd()}/test/unit/data/features`,
        jsonDir: `${process.cwd()}/test/unit/data/cucumber-report-jsons/`,
        projectName: 'Report with all the joined results',
        saveCollectedJSON: true,
        saveEnrichedJSON: true,
        saveReportInMongoDb: true,
      },
};

setTimeout(function () {
    return process.exit(0);
}, 5000);

GenerateReport(options);
