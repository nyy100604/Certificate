"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const User = models_1.default.userModel;
require("dotenv/config");
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
exports.default = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.SecretKey;
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            //   console.log(jwt_payload);
            // {
            // id: '64e57f8c938930f8233175ef',
            // email: 'nyy100604@gmail.com',
            // username: '劉威成',
            // address: '0xd778e25fF281a2161C24AEB4081081d6ecB6bB15',
            // iat: 1693056716
            // }
            try {
                const user = yield User.findOne({ _id: jwt_payload.id });
                // console.log(user);
                if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            }
            catch (e) {
                return done(e, false);
            }
        });
    }));
};
//# sourceMappingURL=passport.js.map