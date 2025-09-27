declare module "parse-hanson-string" {
  type ParseOptions = {
    abbreviations: { [key: string]: string };
    titles: { [key: string]: string };
    startRule: "Result" | "Filter";
  };
  function parse(input: string, options: ParseOptions): object;
  export = parse;
}