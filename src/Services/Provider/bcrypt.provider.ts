import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptProvider {
  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, this.getSalt());
  }

  async compare(data: string, hash: string | number): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }

  private getSalt(): string | number {
    let salt: number | string = process.env.HASH_SALT;

    if (salt === undefined) {
      salt = 10;
    }

    //we need to make sure that if salt is a number in a string(ex: '12')
    //that it returns the value as a number type because of the rounds
    if(typeof salt === 'string' && !isNaN(Number(salt))) {
      salt = Number(salt)
    }

    return salt;
  }
}
