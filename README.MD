cucumber-html-reports-server
===============================
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/cucumber-html-reports-server.png)](https://nodei.co/npm/cucumber-html-reports-server/)

This project provides a web interface where you can manage the reports added with the npm package [cucumber-html-report-generator](https://nodei.co/npm/cucumber-html-report-generator/).



![Snapshot - Reports dark theme](./docs/images/report-dark-theme.jpg "Snapshot - Reports dark theme")

## Install
Install this module locally with the following command:

``` bash
npm install cucumber-html-reports-server
```

Save to dependencies or dev-dependencies:

``` bash
npm install cucumber-html-reports-server --save
npm install cucumber-html-reports-server --save-dev
```

## Start
### Linux
``` bash
./src/scripts/startServer.sh configurartion-file.json
```
### Windows
```powershell
./src/scripts/startServer.ps1 configurartion-file.json
```

### configurartion-file.json
The default configuration file is the file src/scripts/configuration/serverConfiguration.json. It contains a set of minimal properties that are needed to start the server. Below is the list of all the possible properties that can be used.

```typescript
  reportDisplay: {
      showExecutionTime?: boolean;
      navigateToFeatureIfThereIsOnlyOne?: boolean;
      openReportInBrowser?: boolean;
      customStyle?: string;
      overrideStyle?: string;
      reportPath?: string;
      theme?: string;
      useCDN?: boolean;
  }
  mongoDb: {
      mongoDbOptions?: mongoose.ConnectOptions;
      dbName: string;
      dbHost: string;
      dbPort: number;
      collections?: {
        reports?: string;
        features?: string;
        scenarios?: string;
        steps?: string;
        outputs?: string;
      };
  }
  serverDisplay: {
      port: number;
      theme?: string;
      useCDN?: boolean;
  }
}
```

## Description of the options in the configuration file
 ### reportDisplay

 These parameters define how the report is going to be displayed when a report of the server is opened.

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

It controls if the execution time is displayed in the report.

#### `navigateToFeatureIfThereIsOnlyOne`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

If there is only one feature in the report and this parameter is enabled then the feature detail is opened by default when the option openReportInBrowser is active.

#### `openReportInBrowser`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

It allows to open automatically the report when it is viewed if it is false the report is only generated.

#### `customStyle`
- **Type:** `String`
- **Mandatory:** No
- **DefaultValue:** undefined

With this parameter it is possible to provide an alternative css file to the report generated. This css file will be used instead of the original file.

#### `overrideStyle`
- **Type:** `String`
- **Mandatory:** No
- **DefaultValue:** undefined

This parameter accepts a css file that is joined with the original css file of the report.

#### `reportPath`
- **Type:** `string`
- **Mandatory:** No
- **DefaultValue:** undefined

With this parameter is possible to define the folder where the report obtained from the server is going to be generated. If this parameter is not provided the report is generated in the subfolder cucumber-html-report-generator at the temp folder with the current date and time.

#### `theme`
- **Type:** `String`
- **Mandatory:** No
- **DefaultValue:** undefined

The theme parameter allows to define the theme of the server. There are two options 'dark', for dark theme and 'light', for a light theme

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False


### - mongoDb

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

### serverDisplay

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False
  

## Changelog and Releases
The Changelog and releases can be found [here](https://github.com/wswebcreation/multiple-cucumber-html-reporter/releases)

## Contributing
How to contribute can be found [here](./docs/CONTRIBUTING.md)
