import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '@common/interface';

type CurrentUserKey = keyof JwtPayload;

export const CurrentUser = createParamDecorator<CurrentUserKey | undefined>(
  (data: CurrentUserKey | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user: JwtPayload | undefined = req.user;

    if (!data) return user;

    return user ? user[data] : undefined;
  },
);
