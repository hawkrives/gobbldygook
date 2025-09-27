export type Offering = {
  readonly day: string;
  readonly location?: string;
  readonly start: string;
  readonly end: string;
}

export type Course = {
  readonly type: "course";
  readonly clbid: string;
  readonly credits: number;
  readonly crsid: string;
  readonly description: Array<string>;
  readonly department: string;
  readonly enrolled: number;
  readonly gereqs: Array<string>;
  readonly groupid: string;
  readonly instructors: Array<string>;
  readonly lab?: boolean;
  readonly level: number;
  readonly max: number;
  readonly name: string;
  readonly notes?: string;
  readonly number: number | string;
  readonly pf: boolean;
  readonly prerequisites: false | string;
  readonly section: string;
  readonly status: string;
  readonly semester: number;
  readonly title?: string;
  readonly year: number;
  readonly term?: number;
  readonly offerings?: Array<Offering>;
  readonly revisions: Array<{
    readonly _updated: string;
  }>;
}
