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
  { name: "ItemPhoto" }
]);
//----------------POST_API---------------------------------------------------------
router.post("/apt_post", cpUpload, FATSDB.apt_post)
router.post("/aptbckgrd_post", FATSDB.aptbckgrd_post)
router.post("/contact_post", cpUpload, FATSDB.contact_post)
router.post("/TransactionSummary_post", FATSDB.TransactionSummary_post)
router.post("/TransactionSummaryList_post", FATSDB.TransactionSummaryList_post)
router.post("/TransactionSummaryPrint_post", FATSDB.TransactionSummaryPrint_post)
router.post("/TransactionSummarytmp_post", FATSDB.TransactionSummarytmp_post)
router.post("/CardTypes_post", FATSDB.CardTypes_post)
router.post("/Companies_post", FATSDB.Companies_post)
router.post("/Customers_post", FATSDB.Customers_post)
router.post("/FEMembers_post", FATSDB.FEMembers_post)
router.post("/ItemBarcodes_post", FATSDB.ItemBarcodes_post)
router.post("/ItemBarcodesOnVan_post", FATSDB.ItemBarcodesOnVan_post)
router.post("/ItemBarcodesReturns_post", FATSDB.ItemBarcodesReturns_post)
router.post("/ItemBarcodesTmp_post", FATSDB.ItemBarcodesTmp_post)
router.post("/ItemMaster_post", cpUpload, FATSDB.ItemMaster_post)
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
router.get("/TransactionSummaryList_GET_BYID/:TblSysNoCounterID", FATSDB.TransactionSummaryList_GET_BYID)
router.get("/TransactionSummaryPrint_GET_BYID/:TblSysNoCounterID", FATSDB.TransactionSummaryPrint_GET_BYID)
router.get("/TransactionSummaryPrint_GET_LIST", FATSDB.TransactionSummaryPrint_GET_LIST)
router.get("/TransactionSummarytmp_GET_LIST", FATSDB.TransactionSummarytmp_GET_LIST)
router.get("/TransactionSummarytmp_GET_BYID/:TblSysNoCounterID", FATSDB.TransactionSummarytmp_GET_BYID)
router.get("/CardTypes_GET_BYID/:tblItemBarcodesID", FATSDB.CardTypes_GET_BYID)
router.get("/CardTypes_GET_LIST", FATSDB.CardTypes_GET_LIST)
router.get("/Companies_GET_LIST", FATSDB.Companies_GET_LIST)
router.get("/Companies_GET_BYID/:tblCompaniesID", FATSDB.Companies_GET_BYID)
router.get("/Customers_GET_BYID/:TblCustomersID", FATSDB.Customers_GET_BYID)
router.get("/Customers_GET_LIST", FATSDB.Customers_GET_LIST)
router.get("/FEMembers_GET_LIST", FATSDB.FEMembers_GET_LIST)
router.get("/FEMembers_GET_BYID/:tblLIMembersID", FATSDB.FEMembers_GET_BYID)
router.get("/temBarcodes_GET_BYID/:tblItemBarcodesID", FATSDB.temBarcodes_GET_BYID)
router.get("/ItemBarcodes_GET_LIST", FATSDB.ItemBarcodes_GET_LIST)
router.get("/ItemBarcodesOnVan_GET_LIST", FATSDB.ItemBarcodesOnVan_GET_LIST)
router.get("/ItemBarcodesOnVan_GET_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodesOnVan_GET_BYID)
router.get("/ItemBarcodesReturns_GET_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodesReturns_GET_BYID)
router.get("/ItemBarcodesReturns_GET_LIST", FATSDB.ItemBarcodesReturns_GET_LIST)
router.get("/ItemBarcodesTmp_GET_LIST", FATSDB.ItemBarcodesTmp_GET_LIST)
router.get("/ItemBarcodesTmp_GET_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodesTmp_GET_BYID)
router.get("/ItemMaster_GET_BYID/:tblItemMasterID", FATSDB.ItemMaster_GET_BYID)
router.get("/ItemMaster_GET_LIST",FATSDB.ItemMaster_GET_LIST)
//------------------------------------------------------------------------------
//-----------------------------------PUT_API-------------------------------------
router.put("/apt_Put/:APTID", cpUpload, FATSDB.apt_Put)
router.put("/aptbckgrd_Put/:APTBckgrdID", FATSDB.aptbckgrd_Put)
router.put("/contact_Put/:ContactID", cpUpload, FATSDB.contact_Put)
router.put("/TransactionSummary_Put/:TblSysNoCounterID", FATSDB.TransactionSummary_Put)
router.put("/TransactionSummaryList_Put/:TblSysNoCounterID", FATSDB.TransactionSummaryList_Put)
router.put("/TransactionSummaryPrint_Put/:TblSysNoCounterID", FATSDB.TransactionSummaryPrint_Put)
router.put("/TransactionSummarytmp_Put/:TblSysNoCounterID", FATSDB.TransactionSummarytmp_Put)
router.put("/CardTypes_Put/:tblItemBarcodesID", FATSDB.CardTypes_Put)
router.put("/Companies_Put/:tblCompaniesID", FATSDB.Companies_Put)
router.put("/Customers_Put/:TblCustomersID", FATSDB.Customers_Put)
router.put("/FEMembers_Put/:tblLIMembersID", FATSDB.FEMembers_Put)
router.put("/ItemBarcodes_Put/:tblItemBarcodesID", FATSDB.ItemBarcodes_Put)
router.put("/ItemBarcodesOnVan_Put/:tblItemBarcodesID", FATSDB.ItemBarcodesOnVan_Put)
router.put("/ItemBarcodesReturns_Put/:tblItemBarcodesID", FATSDB.ItemBarcodesReturns_Put)
router.put("/ItemBarcodesTmp_Put/:tblItemBarcodesID", FATSDB.ItemBarcodesTmp_Put)
router.put("/ItemMaster_Put/:tblItemMasterID", cpUpload, FATSDB.ItemMaster_Put)
//--------------------------------------------------------------------------------

//-----------------------------------DELETE_API-----------------------------------------
router.delete("/apt_DELETE_BYID/:APTID", FATSDB.apt_DELETE_BYID)
router.delete("/aptbckgrd_DELETE_BYID/:APTBckgrdID", FATSDB.aptbckgrd_DELETE_BYID)
router.delete("/contact_DELETE_BYID/:ContactID", FATSDB.contact_DELETE_BYID)
router.delete("/TransactionSummary_DELETE_BYID/:TblSysNoCounterID", FATSDB.TransactionSummary_DELETE_BYID)
router.delete("/TransactionSummaryList_DELETE_BYID/:TblSysNoCounterID", FATSDB.TransactionSummaryList_DELETE_BYID)
router.delete("/TransactionSummaryPrint_DELETE_BYID/:TblSysNoCounterID", FATSDB.TransactionSummaryPrint_DELETE_BYID)
router.delete("/TransactionSummarytmp_DELETE_BYID/:TblSysNoCounterID", FATSDB.TransactionSummarytmp_DELETE_BYID)
router.delete("/CardTypes_DELETE_BYID/:tblItemBarcodesID", FATSDB.CardTypes_DELETE_BYID)
router.delete("/Companies_DELETE_BYID/:tblCompaniesID", FATSDB.Companies_DELETE_BYID)
router.delete("/Customers_DELETE_BYID/:TblCustomersID", FATSDB.Customers_DELETE_BYID)
router.delete("/FEMembers_DELETE_BYID/:tblLIMembersID", FATSDB.FEMembers_DELETE_BYID)
router.delete("/ItemBarcodes_DELETE_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodes_DELETE_BYID)
router.delete("/ItemBarcodesOnVan_DELETE_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodesOnVan_DELETE_BYID)
router.delete("/ItemBarcodesReturns_DELETE_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodesReturns_DELETE_BYID)
router.delete("/ItemBarcodesTmp_DELETE_BYID/:tblItemBarcodesID", FATSDB.ItemBarcodesTmp_DELETE_BYID)
router.delete("/ItemMaster_DELETE_BYID/:tblItemMasterID",FATSDB.ItemMaster_DELETE_BYID)
//----------------------------------------------------------------------------////
export default router;
