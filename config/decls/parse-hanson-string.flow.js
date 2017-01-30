// @flow
declare module 'parse-hanson-string' {
	declare type ParseOptions = {
		abbreviations: {[key: string]: string},
		titles: {[key: string]: string},
		startRule: 'Result' | 'Filter',
	};
	declare function parse(input: string, options: ParseOptions): Object;
}
