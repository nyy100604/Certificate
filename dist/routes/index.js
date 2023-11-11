"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("./auth"));
const certificate_1 = __importDefault(require("./certificate"));
exports.default = {
    authRoute: auth_1.default,
    certificationRoute: certificate_1.default,
};
//# sourceMappingURL=index.js.map