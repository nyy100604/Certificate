import express, { Request, Response } from "express";
import model from "../models";
import { postCertiValidation } from "../services/Joivalidation";
import { upload } from "../services/uploadImagesServices";
import { uploadPdf } from "../services/uploadCertiPdf";
import "dotenv/config";
const Certification = model.certification;
const User = model.userModel;
const UsertocertiStatus = model.userTocertiStatus;
const router = express.Router();

router.use((req: Request, res: Response, next) => {
  console.log("有一個route進入certification route");
  next();
});

//回傳註冊證書成功與否（於學生註冊時執行）
router.post("/registerCerti", async (req: any, res: Response) => {
  const { _id } = req.body;
  try {
    let certi = await Certification.findOne({ _id }).exec();
    certi?.students.push(req.user._id);
    let certisattus = new UsertocertiStatus({
      student: req.user._id,
      certiId: _id,
      status: false,
    });
    await certi?.save();
    await certisattus.save();
    res.status(200).send("成功完成證書註冊");
  } catch (e) {
    console.log(e);
    res.status(500).send("無法註冊證書");
  }
});

//上傳證書至公有區塊鏈
router.post("/uploadCerti", async (req: any, res: Response) => {
  const { certiId, student, publicPdfFile, nftMetadata, certiHash } = req.body;
  try {
    let foundCerti: any = await UsertocertiStatus.findOne({
      certiId,
      student,
    }).exec();
    console.log(foundCerti);

    foundCerti.blockchainData.publicPdfFile = publicPdfFile;
    foundCerti.blockchainData.nftMetadata = nftMetadata;
    foundCerti.blockchainData.certiHash = certiHash;
    foundCerti.publicbstatus = true;
    await foundCerti.save();
    res.status(200).send("成功儲存區塊鏈資料");
  } catch (e) {
    console.log(e);
    res.status(500).send("無法儲存區塊鏈資料");
  }
});

//上傳證書至私有區塊鏈
router.post(
  "/uploadPyCerti",
  uploadPdf.single("file"),
  async (req: any, res: Response) => {
    const { certiId, student } = req.body;
    try {
      let foundCerti: any = await UsertocertiStatus.findOne({
        certiId,
        student,
      }).exec();
      foundCerti.blockchainData.privacyPdfFile = req.file.filename;
      foundCerti.privacybstatus = true;
      console.log(foundCerti);

      await foundCerti.save();
      res.status(200).send({
        msg: "成功儲存區塊鏈資料",
        pdf: foundCerti.blockchainData.privacyPdfFile,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("無法儲存區塊鏈資料");
    }
  }
);

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
router.post(`/findCerti`, async (req: Request, res: Response) => {
  const { student } = req.body;
  try {
    const certi = await UsertocertiStatus.find({
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
    } else {
      return res.send("找不到證書");
    }
  } catch (e) {
    console.log(e);
    return res.send("無法回傳你的證書");
  }
});

//找私鏈上的資料
router.post(
  `/findCerti/prvacyBlockchain`,
  async (req: Request, res: Response) => {
    const { student, certiId } = req.body;
    try {
      const certi = await UsertocertiStatus.findOne({
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
      } else {
        return res.send("找不到證書");
      }
    } catch (e) {
      console.log(e);
      return res.send("無法回傳你的證書");
    }
  }
);

//找公鏈上的資料
router.post(
  `/findCerti/publicBlockchain`,
  async (req: Request, res: Response) => {
    const { student, certiId } = req.body;
    try {
      const certi = await UsertocertiStatus.findOne({
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
      } else {
        return res.send("找不到證書");
      }
    } catch (e) {
      console.log(e);
      return res.send("無法回傳你的證書");
    }
  }
);

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

router.post(`/studentCerti`, async (req: Request, res: Response) => {
  const { student } = req.body;
  try {
    const certi = await UsertocertiStatus.find({
      student,
    }).populate("certiId");
    console.log(certi);

    if (certi) {
      return res.send({
        msg: "已成功找到證書",
        certi,
        registerNum: certi.length,
      });
    } else {
      return res.send("找不到證書");
    }
  } catch (e) {
    console.log(e);
    return res.send("無法回傳你的證書");
  }
});

router.get(`/detail/:_id`, async (req: Request, res: Response) => {
  const { _id } = req.params;
  try {
    const certiDetail = await Certification.findOne({ _id }).populate(
      "issuerId"
    );
    const registerNum = await UsertocertiStatus.find({
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
    } else {
      return res.send("找不到課程");
    }
  } catch (e) {
    console.log(e);
    return res.send("無法回傳此課程");
  }
});

//得到某證書的所有狀態(人數、發證狀態)
router.get(`/certiToStatus/:_id`, async (req: Request, res: Response) => {
  const { _id } = req.params;
  console.log(_id);

  try {
    const statusDetail = await UsertocertiStatus.find({
      certiId: _id,
    }).populate("student", ["username", "email", "address"]);
    const issued = await UsertocertiStatus.find({
      certiId: _id,
      status: true,
    });
    if (statusDetail) {
      return res.send({
        msg: "已成功找到證書狀態",
        statusDetail,
        issuedNum: issued.length,
      });
    } else {
      return res.send("找不到證書");
    }
  } catch (e) {
    console.log(e);
    return res.send("無法回傳此證書的狀態");
  }
});

//特定Issuer創造的證書
router.get(`/issuertocerti/:_id`, async (req: Request, res: Response) => {
  const { _id } = req.params;
  console.log(_id);

  try {
    const certiDetail = await Certification.find({ issuerId: _id }).populate(
      "issuerId"
    );
    console.log(certiDetail.length);

    if (certiDetail) {
      return res.send({
        msg: "已成功找到課程",
        certiDetail,
        registerNum: certiDetail.length,
      });
    } else {
      return res.send("您尚未創建任何課程");
    }
  } catch (e) {
    console.log(e);
    return res.send("無法回傳您的課程");
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const certiAll = await Certification.find({}).populate("issuerId");
    res.status(200).send({ certiAll, msg: "成功回傳所有證書" });
  } catch (e) {
    console.log(e);

    res.status(400).send("無法查詢到證書");
  }
});

router.post("/", upload.single("file"), async (req: any, res: Response) => {
  console.log(req.file);

  const data = postCertiValidation(req.body);
  console.log("error", data.error?.details[0].message);

  if (data.error) {
    return res.status(400).send(data.error?.details[0].message);
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
    let saveCourse = await newCerti1.save();
    console.log(saveCourse);
    return res.status(200).send("新證書已經儲存成功");
  } catch (e) {
    console.log(e);
    res.status(500).send("無法創建課程");
  }
});

export default router;
