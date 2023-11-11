import express, { Express } from "express";
const app: Express = express();
import "dotenv/config";
import mongoose from "mongoose";
import route from "./routes";
import passport from "passport";
import JwtServices from "./services/passport";
import cors from "cors";
import path from "path";
JwtServices(passport);

// 開啟CORS中間件，允許特定來源的請求
// const corsOptions = {
//   origin: "https://localhost", // 允許的來源
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // 允許攜帶認證（例如Cookie）
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public/front-end")));

mongoose
  .connect(process.env.MongoDB as string)
  .then(() => {
    console.log("connected to mongoDb");
  })
  .catch((e: Error) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", route.authRoute);
app.use(
  "/api/certification",
  passport.authenticate("jwt", { session: false }),
  route.certificationRoute
);

app.get("*", (req, res) => {
  console.log(__dirname);

  return res.sendFile(path.join(__dirname, "public/front-end/index.html"));
});

app.listen(3001, () => {
  console.log("The application is running on port 3001");
});
