// import {EdgeTemplateProvider} from "../Providers/edge-template.provider";

export class ControllerCore {
    async render(templatePath: string, state?: any): Promise<string> {
        return new Promise((resolve) => {
            resolve('')
        })
        // return EdgeTemplateProvider.render(templatePath, state);
    }
}
