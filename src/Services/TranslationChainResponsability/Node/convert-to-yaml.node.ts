import * as Json2Yaml from 'json2yaml';

export class ConvertToYamlNode {
  apply(data: any) {
    return Json2Yaml.stringify(data);
  }
}
