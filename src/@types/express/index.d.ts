import { JwtPayload } from "jsonwebtoken";

declare namespace Express {
  export interface Request {
    user?: { userId: string; isAdmin: boolean; }; // Ajuste o tipo conforme seu payload JWT
  }
}
