// @flow

export type InfoFileTypeEnum = 'courses' | 'areas';

export type InfoIndexFile = {
    type: InfoFileTypeEnum,
    files: InfoFileRef[],
};

export type InfoFileRef = {
    type: 'json' | 'xml' | 'csv',
    year: number,
    path: string,
    hash: string,
};
