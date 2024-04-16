import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthType } from '../types';

export function Auth({ type = AuthType.access }: { type?: AuthType }) {
  return applyDecorators(UseGuards(AuthGuard(type)));
}
