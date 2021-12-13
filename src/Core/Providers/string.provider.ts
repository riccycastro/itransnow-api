import { remove as removeDiacritics } from 'diacritics';

export class StringProvider {
  public static generateRandomString(length: number): string {
    return [...Array(length)]
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('');
  }

  public static generateRandomStringWithLength10(): string {
    return StringProvider.generateRandomString(10);
  }

  public static removeDiacritics(string: string): string {
    return removeDiacritics(string.trim().replace(/ /g, '_')).toLowerCase();
  }
}
