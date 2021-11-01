import type { ObjectID } from 'bson';


export const incorrectReport = 'ExtendedReport validation failed: results: Path `results` is required., reportTitle: Path `reportTitle` is required., metadataTitle: Path `metadataTitle` is required.';
export const reportNotFound = ( oId: ObjectID ): string =>`The report with the id ${oId.toHexString() } has not been found`; 
