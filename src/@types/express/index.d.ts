import 'express';

import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
