import { validate } from 'class-validator';
import { ValidationConstraint } from '../Type/Type.core';
import { EdgeProvider } from '../View/edge.provider';

export class ControllerCore {
  async render(templatePath: string, state?: any): Promise<string> {
    return EdgeProvider.INSTANCE.render(templatePath, state);
  }

  protected async validate<Dto extends object>(
    dto: Dto,
  ): Promise<ValidationConstraint[]> {
    const errors = await validate(dto);

    if (!errors.length) {
      return [];
    }

    const constraints: ValidationConstraint[] = [];
    for (const error of errors) {
      constraints[error.property] = Object.keys(error.constraints).map(
        (key) => {
          return error.constraints[key];
        },
      );
    }

    return constraints;
  }

  protected flashSuccessNotification(
    notification: string,
    session: Record<string, any>,
    data: any = undefined,
  ): void {
    let flash = session.edge;

    if (!flash?.notification) {
      flash = { notification: { success: {} } };
    }
    flash.notification.success = notification;

    session.edge = flash;
    session.data = data;
  }

  protected flashErrorNotification(
    notification: string,
    session: Record<string, any>,
    errors: any = undefined,
    data: any = undefined,
  ): void {
    let flash = session.edge;

    if (!flash?.notification) {
      flash = { notification: { error: {} } };
    }
    flash.notification.error = notification;

    session.edge = flash;
    session.errors = errors;
    session.data = Object.assign({}, data);
  }
}
