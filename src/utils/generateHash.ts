import * as crypto from 'crypto';

const generateHash = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

export default generateHash;
