// using mssql .....................................................................................
import jwt from "jsonwebtoken";
import sql from "mssql";

import config from "../config/dbconfig.js";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
let jwtSecret = process.env.JWT_SECRET;
let jwtExpiration = process.env.JWT_EXPIRATION;
//get all data
function generateUpdateQuery(fields, tableName) {
  const updateFields = Object.keys(fields)
    .map((key) => `${key}=@${key}`)
    .join(",");

  return `UPDATE ${tableName} SET ${updateFields}`;
}
const FATSDB = {
  //----------------------------------------------POST--------------------------------


  async apt_post(req, res, next) {
    try {
     const file = req.files["Image"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("Title", sql.VarChar, req.body.Title)
        .input("Category", sql.VarChar, req.body.Category)
        .input("Content", sql.VarChar, req.body.Content)
        .input("StartDate", sql.DateTime, req.body.StartDate)
        .input("EndDate", sql.DateTime, req.body.EndDate)
        .input("WithRepetition", sql.TinyInt, req.body.WithRepetition)
        .input("RepetitionType", sql.Numeric, req.body.RepetitionType)
        .input("RepetitionOccurrence", sql.Numeric, req.body.RepetitionOccurrence)
        .input("RepetitionEndDate", sql.DateTime, req.body.RepetitionEndDate)
        .input("RepetitionEndType", sql.Numeric, req.body.RepetitionEndType)
        .input("Importance", sql.Numeric, req.body.Importance)
        .input("Image", sql.VarChar, url)
        .input("Note", sql.VarChar, req.body.Note)
        .input("APTBckgrdID", sql.Numeric, req.body.APTBckgrdID)
       
        


        .query(
          ` 
            INSERT INTO [dbo].[apt]
                      
                      ( [Title]
                         ,[Category]
                        ,[Content]
                         ,[StartDate]
                         ,[EndDate]
                        ,[WithRepetition]
                         ,[RepetitionType]
                        ,[RepetitionOccurrence]
                         ,[RepetitionEndDate]
                         ,[RepetitionEndType]
                        ,[Importance]
                         ,[Image]
                         ,[Note]
                         ,[APTBckgrdID]
                        
                                                             
      
                        )
                 VALUES
                       (
                       @Title
                       ,@Category
                       ,@Content
                       ,@StartDate
                       ,@EndDate
                       ,@WithRepetition
                       ,@RepetitionType
                       ,@RepetitionOccurrence
                       ,@RepetitionEndDate
                       ,@RepetitionEndType
                       ,@Importance
                       ,@Image
                       ,@Note
                       ,@APTBckgrdID
                       
                       
                    
                                           
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async aptbckgrd_post(req, res, next) {
    try {
     
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("BackgroundColor", sql.VarChar, req.body.BackgroundColor)
       
   
        .query(
          ` 
            INSERT INTO [dbo].[aptbckgrd]
                      
                      ( [BackgroundColor]
                       
            
                        )
                 VALUES
                       (
                       @BackgroundColor
                     
                         
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async contact_post(req, res, next) {
    try {
     const file = req.files["Photo"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("Address", sql.VarChar, req.body.Address)
        .input("Lastname", sql.VarChar, req.body.Lastname)
        .input("FirstName", sql.VarChar, req.body.FirstName)
        .input("Spouse", sql.VarChar, req.body.Spouse)
        .input("ChildrenNames", sql.VarChar, req.body.ChildrenNames)
        .input("Notes", sql.VarChar, req.body.Notes)
        .input("ZipCode", sql.VarChar, req.body.ZipCode)
        .input("DateOfBirth", sql.Date, req.body.DateOfBirth)
        .input("SaintsDay", sql.Date, req.body.SaintsDay)
        .input("Email", sql.VarChar, req.body.Email)
        .input("Phone", sql.VarChar, req.body.Phone)
        .input("CellPhone", sql.VarChar, req.body.CellPhone)
        .input("City", sql.VarChar, req.body.City)
        .input("Photo", sql.VarChar, url)
        .input("Country", sql.VarChar, req.body.Country)
        .input("Rpt_State_dep", sql.VarChar, req.body.Rpt_State_dep)
        .input("FirstName2", sql.VarChar, req.body.FirstName2)
        .input("TransferredToOutlook", sql.TinyInt, req.body.TransferredToOutlook)
       
        


        .query(
          ` 
            INSERT INTO [dbo].[contact]
                      
                      ( [Address]
                         ,[Lastname]
                        ,[FirstName]
                         ,[Spouse]
                         ,[ChildrenNames]
                        ,[Notes]
                         ,[ZipCode]
                        ,[DateOfBirth]
                         ,[SaintsDay]
                         ,[Email]
                        ,[Phone]
                         ,[CellPhone]
                         ,[City]
                         ,[Photo]
                         ,[Country]
                         ,[Rpt_State_dep]
                         ,[FirstName2]
                         ,[TransferredToOutlook]
                        
                                                             
      
                        )
                 VALUES
                       (
                       @Address
                       ,@Lastname
                       ,@FirstName
                       ,@Spouse
                       ,@ChildrenNames
                       ,@Notes
                       ,@ZipCode
                       ,@DateOfBirth
                       ,@SaintsDay
                       ,@Email
                       ,@Phone
                       ,@CellPhone
                       ,@City
                       ,@Photo
                       ,@Country
                       ,@Rpt_State_dep
                       ,@FirstName2
                       ,@TransferredToOutlook
                   
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummary_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
         
        .query(
          ` 
            INSERT INTO [dbo].[TblAllTransactionSummary]
                      
                      ( [TransactionName]
                         ,[TotalTransaction]
                        ,[TotalTransactionAmount]
                         ,[TransactionDate]
                         ,[TrxIndexNo]
                        ,[TransactionNameArabic]
                        
                        )
                 VALUES
                       (
                       @TransactionName
                       ,@TotalTransaction
                       ,@TotalTransactionAmount
                       ,@TransactionDate
                      
                       ,@TrxIndexNo
                       ,@TransactionNameArabic
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummaryList_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
         
        .query(
          ` 
            INSERT INTO [dbo].[TblAllTransactionSummaryList]
                      
                      ( [TransactionName]
                         ,[TotalTransaction]
                        ,[TotalTransactionAmount]
                         ,[TransactionDate]
                         ,[TrxIndexNo]
                        ,[TransactionNameArabic]
                        
                        )
                 VALUES
                       (
                       @TransactionName
                       ,@TotalTransaction
                       ,@TotalTransactionAmount
                       ,@TransactionDate
                      
                       ,@TrxIndexNo
                       ,@TransactionNameArabic
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummaryPrint_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
         
        .query(
          ` 
            INSERT INTO [dbo].[TblAllTransactionSummaryPrint]
                      
                      ( [TransactionName]
                         ,[TotalTransaction]
                        ,[TotalTransactionAmount]
                         ,[TransactionDate]
                         ,[TrxIndexNo]
                        ,[TransactionNameArabic]
                        
                        )
                 VALUES
                       (
                       @TransactionName
                       ,@TotalTransaction
                       ,@TotalTransactionAmount
                       ,@TransactionDate
                      
                       ,@TrxIndexNo
                       ,@TransactionNameArabic
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummarytmp_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
         
        .query(
          ` 
            INSERT INTO [dbo].[TblAllTransactionSummarytmp]
                      
                      ( [TransactionName]
                         ,[TotalTransaction]
                        ,[TotalTransactionAmount]
                         ,[TransactionDate]
                         ,[TrxIndexNo]
                        ,[TransactionNameArabic]
                        
                        )
                 VALUES
                       (
                       @TransactionName
                       ,@TotalTransaction
                       ,@TotalTransactionAmount
                       ,@TransactionDate
                      
                       ,@TrxIndexNo
                       ,@TransactionNameArabic
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async CardTypes_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("code", sql.VarChar, req.body.code)
        .input("descFo", sql.VarChar, req.body.descFo)
        .input("id", sql.VarChar, req.body.id)
        .input("descLo", sql.VarChar, req.body.descLo)
        
         
        .query(
          ` 
            INSERT INTO [dbo].[tblCardTypes]
                      
                      ( [code]
                         ,[descFo]
                        ,[id]
                         ,[descLo]
                        )
                 VALUES
                       (
                       @code
                       ,@descFo
                       ,@id
                       ,@descLo 
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async Companies_post(req, res, next) {
    try {
     
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("CompanyCRNo", sql.VarChar, req.body.CompanyCRNo)
        .input("CompanyNameE", sql.VarChar, req.body.CompanyNameE)
        .input("CompanyNameA", sql.VarChar, req.body.CompanyNameA)
        .input("CompanyCity", sql.VarChar, req.body.CompanyCity)
        .input("CompanyType", sql.VarChar, req.body.CompanyType)
        .input("CompanyCREntityNo", sql.VarChar, req.body.CompanyCREntityNo)
        .input("CompanyCRIssueDate", sql.VarChar, req.body.CompanyCRIssueDate)
        .input("CompanyCRExpiryDate", sql.VarChar, req.body.CompanyCRExpiryDate)
        .input("CompanyStatus", sql.VarChar, req.body.CompanyStatus)
        .input("CompanyActivities", sql.VarChar, req.body.CompanyActivities)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblCompanies]
                      
                      ( [MemberID]
                         ,[CompanyCRNo]
                        ,[CompanyNameE]
                         ,[CompanyNameA]
                         ,[CompanyCity]
                        ,[CompanyType]
                         ,[CompanyCREntityNo]
                        ,[CompanyCRIssueDate]
                         ,[CompanyCRExpiryDate]
                         ,[CompanyStatus]
                        ,[CompanyActivities]
                        
                        )
                 VALUES
                       (
                       @MemberID
                       ,@CompanyCRNo
                       ,@CompanyNameE
                       ,@CompanyNameA
                       ,@CompanyCity
                       ,@CompanyCREntityNo
                       ,@CompanyType
                       ,@CompanyCRIssueDate
                       ,@CompanyCRExpiryDate
                       ,@CompanyStatus
                       ,@CompanyActivities
                     
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async Customers_post(req, res, next) {
    try {
     
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("CustomerNo", sql.VarChar, req.body.CustomerNo)
        .input("CustomerName", sql.VarChar, req.body.CustomerName)
        .input("CustomerAddress", sql.VarChar, req.body.CustomerAddress)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("cCity", sql.VarChar, req.body.cCity)
        .input("cRegion", sql.VarChar, req.body.cRegion)
        .input("cCompanyName", sql.VarChar, req.body.cCompanyName)
        .input("cGPSLocation", sql.VarChar, req.body.cGPSLocation)
        .input("cGPSLatitude", sql.VarChar, req.body.cGPSLatitude)
        .input("cGPSLongitude", sql.VarChar, req.body.cGPSLongitude)
        .input("cGPSAreaName", sql.VarChar, req.body.cGPSAreaName)
        .input("cPaymentType", sql.VarChar, req.body.cPaymentType)
         .input("cAddressLocNo", sql.TinyInt, req.body.cAddressLocNo)
        
        .query(
          ` 
            INSERT INTO [dbo].[TblCustomers]
                      
                      ( [CustomerNo]
                         ,[CustomerName]
                        ,[CustomerAddress]
                         ,[MobileNo]
                         ,[cCity]
                        ,[cRegion]
                         ,[cCompanyName]
                        ,[cGPSLocation]
                         ,[cGPSLatitude]
                         ,[cGPSLongitude]
                        ,[cPaymentType]
                         ,[cGPSAreaName]
                        ,[cAddressLocNo]
                        
                        )
                 VALUES
                       (
                       @CustomerNo
                       ,@CustomerName
                       ,@CustomerAddress
                       ,@MobileNo
                       ,@cCity
                       ,@cRegion
                       ,@cCompanyName
                       ,@cGPSLocation
                       ,@cGPSLatitude
                       ,@cGPSLongitude
                       ,@cPaymentType
                     ,@cGPSAreaName
                       ,@cAddressLocNo
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async FEMembers_post(req, res, next) {
    try {
     
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("GCPCode", sql.VarChar, req.body.GCPCode)
        .input("CompanyNameE", sql.VarChar, req.body.CompanyNameE)
        .input("CompanyNameA", sql.VarChar, req.body.CompanyNameA)
        .input("CompanyCRNo", sql.VarChar, req.body.CompanyCRNo)
        .input("CompanyAddress", sql.VarChar, req.body.CompanyAddress)
        .input("CompanyVatNo", sql.VarChar, req.body.CompanyVatNo)
        .input("CompanyLandLineNo", sql.VarChar, req.body.CompanyLandLineNo)
        .input("CompanyEmailID", sql.VarChar, req.body.CompanyEmailID)
        .input("CompanyGPSLocation1", sql.VarChar, req.body.CompanyGPSLocation1)
        .input("CompanyContactPerson", sql.VarChar, req.body.CompanyContactPerson)
        .input("CompanyCPMobileNo", sql.VarChar, req.body.CompanyCPMobileNo)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblFEMembers]
                      
                      ( [MemberID]
                         ,[GCPCode]
                        ,[CompanyNameE]
                         ,[CompanyNameA]
                         ,[CompanyCRNo]
                        ,[CompanyAddress]
                         ,[CompanyVatNo]
                        ,[CompanyLandLineNo]
                         ,[CompanyEmailID]
                         ,[CompanyGPSLocation1]
                        ,[CompanyContactPerson]
                         ,[CompanyCPMobileNo]

                        )
                 VALUES
                       (
                       @MemberID
                       ,@GCPCode
                       ,@CompanyNameE
                       ,@CompanyNameA
                       ,@CompanyCRNo
                       ,@CompanyAddress
                       ,@CompanyVatNo
                       ,@CompanyLandLineNo
                       ,@CompanyEmailID
                       ,@CompanyGPSLocation1
                       ,@CompanyContactPerson
                     ,@CompanyCPMobileNo
                     
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async ItemBarcodes_post(req, res, next) {
    try {
     
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("id", sql.VarChar, req.body.id)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemDescLo", sql.NVarChar, req.body.itemDescLo)
        .input("itemDescFo", sql.NVarChar, req.body.itemDescFo)
        .input("scnId", sql.VarChar, req.body.scnId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("unitId", sql.VarChar, req.body.unitId)
        .input("unitCode", sql.VarChar, req.body.unitCode)
        .input("unitDescLo", sql.NVarChar, req.body.unitDescLo)
        .input("unitDescFo", sql.NVarChar, req.body.unitDescFo)
        .input("baseUnitId", sql.VarChar, req.body.baseUnitId)
        .input("unitPrice", sql.Real, req.body.unitPrice)
         .input("hasOffer", sql.VarChar, req.body.hasOffer)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblItemBarcodes]
                      
                      ( [id]
                         ,[BarCode]
                        ,[itemId]
                         ,[itemDescLo]
                         ,[itemDescFo]
                        ,[scnId]
                         ,[itemType]
                        ,[unitId]
                         ,[unitCode]
                         ,[unitDescLo]
                        ,[unitDescFo]
                         ,[baseUnitId]
                         ,[unitPrice]
                         ,[hasOffer]

                        )
                 VALUES
                       (
                       @id
                       ,@BarCode
                       ,@itemId
                       ,@itemDescLo
                       ,@itemDescFo
                       ,@scnId
                       ,@itemType
                       ,@unitId
                       ,@unitCode
                       ,@unitDescLo
                       ,@unitDescFo
                     ,@baseUnitId
                     ,@unitPrice
                     ,@hasOffer
                     
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodesOnVan_post(req, res, next) {
    try {
     
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("id", sql.VarChar, req.body.id)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemDescLo", sql.NVarChar, req.body.itemDescLo)
        .input("itemDescFo", sql.NVarChar, req.body.itemDescFo)
        .input("scnId", sql.VarChar, req.body.scnId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("unitId", sql.VarChar, req.body.unitId)
        .input("unitCode", sql.VarChar, req.body.unitCode)
        .input("unitDescLo", sql.NVarChar, req.body.unitDescLo)
        .input("unitDescFo", sql.NVarChar, req.body.unitDescFo)
        .input("baseUnitId", sql.VarChar, req.body.baseUnitId)
        .input("unitPrice", sql.Real, req.body.unitPrice)
         .input("hasOffer", sql.VarChar, req.body.hasOffer)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblItemBarcodesOnVan]
                      
                      ( [id]
                         ,[BarCode]
                        ,[itemId]
                         ,[itemDescLo]
                         ,[itemDescFo]
                        ,[scnId]
                         ,[itemType]
                        ,[unitId]
                         ,[unitCode]
                         ,[unitDescLo]
                        ,[unitDescFo]
                         ,[baseUnitId]
                         ,[unitPrice]
                         ,[hasOffer]
                         ,[AvailableQty]

                        )
                 VALUES
                       (
                       @id
                       ,@BarCode
                       ,@itemId
                       ,@itemDescLo
                       ,@itemDescFo
                       ,@scnId
                       ,@itemType
                       ,@unitId
                       ,@unitCode
                       ,@unitDescLo
                       ,@unitDescFo
                     ,@baseUnitId
                     ,@unitPrice
                     ,@hasOffer
                     ,@AvailableQty
                     
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  //
  //-----------------------------------------------------------------------------------

  //---------------------------PUT--------------------------------------------------------

 
  async apt_Put(req, res, next) {
    try {
        const file = req.files["Image"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const APTID = req.params.APTID;
      let data = await pool
        .request()

        .input("Title", sql.VarChar, req.body.Title)
        .input("Category", sql.VarChar, req.body.Category)
        .input("Content", sql.VarChar, req.body.Content)
        .input("StartDate", sql.DateTime, req.body.StartDate)
        .input("EndDate", sql.DateTime, req.body.EndDate)
        .input("WithRepetition", sql.TinyInt, req.body.WithRepetition)
        .input("RepetitionType", sql.Numeric, req.body.RepetitionType)
        .input("RepetitionOccurrence", sql.Numeric, req.body.RepetitionOccurrence)
        .input("RepetitionEndDate", sql.DateTime, req.body.RepetitionEndDate)
        .input("RepetitionEndType", sql.Numeric, req.body.RepetitionEndType)
        .input("Importance", sql.Numeric, req.body.Importance)
        .input("Image", sql.VarChar, url)
        .input("Note", sql.VarChar, req.body.Note)
        .input("APTBckgrdID", sql.Numeric, req.body.APTBckgrdID)
        .query(
          ` 
          UPDATE [dbo].[apt]
SET

[Title] =@Title
,[Category] =@Category
,[Content] =@Content
,[StartDate] =@StartDate
,[EndDate] =@EndDate
,[WithRepetition] =@WithRepetition
,[RepetitionType] =@RepetitionType
,[RepetitionOccurrence] =@RepetitionOccurrence
,[RepetitionEndDate] =@RepetitionEndDate
,[RepetitionEndType] =@RepetitionEndType
,[Importance] =@Importance
,[Image] =@Image
,[Note] =@Note
,[APTBckgrdID] =@APTBckgrdID

WHERE APTID='${APTID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async aptbckgrd_Put(req, res, next) {
    try {
        
      const APTBckgrdID = req.params.APTBckgrdID;
      let pool = await sql.connect(config);
      let data = await pool
        .request()

        .input("BackgroundColor", sql.VarChar, req.body.BackgroundColor)
       
        .query(
          ` 
          UPDATE [dbo].[aptbckgrd]
SET

[BackgroundColor] =@BackgroundColor


WHERE APTBckgrdID='${APTBckgrdID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },

  async contact_Put(req, res, next) {
    try {
        const file = req.files["Photo"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const ContactID = req.params.ContactID;
      let data = await pool
        .request()

         .input("Address", sql.VarChar, req.body.Address)
        .input("Lastname", sql.VarChar, req.body.Lastname)
        .input("FirstName", sql.VarChar, req.body.FirstName)
        .input("Spouse", sql.VarChar, req.body.Spouse)
        .input("ChildrenNames", sql.VarChar, req.body.ChildrenNames)
        .input("Notes", sql.VarChar, req.body.Notes)
        .input("ZipCode", sql.VarChar, req.body.ZipCode)
        .input("DateOfBirth", sql.Date, req.body.DateOfBirth)
        .input("SaintsDay", sql.Date, req.body.SaintsDay)
        .input("Email", sql.VarChar, req.body.Email)
        .input("Phone", sql.VarChar, req.body.Phone)
        .input("CellPhone", sql.VarChar, req.body.CellPhone)
        .input("City", sql.VarChar, req.body.City)
        .input("Photo", sql.VarChar, url)
        .input("Country", sql.VarChar, req.body.Country)
        .input("Rpt_State_dep", sql.VarChar, req.body.Rpt_State_dep)
        .input("FirstName2", sql.VarChar, req.body.FirstName2)
        .input("TransferredToOutlook", sql.TinyInt, req.body.TransferredToOutlook)
        .query(
          ` 
          UPDATE [dbo].[contact]
SET

[Address] =@Address
,[Lastname] =@Lastname
,[FirstName] =@FirstName
,[Spouse] =@Spouse
,[ChildrenNames] =@ChildrenNames
,[Notes] =@Notes
,[ZipCode] =@ZipCode
,[DateOfBirth] =@DateOfBirth
,[SaintsDay] =@SaintsDay
,[Email] =@Email
,[Phone] =@Phone
,[CellPhone] =@CellPhone
,[City] =@City
,[Photo] =@Photo
,[Country] =@Country
,[Rpt_State_dep] =@Rpt_State_dep
,[FirstName2] =@FirstName2
,[TransferredToOutlook] =@TransferredToOutlook

WHERE ContactID='${ContactID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async TransactionSummary_Put(req, res, next) {
    try {
       
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

          .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
        .query(
          ` 
          UPDATE [dbo].[TblAllTransactionSummary]
SET

[TransactionName] =@TransactionName
,[TotalTransaction] =@TotalTransaction
,[TotalTransactionAmount] =@TotalTransactionAmount
,[TransactionDate] =@TransactionDate
,[TrxIndexNo] =@TrxIndexNo
,[TransactionNameArabic] =@TransactionNameArabic


WHERE TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async TransactionSummaryList_Put(req, res, next) {
    try {
       
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

          .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
        .query(
          ` 
          UPDATE [dbo].[TblAllTransactionSummaryList]
SET

[TransactionName] =@TransactionName
,[TotalTransaction] =@TotalTransaction
,[TotalTransactionAmount] =@TotalTransactionAmount
,[TransactionDate] =@TransactionDate
,[TrxIndexNo] =@TrxIndexNo
,[TransactionNameArabic] =@TransactionNameArabic


WHERE TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummaryPrint_Put(req, res, next) {
    try {
       
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

          .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
        .query(
          ` 
          UPDATE [dbo].[TblAllTransactionSummaryPrint]
SET

[TransactionName] =@TransactionName
,[TotalTransaction] =@TotalTransaction
,[TotalTransactionAmount] =@TotalTransactionAmount
,[TransactionDate] =@TransactionDate
,[TrxIndexNo] =@TrxIndexNo
,[TransactionNameArabic] =@TransactionNameArabic


WHERE TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummarytmp_Put(req, res, next) {
    try {
       
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

          .input("TransactionName", sql.VarChar, req.body.TransactionName)
        .input("TotalTransaction", sql.Numeric, req.body.TotalTransaction)
        .input("TotalTransactionAmount", sql.Float, req.body.TotalTransactionAmount)
        .input("TransactionDate", sql.Date, req.body.TransactionDate)
        .input("TrxIndexNo", sql.TinyInt, req.body.TrxIndexNo)
        .input("TransactionNameArabic", sql.VarChar, req.body.TransactionNameArabic)
        .query(
          ` 
          UPDATE [dbo].[TblAllTransactionSummarytmp]
SET

[TransactionName] =@TransactionName
,[TotalTransaction] =@TotalTransaction
,[TotalTransactionAmount] =@TotalTransactionAmount
,[TransactionDate] =@TransactionDate
,[TrxIndexNo] =@TrxIndexNo
,[TransactionNameArabic] =@TransactionNameArabic


WHERE TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async CardTypes_Put(req, res, next) {
    try {
       
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .input("code", sql.VarChar, req.body.code)
        .input("descFo", sql.VarChar, req.body.descFo)
        .input("id", sql.VarChar, req.body.id)
        .input("descLo", sql.VarChar, req.body.descLo)
        .query(
          ` 
          UPDATE [dbo].[tblCardTypes]
SET

[code] =@code
,[descFo] =@descFo
,[id] =@id
,[descLo] =@descLo

WHERE tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async Companies_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const tblCompaniesID = req.params.tblCompaniesID;
      let data = await pool
        .request()

        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("CompanyCRNo", sql.VarChar, req.body.CompanyCRNo)
        .input("CompanyNameE", sql.VarChar, req.body.CompanyNameE)
        .input("CompanyNameA", sql.VarChar, req.body.CompanyNameA)
        .input("CompanyCity", sql.VarChar, req.body.CompanyCity)
        .input("CompanyType", sql.VarChar, req.body.CompanyType)
        .input("CompanyCREntityNo", sql.VarChar, req.body.CompanyCREntityNo)
        .input("CompanyCRIssueDate", sql.VarChar, req.body.CompanyCRIssueDate)
        .input("CompanyCRExpiryDate", sql.VarChar, req.body.CompanyCRExpiryDate)
        .input("CompanyStatus", sql.VarChar, req.body.CompanyStatus)
        .input("CompanyActivities", sql.VarChar, req.body.CompanyActivities)
        .query(
          ` 
          UPDATE [dbo].[tblCompanies]
SET

[MemberID] =@MemberID
,[CompanyCRNo] =@CompanyCRNo
,[CompanyNameE] =@CompanyNameE
,[CompanyNameA] =@CompanyNameA
,[CompanyCity] =@CompanyCity
,[CompanyType] =@CompanyType
,[CompanyCREntityNo] =@CompanyCREntityNo
,[CompanyCRIssueDate] =@CompanyCRIssueDate
,[CompanyCRExpiryDate] =@CompanyCRExpiryDate
,[CompanyStatus] =@CompanyStatus
,[CompanyActivities] =@CompanyActivities

WHERE tblCompaniesID='${tblCompaniesID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async Customers_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const TblCustomersID = req.params.TblCustomersID;
      let data = await pool
        .request()

       .input("CustomerNo", sql.VarChar, req.body.CustomerNo)
        .input("CustomerName", sql.VarChar, req.body.CustomerName)
        .input("CustomerAddress", sql.VarChar, req.body.CustomerAddress)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("cCity", sql.VarChar, req.body.cCity)
        .input("cRegion", sql.VarChar, req.body.cRegion)
        .input("cCompanyName", sql.VarChar, req.body.cCompanyName)
        .input("cGPSLocation", sql.VarChar, req.body.cGPSLocation)
        .input("cGPSLatitude", sql.VarChar, req.body.cGPSLatitude)
        .input("cGPSLongitude", sql.VarChar, req.body.cGPSLongitude)
        .input("cGPSAreaName", sql.VarChar, req.body.cGPSAreaName)
        .input("cPaymentType", sql.VarChar, req.body.cPaymentType)
         .input("cAddressLocNo", sql.TinyInt, req.body.cAddressLocNo)
        .query(
          ` 
          UPDATE [dbo].[TblCustomers]
SET

[CustomerNo] =@CustomerNo
,[CustomerName] =@CustomerName
,[CustomerAddress] =@CustomerAddress
,[MobileNo] =@MobileNo
,[cCity] =@cCity
,[cRegion] =@cRegion
,[cCompanyName] =@cCompanyName
,[cGPSLocation] =@cGPSLocation
,[cGPSLatitude] =@cGPSLatitude
,[cGPSLongitude] =@cGPSLongitude
,[cGPSAreaName] =@cGPSAreaName
,[cPaymentType] =@cPaymentType
,[cAddressLocNo] =@cAddressLocNo


WHERE TblCustomersID='${TblCustomersID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async FEMembers_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const tblLIMembersID = req.params.tblLIMembersID;
      let data = await pool
        .request()

      .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("GCPCode", sql.VarChar, req.body.GCPCode)
        .input("CompanyNameE", sql.VarChar, req.body.CompanyNameE)
        .input("CompanyNameA", sql.VarChar, req.body.CompanyNameA)
        .input("CompanyCRNo", sql.VarChar, req.body.CompanyCRNo)
        .input("CompanyAddress", sql.VarChar, req.body.CompanyAddress)
        .input("CompanyVatNo", sql.VarChar, req.body.CompanyVatNo)
        .input("CompanyLandLineNo", sql.VarChar, req.body.CompanyLandLineNo)
        .input("CompanyEmailID", sql.VarChar, req.body.CompanyEmailID)
        .input("CompanyGPSLocation1", sql.VarChar, req.body.CompanyGPSLocation1)
        .input("CompanyContactPerson", sql.VarChar, req.body.CompanyContactPerson)
        .input("CompanyCPMobileNo", sql.VarChar, req.body.CompanyCPMobileNo)
        .query(
          ` 
          UPDATE [dbo].[tblFEMembers]
SET

[MemberID] =@MemberID
,[GCPCode] =@GCPCode
,[CompanyNameE] =@CompanyNameE
,[CompanyNameA] =@CompanyNameA
,[CompanyCRNo] =@CompanyCRNo
,[CompanyVatNo] =@CompanyVatNo
,[CompanyAddress] =@CompanyAddress
,[CompanyLandLineNo] =@CompanyLandLineNo
,[CompanyEmailID] =@CompanyEmailID
,[CompanyGPSLocation1] =@CompanyGPSLocation1
,[CompanyContactPerson] =@CompanyContactPerson
,[CompanyCPMobileNo] =@CompanyCPMobileNo



WHERE tblLIMembersID='${tblLIMembersID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodes_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

       .input("id", sql.VarChar, req.body.id)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemDescLo", sql.NVarChar, req.body.itemDescLo)
        .input("itemDescFo", sql.NVarChar, req.body.itemDescFo)
        .input("scnId", sql.VarChar, req.body.scnId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("unitId", sql.VarChar, req.body.unitId)
        .input("unitCode", sql.VarChar, req.body.unitCode)
        .input("unitDescLo", sql.NVarChar, req.body.unitDescLo)
        .input("unitDescFo", sql.NVarChar, req.body.unitDescFo)
        .input("baseUnitId", sql.VarChar, req.body.baseUnitId)
        .input("unitPrice", sql.Real, req.body.unitPrice)
         .input("hasOffer", sql.VarChar, req.body.hasOffer)
        .query(
          ` 
          UPDATE [dbo].[tblItemBarcodes]
SET

[id] =@id
,[BarCode] =@BarCode
,[itemId] =@itemId
,[itemDescLo] =@itemDescLo
,[itemDescFo] =@itemDescFo
,[scnId] =@scnId
,[itemType] =@itemType
,[unitId] =@unitId
,[unitCode] =@unitCode
,[unitDescLo] =@unitDescLo
,[unitDescFo] =@unitDescFo
,[baseUnitId] =@baseUnitId
,[unitPrice] =@unitPrice
,[hasOffer] =@hasOffer



WHERE tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodesOnVan_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

       .input("id", sql.VarChar, req.body.id)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemDescLo", sql.NVarChar, req.body.itemDescLo)
        .input("itemDescFo", sql.NVarChar, req.body.itemDescFo)
        .input("scnId", sql.VarChar, req.body.scnId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("unitId", sql.VarChar, req.body.unitId)
        .input("unitCode", sql.VarChar, req.body.unitCode)
        .input("unitDescLo", sql.NVarChar, req.body.unitDescLo)
        .input("unitDescFo", sql.NVarChar, req.body.unitDescFo)
        .input("baseUnitId", sql.VarChar, req.body.baseUnitId)
        .input("unitPrice", sql.Real, req.body.unitPrice)
        .input("hasOffer", sql.VarChar, req.body.hasOffer)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .query(
          ` 
          UPDATE [dbo].[tblItemBarcodesOnVan]
SET

[id] =@id
,[BarCode] =@BarCode
,[itemId] =@itemId
,[itemDescLo] =@itemDescLo
,[itemDescFo] =@itemDescFo
,[scnId] =@scnId
,[itemType] =@itemType
,[unitId] =@unitId
,[unitCode] =@unitCode
,[unitDescLo] =@unitDescLo
,[unitDescFo] =@unitDescFo
,[baseUnitId] =@baseUnitId
,[unitPrice] =@unitPrice
,[hasOffer] =@hasOffer
,[AvailableQty] =@AvailableQty



WHERE tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  //-------------------------------------------------------------------------------------

  //---------------------------GET--------------------------------------------------------
 
  async apt_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from apt`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async apt_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const APTID = req.params.APTID;
      let data = await pool
        .request()

        .query(
          `select * from apt where APTID='${APTID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async aptbckgrd_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from aptbckgrd`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async aptbckgrd_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const APTBckgrdID = req.params.APTBckgrdID;
      let data = await pool
        .request()

        .query(
          `select * from aptbckgrd where APTBckgrdID='${APTBckgrdID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async contact_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const ContactID = req.params.ContactID;
      let data = await pool
        .request()

        .query(
          `select * from contact where ContactID='${ContactID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async contact_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from contact`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummary_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblAllTransactionSummary`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async TransactionSummary_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `select * from TblAllTransactionSummary where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async TransactionSummaryList_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblAllTransactionSummaryList`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
       async TransactionSummaryList_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `select * from TblAllTransactionSummaryList where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  
      async TransactionSummaryPrint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `select * from TblAllTransactionSummaryPrint where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async TransactionSummaryPrint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblAllTransactionSummaryPrint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },  
      async TransactionSummarytmp_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblAllTransactionSummarytmp`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },  
    async TransactionSummarytmp_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `select * from TblAllTransactionSummarytmp where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },  
  async CardTypes_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `select * from tblCardTypes where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  }, 
     async CardTypes_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblCardTypes`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },  
      async Companies_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblCompanies`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  }, 
      async Companies_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblCompaniesID = req.params.tblCompaniesID;
      let data = await pool
        .request()

        .query(
          `select * from tblCompanies where tblCompaniesID='${tblCompaniesID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  }, 
  async Customers_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblCustomersID = req.params.TblCustomersID;
      let data = await pool
        .request()

        .query(
          `select * from TblCustomers where TblCustomersID='${TblCustomersID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async Customers_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblCustomers`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  }, 
   async FEMembers_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblFEMembers`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async FEMembers_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblLIMembersID = req.params.tblLIMembersID;
      let data = await pool
        .request()

        .query(
          `select * from tblFEMembers where tblLIMembersID='${tblLIMembersID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async temBarcodes_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `select * from tblItemBarcodes where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodes_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblItemBarcodes`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodesOnVan_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblItemBarcodesOnVan`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodesOnVan_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `select * from tblItemBarcodesOnVan where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  //-----------------------------------------------------------------------------------

  //---------------------------DELETE--------------------------------------------------------
async apt_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const APTID = req.params.APTID;
      let data = await pool
        .request()

        .query(
          `delete from apt where APTID='${APTID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async aptbckgrd_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const APTBckgrdID = req.params.APTBckgrdID;
      let data = await pool
        .request()

        .query(
          `delete from aptbckgrd where APTBckgrdID='${APTBckgrdID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async contact_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const ContactID = req.params.ContactID;
      let data = await pool
        .request()

        .query(
          `delete from contact where ContactID='${ContactID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async TransactionSummary_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `delete from TblAllTransactionSummary where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async TransactionSummaryList_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `delete from TblAllTransactionSummaryList where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async TransactionSummaryPrint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `delete from TblAllTransactionSummaryPrint where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async TransactionSummarytmp_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `delete from TblAllTransactionSummarytmp where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async CardTypes_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `delete from tblCardTypes where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async Companies_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblCompaniesID = req.params.tblCompaniesID;
      let data = await pool
        .request()

        .query(
          `delete from tblCompanies where tblCompaniesID='${tblCompaniesID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async Customers_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblCustomersID = req.params.TblCustomersID;
      let data = await pool
        .request()

        .query(
          `delete from TblCustomers where TblCustomersID='${TblCustomersID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async FEMembers_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblLIMembersID = req.params.tblLIMembersID;
      let data = await pool
        .request()

        .query(
          `delete from tblFEMembers where tblLIMembersID='${tblLIMembersID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodes_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `delete from tblItemBarcodes where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodesOnVan_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `delete from tblItemBarcodesOnVan where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
};
export default FATSDB;

