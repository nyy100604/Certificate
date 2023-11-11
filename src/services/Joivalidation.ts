import Joi from "joi";

interface registerValidation {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface loginValidation {
  email: string;
  password: string;
}

interface postCerti {
  title: string;
  file: Object;
  desc: string;
  issuer: string;
  students: string;
}

export const registerValidation = (data: registerValidation) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .messages({
        "string.empty": "姓名不可輸入空值",
      })
      .min(2)
      .message("請輸入3個字以上的姓名")
      .max(30)
      .message("請輸入3個字以上的姓名"),
    email: Joi.string()
      .required()
      .messages({
        "string.empty": "不可輸入空值",
      })
      .min(7)
      .max(50)
      .email()
      .message("請輸入正確的電子信箱"),
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "電子信箱不可輸入空值",
      })
      .regex(/^[a-zA-Z0-9]{7,20}$/)
      .message("密碼必須為7-20字的數字或英文"),
    role: Joi.string().required().messages({
      "string.empty": "請選取使用者",
    }),
  });
  return schema.validate(data);
};

export const loginValidation = (data: loginValidation) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .messages({
        "string.empty": "不可輸入空值",
      })
      .min(7)
      .max(50)
      .email()
      .message("請輸入正確的電子信箱"),
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "不可輸入空值",
      })
      .regex(/^[a-zA-Z0-9]{7,20}$/)
      .message("密碼必須為7-20字的數字或英文"),
  });
  return schema.validate(data);
};

export const postCertiValidation = (data: postCerti) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "不可輸入空值",
    }),
    desc: Joi.string().required().messages({
      "string.empty": "請填證書內容",
    }),
    issuer: Joi.string().required().messages({
      "string.empty": "請填寫證書發布者",
    }),
    _id: Joi.string(),
  });
  return schema.validate(data);
};
