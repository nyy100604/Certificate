"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./services/passport"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
(0, passport_2.default)(passport_1.default);
// 開啟CORS中間件，允許特定來源的請求
// const corsOptions = {
//   origin: "https://localhost", // 允許的來源
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // 允許攜帶認證（例如Cookie）
//   optionsSuccessStatus: 204,
// };
// app.use(cors(corsOptions));
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use(express_1.default.static(path_1.default.join(__dirname, "public/front-end")));
mongoose_1.default
    .connect(process.env.MongoDB)
    .then(() => {
    console.log("connected to mongoDb");
})
    .catch((e) => {
    console.log(e);
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", routes_1.default.authRoute);
app.use("/api/certification", passport_1.default.authenticate("jwt", { session: false }), routes_1.default.certificationRoute);
app.get("*", (req, res) => {
    console.log(__dirname);
    return res.sendFile(path_1.default.join(__dirname, "public/front-end/index.html"));
});
app.listen(3001, () => {
    console.log("The application is running on port 3001");
});
//# sourceMappingURL=index.js.map