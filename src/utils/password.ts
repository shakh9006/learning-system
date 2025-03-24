import { hash, compare } from 'bcryptjs';

export const passwordHash = async (password: string): Promise<string> => {
  return await hash(password, 10);
};

export const passwordCompare = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await compare(password, hash);
};
