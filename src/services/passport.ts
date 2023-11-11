import { PassportStatic } from "passport";
import model from "../models";
import { UserModel } from "../models/user-model";
const User: UserModel = model.userModel;
import "dotenv/config";
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
export default (passport: PassportStatic) => {
  let opts: any = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.SecretKey;
  passport.use(
    new JwtStrategy(opts, async function (
      jwt_payload: any,
      done: (arg0: unknown, arg1: any) => any
    ) {
      //   console.log(jwt_payload);
      // {
      // id: '64e57f8c938930f8233175ef',
      // email: 'nyy100604@gmail.com',
      // username: '劉威成',
      // address: '0xd778e25fF281a2161C24AEB4081081d6ecB6bB15',
      // iat: 1693056716
      // }
      try {
        const user = await User.findOne({ _id: jwt_payload.id });
        // console.log(user);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
