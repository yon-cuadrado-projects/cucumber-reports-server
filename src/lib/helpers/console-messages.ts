import type { ObjectID } from 'bson';


export const incorrectReport = 'ExtendedReport validation failed: results: Path `results` is required.';
export const reportNotFound = ( oId: ObjectID ): string =>`The report with the id ${oId.toHexString() } has not been found`; 
export const connectionRefused = 'connect ECONNREFUSED 127.0.0.1:25';
