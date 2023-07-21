import express from "express";
import upload from "../config/multerConfig.js";
import multer from "multer";
const router = express.Router();

import FATSDBODBC from "../controllers/controllersODBC.js";

import FATSDB from "../controllers/controlletrsMSSQL.js";
import {
  checkAuthentication,
  checkRole,
  generateToken,
} from "../helpers/apiAuth.js";
import logoUpload from "../config/multerLogoConfig.js";

const storage = multer.diskStorage({
  destination: "../uploads",
  filename: function (req, file, cb) {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
var uploadee = multer({
  storage: storage,
  limits: { fileSize: 1000000000000000000000 },
});
router.use("/profile", express.static("uploads"));
const cpUpload = upload.fields([
  { name: "Image" },
  { name: "Photo" },
]);
//----------------POST_API---------------------------------------------------------
router.post("/apt_post", cpUpload, FATSDB.apt_post)
router.post("/aptbckgrd_post", FATSDB.aptbckgrd_post)
router.post("/contact_post", cpUpload, FATSDB.contact_post)
router.post("/TransactionSummary_post", FATSDB.TransactionSummary_post)
router.post("/TransactionSummaryList_post",FATSDB.TransactionSummaryList_post)
//--------------------------------------------------------------------------

//-------------------------------GET_API---------------------------------------------
router.get("/apt_GET_LIST", FATSDB.apt_GET_LIST)
router.get("/apt_GET_BYID/:APTID", FATSDB.apt_GET_BYID)
router.get("/aptbckgrd_GET_LIST", FATSDB.aptbckgrd_GET_LIST)
router.get("/aptbckgrd_GET_BYID/:APTBckgrdID", FATSDB.aptbckgrd_GET_BYID)
router.get("/contact_GET_BYID/:ContactID", FATSDB.contact_GET_BYID)
router.get("/contact_GET_LIST", FATSDB.contact_GET_LIST)
router.get("/TransactionSummary_GET_LIST", FATSDB.TransactionSummary_GET_LIST)
router.get("/TransactionSummary_GET_BYID/:TblSysNoCounterID", FATSDB.TransactionSummary_GET_BYID)
router.get("/TransactionSummaryList_GET_LIST", FATSDB.TransactionSummaryList_GET_LIST)
router.get("/TransactionSummaryList_GET_BYID/:TblSysNoCounterID",FATSDB.TransactionSummaryList_GET_BYID)
//------------------------------------------------------------------------------
//-----------------------------------PUT_API-------------------------------------
router.put("/apt_Put/:APTID", cpUpload, FATSDB.apt_Put)
router.put("/aptbckgrd_Put/:APTBckgrdID", FATSDB.aptbckgrd_Put)
router.put("/contact_Put/:ContactID", cpUpload, FATSDB.contact_Put)
router.put("/TransactionSummary_Put/:TblSysNoCounterID", FATSDB.TransactionSummary_Put)
router.put("/TransactionSummaryList_Put/:TblSysNoCounterID",FATSDB.TransactionSummaryList_Put)
//--------------------------------------------------------------------------------
//-----------------------------------DELETE_API-----------------------------------------
router.delete("/apt_DELETE_BYID/:APTID", FATSDB.apt_DELETE_BYID)
router.delete("/aptbckgrd_DELETE_BYID/:APTBckgrdID", FATSDB.aptbckgrd_DELETE_BYID)
router.delete("/contact_DELETE_BYID/:ContactID", FATSDB.contact_DELETE_BYID)
router.delete("/TransactionSummary_DELETE_BYID/:TblSysNoCounterID", FATSDB.TransactionSummary_DELETE_BYID)
router.delete("/TransactionSummaryList_DELETE_BYID/:TblSysNoCounterID",FATSDB.TransactionSummaryList_DELETE_BYID)
//----------------------------------------------------------------------------////
export default router;
