import * as CommonSchemas from './mongoose-common-schemas';
import type { Document, Model } from 'mongoose';
import type { Models } from 'cucumber-html-report-generator';
import { Schema } from 'mongoose';

export interface MExtendedReport extends Models.ExtendedReport, Document {
  id: any;
  _id: any;
}
export interface MReportResultsOverview extends Models.ReportResultsOverview, Document {
  _id: any;
}
export interface MReportResults extends Models.ReportResults, Document {
  _id: any;
}

export const reportResultsOverviewSchema = new Schema(
  {
    Index: { required: false, type: Number },
    date: { required: true, type: String },
    duration: { required: true, type: Number },
    durationHHMMSS: { required: true, type: String },
    icons: { required: false, type: String },
    metadata: [ { required: false, type: CommonSchemas.metadataSchema } ],
    metadataTitle: { required: false, type: String },
    reportTitle: { required: false, type: String },
    result: { required: false, type: [ CommonSchemas.resultSchema ] },
    resultStatusesJoined: { required: false, type: String },
    version: { required: false, type: String }
  },
  {
    _id: false,
    id: false
  }
);

export const reportResultsSchema = new Schema(
  {
    features: { required: true, type: CommonSchemas.moduleResultsSchema },
    overview: { required: true, type: reportResultsOverviewSchema },
    scenarios: { required: true, type: CommonSchemas.moduleResultsSchema },
    steps: { required: true, type: CommonSchemas.moduleResultsSchema }
  },
  {
    _id: false,
    id: false
  }
);

export const reportsSchema = new Schema<MExtendedReport, Model<MExtendedReport>>(
  {
    metadata: [ { required: false, type: CommonSchemas.metadataSchema } ],
    metadataTitle: { required: false, type: String },
    reportTitle: { required: false, type: String },
    results: { required: true, type: reportResultsSchema }
  },
  {
    id: false,
    toJSON: {
      versionKey: false,
      virtuals: true
    },
    toObject: {
      versionKey: false,
      virtuals: true
    }
  }
);

reportsSchema.virtual( 'features', {
  foreignField: 'reportId',
  justOne: false,
  localField: '_id',
  ref: 'Feature'
} );
