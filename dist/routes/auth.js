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
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("./../models"));
const router = express_1.default.Router();
const User = models_1.default.userModel;
const Joivalidation_1 = require("../services/Joivalidation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const web3_1 = __importDefault(require("web3"));
const infuraApi = process.env.InfuraApi;
let web3 = new web3_1.default(infuraApi);
router.use((req, res, next) => {
    console.log("有一個request進入auth route");
    next();
});
router.get("/apiTest", (req, res) => {
    res.status(200).send("成功連結 auth route");
});
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //驗證註冊的資料是否符合規範
    let data = (0, Joivalidation_1.registerValidation)(req.body);
    console.log(data);
    if (data.error) {
        return res.status(400).send(data.error.details[0].message);
    }
    //確認信箱是否註冊過
    const existEmail = yield User.findOne({ email: req.body.email });
    if (existEmail)
        return res.status(400).send("此信箱已被註冊過了！");
    //製作新用戶
    const { address } = web3.eth.accounts.create();
    console.log(address);
    let { username, email, password, role } = req.body;
    let newUser = new User({ email, username, password, address, role });
    try {
        const savedUser = yield newUser.save();
        const token = jsonwebtoken_1.default.sign({
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
            address: savedUser.address,
        }, process.env.SecretKey);
        res.status(200).send({
            token: "bearer " + token,
            user: savedUser,
            msg: "成功註冊",
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("無法儲存使用者");
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //驗證登入的資料是否符合規範
    const data = (0, Joivalidation_1.loginValidation)(req.body);
    if (data.error) {
        return res.status(400).send(data.error.details[0].message);
    }
    const foundUser = yield User.findOne({ email: req.body.email });
    if (!foundUser) {
        return res.status(400).send("無法找到使用者請確認信箱是否正確");
    }
    foundUser.comparePassword(req.body.password, (err, isMatch) => {
        if (err)
            return res.status(500).send(err); // 注意這裡使用 res.status(500) 返回內部伺服器錯誤
        if (isMatch) {
            const token = jsonwebtoken_1.default.sign({
                id: foundUser._id,
                email: foundUser.email,
                username: foundUser.username,
                address: foundUser.address,
            }, process.env.SecretKey);
            return res.status(200).send({
                token: "bearer " + token,
                user: foundUser,
                msg: "登入成功",
            });
        }
        else {
            return res.status(400).send("密碼錯誤");
        }
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map