import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/entities';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
