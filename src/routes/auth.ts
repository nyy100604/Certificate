import express from "express";
import models from "./../models";
const router = express.Router();
const User = models.userModel;
import { registerValidation, loginValidation } from "../services/Joivalidation";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Web3 from "web3";
const infuraApi = process.env.InfuraApi;
let web3 = new Web3(infuraApi as string);
router.use((req, res, next) => {
  console.log("有一個request進入auth route");
  next();
});

router.get("/apiTest", (req, res) => {
  res.status(200).send("成功連結 auth route");
});

router.post("/register", async (req, res) => {
  //驗證註冊的資料是否符合規範
  let data = registerValidation(req.body);
  console.log(data);

  if (data.error) {
    return res.status(400).send(data.error.details[0].message);
  }
  //確認信箱是否註冊過
  const existEmail = await User.findOne({ email: req.body.email });
  if (existEmail) return res.status(400).send("此信箱已被註冊過了！");

  //製作新用戶
  const { address } = web3.eth.accounts.create();
  console.log(address);

  let { username, email, password, role } = req.body;
  let newUser = new User({ email, username, password, address, role });

  try {
    const savedUser = await newUser.save();
    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
        address: savedUser.address,
      },
      process.env.SecretKey as string
    );
    res.status(200).send({
      token: "bearer " + token,
      user: savedUser,
      msg: "成功註冊",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("無法儲存使用者");
  }
});

router.post("/login", async (req, res) => {
  //驗證登入的資料是否符合規範
  const data = loginValidation(req.body);
  if (data.error) {
    return res.status(400).send(data.error.details[0].message);
  }
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(400).send("無法找到使用者請確認信箱是否正確");
  }
  foundUser.comparePassword(
    req.body.password,
    (err: Error | null, isMatch: boolean) => {
      if (err) return res.status(500).send(err); // 注意這裡使用 res.status(500) 返回內部伺服器錯誤
      if (isMatch) {
        const token = jwt.sign(
          {
            id: foundUser._id,
            email: foundUser.email,
            username: foundUser.username,
            address: foundUser.address,
          },
          process.env.SecretKey as string
        );
        return res.status(200).send({
          token: "bearer " + token,
          user: foundUser,
          msg: "登入成功",
        });
      } else {
        return res.status(400).send("密碼錯誤");
      }
    }
  );
});

export default router;
