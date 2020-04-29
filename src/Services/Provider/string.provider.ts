import { remove as removeDiacritics } from 'diacritics';

export class StringProvider {
  generateRandomString(length: number): string {
    return [...Array(length)]
      .map(i => (~~(Math.random() * 36)).toString(36))
      .join('');
  }

  generateRandomStringWithLength10(): string {
    return this.generateRandomString(10);
  }

  removeDiacritics(string: string): string {
    return removeDiacritics(string.trim().replace(/ /g, '_')).toLowerCase();
  }
}
