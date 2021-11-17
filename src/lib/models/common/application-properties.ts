import type mongoose from 'mongoose';

export interface MongoDbConfiguration{
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

export interface ReportDisplay{
  showExecutionTime?: boolean;
  navigateToFeatureIfThereIsOnlyOne?: boolean;
  openReportInBrowser?: boolean;
  customStyle?: string;
  overrideStyle?: string;
  reportPath?: string;
  disableLog?: boolean;
  theme?: string;
  useCDN?: boolean;
}

export interface ServerDisplayProperties{
  port: number;
  theme?: string;
  useCDN?: boolean;
}

export interface ServerProperties{
  reportDisplay?: ReportDisplay;
  mongoDb?: MongoDbConfiguration;
  serverDisplay: ServerDisplayProperties;
}
