import { JwtPayload } from '@common/interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
