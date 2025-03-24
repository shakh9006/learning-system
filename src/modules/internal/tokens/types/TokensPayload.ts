import { Roles } from '@prisma/client';

export interface TokensPayload {
  userId: number;
  email: string;
  role: Roles;
}
