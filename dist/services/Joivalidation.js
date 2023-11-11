"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCertiValidation = exports.loginValidation = exports.registerValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const registerValidation = (data) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "姓名不可輸入空值",
        })
            .min(2)
            .message("請輸入3個字以上的姓名")
            .max(30)
            .message("請輸入3個字以上的姓名"),
        email: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "不可輸入空值",
        })
            .min(7)
            .max(50)
            .email()
            .message("請輸入正確的電子信箱"),
        password: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "電子信箱不可輸入空值",
        })
            .regex(/^[a-zA-Z0-9]{7,20}$/)
            .message("密碼必須為7-20字的數字或英文"),
        role: joi_1.default.string().required().messages({
            "string.empty": "請選取使用者",
        }),
    });
    return schema.validate(data);
};
exports.registerValidation = registerValidation;
const loginValidation = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "不可輸入空值",
        })
            .min(7)
            .max(50)
            .email()
            .message("請輸入正確的電子信箱"),
        password: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "不可輸入空值",
        })
            .regex(/^[a-zA-Z0-9]{7,20}$/)
            .message("密碼必須為7-20字的數字或英文"),
    });
    return schema.validate(data);
};
exports.loginValidation = loginValidation;
const postCertiValidation = (data) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string().required().messages({
            "string.empty": "不可輸入空值",
        }),
        desc: joi_1.default.string().required().messages({
            "string.empty": "請填證書內容",
        }),
        issuer: joi_1.default.string().required().messages({
            "string.empty": "請填寫證書發布者",
        }),
        _id: joi_1.default.string(),
    });
    return schema.validate(data);
};
exports.postCertiValidation = postCertiValidation;
//# sourceMappingURL=Joivalidation.js.map