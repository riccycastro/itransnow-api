import { Req } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationConstraint } from '../Type/Type.core';
import { generateEdgeDataStructure } from '../View/structure';

export class ControllerCore {
  protected async HandleValidationErrors(
    validationErrors: ValidationError[],
  ): Promise<ValidationConstraint> {
    const constraints: ValidationConstraint = {};

    for (const error of validationErrors) {
      constraints[error.property] = Object.keys(error.constraints).map(
        (key) => {
          return error.constraints[key];
        },
      )[0];
    }

    return constraints;
  }

  protected flashSuccessNotification(
    notification: string,
    @Req() req,
    data: any = undefined,
  ): void {
    const flash = generateEdgeDataStructure();

    flash.notification.success.push(notification);

    req.flash('edge', flash);
    req.flash('data', data);
  }

  protected flashErrorNotification(
    notification: string,
    @Req() req,
    errors: any = undefined,
    data: any = undefined,
  ): void {
    const flash = generateEdgeDataStructure();

    flash.notification.error.push(notification);
    flash.form.error.data = errors;

    req.flash('edge', flash);
    req.flash('data', Object.assign({}, data));
  }
}
