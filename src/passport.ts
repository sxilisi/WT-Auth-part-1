import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import passportJWT from "passport-jwt";
import { db } from "./db";

const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("SECRET is not defined in the environment variables");
}

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(
  new JwtStrategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload: any, done: (error: any, user?: any) => void) => {
      try {
        const user = await db.one(
          `SELECT * FROM users WHERE id=$1`,
          payload.id
        );
        console.log(user);

        return user ? done(null, user) : done(new Error("User not found."));
      } catch (error) {
        done(error);
      }
    }
  )
);
