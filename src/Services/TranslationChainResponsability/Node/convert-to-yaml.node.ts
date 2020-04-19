import * as Json2Yaml from 'json2yaml';

export class ConvertToYamlNode {
  apply(data: any): string {
    return Json2Yaml.stringify(data);
  }
}
