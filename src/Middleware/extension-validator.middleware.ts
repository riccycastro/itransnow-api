import {Injectable, NestMiddleware, NotFoundException} from "@nestjs/common";

@Injectable()
export class ExtensionValidatorMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void {
        const params = req.params[0];

        const validExtensions = ['.yaml', '.json'];

        if (params && !validExtensions.includes(params) ) {
            throw new NotFoundException(`Not a valid extension`);
        }

        req.query.extension = params;
        next();
    }
}
