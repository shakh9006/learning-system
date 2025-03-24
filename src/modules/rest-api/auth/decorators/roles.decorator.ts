import { SetMetadata } from '@nestjs/common';
import { Roles as Role } from '@prisma/client';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
