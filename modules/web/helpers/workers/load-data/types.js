// @flow

export type InfoFileTypeEnum = 'courses' | 'areas';

export type InfoIndexFile = {
    type: InfoFileTypeEnum,
    files: InfoFileRef[],
};

export type InfoFileRef = {
    type: 'json' | 'xml' | 'csv' | 'yaml',
    year?: number,
    path: string,
    hash: string,
};
