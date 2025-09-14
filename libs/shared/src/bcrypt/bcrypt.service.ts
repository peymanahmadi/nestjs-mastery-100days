import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
