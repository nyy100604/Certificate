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
const models_1 = __importDefault(require("../models"));
const Joivalidation_1 = require("../services/Joivalidation");
const uploadImagesServices_1 = require("../services/uploadImagesServices");
const uploadCertiPdf_1 = require("../services/uploadCertiPdf");
require("dotenv/config");
const Certification = models_1.default.certification;
const User = models_1.default.userModel;
const UsertocertiStatus = models_1.default.userTocertiStatus;
const router = express_1.default.Router();
router.use((req, res, next) => {
    console.log("有一個route進入certification route");
    next();
});
//回傳註冊證書成功與否（於學生註冊時執行）
router.post("/registerCerti", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    try {
        let certi = yield Certification.findOne({ _id }).exec();
        certi === null || certi === void 0 ? void 0 : certi.students.push(req.user._id);
        let certisattus = new UsertocertiStatus({
            student: req.user._id,
            certiId: _id,
            status: false,
        });
        yield (certi === null || certi === void 0 ? void 0 : certi.save());
        yield certisattus.save();
        res.status(200).send("成功完成證書註冊");
    }
    catch (e) {
        console.log(e);
        res.status(500).send("無法註冊證書");
    }
}));
//上傳證書至公有區塊鏈
router.post("/uploadCerti", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { certiId, student, publicPdfFile, nftMetadata, certiHash } = req.body;
    try {
        let foundCerti = yield UsertocertiStatus.findOne({
            certiId,
            student,
        }).exec();
        console.log(foundCerti);
        foundCerti.blockchainData.publicPdfFile = publicPdfFile;
        foundCerti.blockchainData.nftMetadata = nftMetadata;
        foundCerti.blockchainData.certiHash = certiHash;
        foundCerti.publicbstatus = true;
        yield foundCerti.save();
        res.status(200).send("成功儲存區塊鏈資料");
    }
    catch (e) {
        console.log(e);
        res.status(500).send("無法儲存區塊鏈資料");
    }
}));
//上傳證書至私有區塊鏈
router.post("/uploadPyCerti", uploadCertiPdf_1.uploadPdf.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { certiId, student } = req.body;
    try {
        let foundCerti = yield UsertocertiStatus.findOne({
            certiId,
            student,
        }).exec();
        foundCerti.blockchainData.privacyPdfFile = req.file.filename;
        foundCerti.privacybstatus = true;
        console.log(foundCerti);
        yield foundCerti.save();
        res.status(200).send({
            msg: "成功儲存區塊鏈資料",
            pdf: foundCerti.blockchainData.privacyPdfFile,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("無法儲存區塊鏈資料");
    }
}));
//拒絕上傳私有區塊鏈
// router.post(
//   "/uploadPyCerti",
//   uploadPdf.single("file"),
//   async (req: any, res: Response) => {
//     const { certiId, student, privacybstatus } = req.body;
//     try {
//       let foundCerti: any = await UsertocertiStatus.findOne({
//         certiId,
//         student,
//       }).exec();
//       foundCerti.blockchainData.privacyPdfFile = req.file.filename;
//       foundCerti.privacybstatus = privacybstatus;
//       console.log(foundCerti);
//       await foundCerti.save();
//       res.status(200).send({
//         msg: "成功儲存區塊鏈資料",
//         pdf: foundCerti.blockchainData.privacyPdfFile,
//       });
//     } catch (e) {
//       console.log(e);
//       res.status(500).send("無法儲存區塊鏈資料");
//     }
//   }
// );
//尋找上傳區塊鏈的證書
router.post(`/findCerti`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student } = req.body;
    try {
        const certi = yield UsertocertiStatus.find({
            student,
            publicbstatus: true,
            privacybstatus: true,
        }).populate("certiId");
        console.log(certi);
        if (certi) {
            return res.send({
                msg: "已成功找到證書",
                certi,
                registerNum: certi.length,
            });
        }
        else {
            return res.send("找不到證書");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳你的證書");
    }
}));
//找私鏈上的資料
router.post(`/findCerti/prvacyBlockchain`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student, certiId } = req.body;
    try {
        const certi = yield UsertocertiStatus.findOne({
            student,
            certiId,
            privacybstatus: true,
        })
            .populate("student")
            .populate("certiId");
        console.log(certi);
        if (certi) {
            return res.send({
                msg: "已成功找到證書",
                certi,
            });
        }
        else {
            return res.send("找不到證書");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳你的證書");
    }
}));
//找公鏈上的資料
router.post(`/findCerti/publicBlockchain`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student, certiId } = req.body;
    try {
        const certi = yield UsertocertiStatus.findOne({
            student,
            certiId,
            publicbstatus: true,
        })
            .populate("student")
            .populate("certiId");
        console.log(certi);
        if (certi) {
            return res.send({
                msg: "已成功找到證書",
                certi,
            });
        }
        else {
            return res.send("找不到證書");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳你的證書");
    }
}));
//尋找某課程對應某人的區塊鏈的證書
// router.post(`/findCerti`, async (req: Request, res: Response) => {
//   const { student } = req.body;
//   try {
//     const certi = await UsertocertiStatus.find({
//       student,
//       status: true,
//     }).populate("certiId");
//     console.log(certi);
//     if (certi) {
//       return res.send({
//         msg: "已成功找到證書",
//         certi,
//         registerNum: certi.length,
//       });
//     } else {
//       return res.send("找不到證書");
//     }
//   } catch (e) {
//     console.log(e);
//     return res.send("無法回傳你的證書");
//   }
// });
router.post(`/studentCerti`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student } = req.body;
    try {
        const certi = yield UsertocertiStatus.find({
            student,
        }).populate("certiId");
        console.log(certi);
        if (certi) {
            return res.send({
                msg: "已成功找到證書",
                certi,
                registerNum: certi.length,
            });
        }
        else {
            return res.send("找不到證書");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳你的證書");
    }
}));
router.get(`/detail/:_id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const certiDetail = yield Certification.findOne({ _id }).populate("issuerId");
        const registerNum = yield UsertocertiStatus.find({
            publicbstatus: true,
            privacybstatus: true,
        });
        console.log(registerNum.length);
        if (certiDetail) {
            return res.send({
                msg: "已成功找到課程",
                certiDetail,
                CertiedNum: registerNum.length,
            });
        }
        else {
            return res.send("找不到課程");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳此課程");
    }
}));
//得到某證書的所有狀態(人數、發證狀態)
router.get(`/certiToStatus/:_id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    console.log(_id);
    try {
        const statusDetail = yield UsertocertiStatus.find({
            certiId: _id,
        }).populate("student", ["username", "email", "address"]);
        const issued = yield UsertocertiStatus.find({
            certiId: _id,
            status: true,
        });
        if (statusDetail) {
            return res.send({
                msg: "已成功找到證書狀態",
                statusDetail,
                issuedNum: issued.length,
            });
        }
        else {
            return res.send("找不到證書");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳此證書的狀態");
    }
}));
//特定Issuer創造的證書
router.get(`/issuertocerti/:_id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    console.log(_id);
    try {
        const certiDetail = yield Certification.find({ issuerId: _id }).populate("issuerId");
        console.log(certiDetail.length);
        if (certiDetail) {
            return res.send({
                msg: "已成功找到課程",
                certiDetail,
                registerNum: certiDetail.length,
            });
        }
        else {
            return res.send("您尚未創建任何課程");
        }
    }
    catch (e) {
        console.log(e);
        return res.send("無法回傳您的課程");
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certiAll = yield Certification.find({}).populate("issuerId");
        res.status(200).send({ certiAll, msg: "成功回傳所有證書" });
    }
    catch (e) {
        console.log(e);
        res.status(400).send("無法查詢到證書");
    }
}));
router.post("/", uploadImagesServices_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(req.file);
    const data = (0, Joivalidation_1.postCertiValidation)(req.body);
    console.log("error", (_a = data.error) === null || _a === void 0 ? void 0 : _a.details[0].message);
    if (data.error) {
        return res.status(400).send((_b = data.error) === null || _b === void 0 ? void 0 : _b.details[0].message);
    }
    console.log(req.file.filename);
    const { title, desc, issuer, _id } = req.body;
    console.log(title, desc, issuer, _id);
    if (req.user.isStudent()) {
        return res.status(400).send("只有發證者可以建立證書");
    }
    try {
        let newCerti1 = new Certification({
            title,
            file: req.file.filename,
            desc,
            issuer,
            issuerId: _id,
        });
        let saveCourse = yield newCerti1.save();
        console.log(saveCourse);
        return res.status(200).send("新證書已經儲存成功");
    }
    catch (e) {
        console.log(e);
        res.status(500).send("無法創建課程");
    }
}));
exports.default = router;
//# sourceMappingURL=certificate.js.map