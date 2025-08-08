import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestContextService } from '@common/context';
import { JwtPayload } from '@common/interface';

type CurrentUserKey = keyof JwtPayload;

export const CurrentUser = createParamDecorator<CurrentUserKey | undefined>(
  (data: CurrentUserKey | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const context: RequestContextService = req.requestContext;
    const user: JwtPayload | undefined = context.getUser();

    if (!data) return user;

    return user ? user[data] : undefined;
  },
);
