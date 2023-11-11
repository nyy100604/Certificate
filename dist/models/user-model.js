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
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_2.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    role: {
        type: String,
        enum: ["issuer", "student"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
userSchema.method("isStudent", function isStudent() {
    return this.role == "student";
});
userSchema.method("isIssuer", function isIssuer() {
    return this.role == "issuer";
});
userSchema.method("comparePassword", function (password, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        let result;
        try {
            result = yield bcrypt_1.default.compare(password, this.password);
            return cb(null, result);
        }
        catch (e) {
            return cb(e, result);
        }
    });
});
//若使用者為新或正在更改密碼的話，則進行hash處理
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew || this.isModified("password")) {
            const hashValue = yield bcrypt_1.default.hash(this.password, 10);
            this.password = hashValue;
        }
        next();
    });
});
exports.default = mongoose_1.default.model("UserModel", userSchema);
//# sourceMappingURL=user-model.js.map