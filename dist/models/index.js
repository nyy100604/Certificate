"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user-model"));
const certificate_model_1 = __importDefault(require("./certificate-model"));
const userTocertiStatus_model_1 = __importDefault(require("./userTocertiStatus-model"));
exports.default = {
    userModel: user_model_1.default,
    certification: certificate_model_1.default,
    userTocertiStatus: userTocertiStatus_model_1.default,
};
//# sourceMappingURL=index.js.map