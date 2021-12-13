export default class BooleanProvider {
  public static toBoolean(value: any): boolean {
    const truthy = ['on', '1', 1, 'yes', 'true', true];

    if (value === undefined || value === null) {
      return false;
    }

    if (typeof value === 'string') {
      value = value.toLowerCase();
    }

    return truthy.includes(value);
  }
}
