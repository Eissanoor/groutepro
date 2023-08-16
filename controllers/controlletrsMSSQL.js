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

async UserLoginAuth(req, res, next) {
    try {
      let token;
      let tokenPayload;
      const { name, password } = req.body;
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .query(
          `SELECT * FROM TblUsers WHERE name='${name}' AND password='${password}'`
        );

      if (result.recordset.length > 0) {
        // fetch roles assign to user on the basis of loginname

        let data = await pool
          .request()
          .input("name", sql.VarChar, name)
          .query(`select * from TblUsers where name=@name`);

        if (data.rowsAffected[0] != 0) {
          let listdata = data.recordsets[0];
          console.log(listdata);
          const assignedRoles = listdata.map((item) => item.RoleID);
          console.log(assignedRoles);
          tokenPayload = {
            userloginId: name,
            assignedRoles: assignedRoles,
          };
          console.log(tokenPayload);
        } else {
          tokenPayload = {
            userloginId: name,
            assignedRoles: [],
          };
        }
        token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiration });
        console.log(token);

        if (!token)
          return res
            .status(500)
            .send({ success: false, message: "Token not generated" });
        // return res.cookie("token", token, {
        //   // httpOnly: true,
        // }).
        res
          .status(200)
          .send({ success: true, user: result.recordset, token: token });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "Invalid Credentials" });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ success: false, message: "Internal Server Error", error: err });
    }
  },
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
   async ItemBarcodesReturns_post(req, res, next) {
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
        .input("qtyreturn", sql.Numeric, req.body.qtyreturn)
        .input("unitPriceAfc", sql.Real, req.body.unitPriceAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("totalTaxAlc", sql.Real, req.body.totalTaxAlc)
        .input("itemDiscAlc", sql.Real, req.body.itemDiscAlc)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblItemBarcodesReturns]
                      
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
                         ,[qtyreturn]
                         ,[unitPriceAfc]
                         ,[rem]
                         ,[itemDiscAlc]
                         

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
                     ,@qtyreturn
                      ,@unitPriceAfc
                       ,@rem
                        ,@itemDiscAlc
                     
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async ItemBarcodesTmp_post(req, res, next) {
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
        .input("unitPriceAlc", sql.Real, req.body.unitPriceAlc)
        .input("longDesc", sql.VarChar, req.body.longDesc)
        .input("qty", sql.Numeric, req.body.qty)
      
        
        .query(
          ` 
            INSERT INTO [dbo].[tblItemBarcodesTmp]
                      
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
                         ,[unitPriceAlc]
                         ,[longDesc]
                          ,[qty]
                        
                         

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
                     ,@unitPriceAlc
                      ,@longDesc
                       ,@qty
                      
                     
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async ItemMaster_post(req, res, next) {
    try {
      const file = req.files["ItemPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.NVarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("ItemCategoryCode", sql.VarChar, req.body.ItemCategoryCode)
        .input("ItemCategoryDesc", sql.VarChar, req.body.ItemCategoryDesc)
        .input("ItemPhoto", sql.VarChar, url)
        .query(
          ` 
            INSERT INTO [dbo].[tblItemMaster]
                      
                      ( [ItemCode]
                         ,[ItemDescription]
                        ,[ItemUnit]
                         ,[AvailableQty]
                         ,[BinNoLocation]
                        ,[ItemPrice]
                         ,[ItemCategoryCode]
                        ,[ItemCategoryDesc]
                         ,[ItemPhoto]
                        )
                 VALUES
                       (
                       @ItemCode
                       ,@ItemDescription
                       ,@ItemUnit
                       ,@AvailableQty
                       ,@BinNoLocation
                       ,@ItemPrice
                       ,@ItemCategoryCode
                       ,@ItemCategoryDesc
                       ,@ItemPhoto                
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async LIMembers_post(req, res, next) {
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
            INSERT INTO [dbo].[tblLIMembers]
                      
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
    async MemberProducts_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ProductNameE", sql.NVarChar, req.body.ProductNameE)
        .input("ProductNameA", sql.NVarChar, req.body.ProductNameA)
        .input("BrandName", sql.NVarChar, req.body.BrandName)
        .input("ProductTypeID", sql.Numeric, req.body.ProductTypeID)
        .input("Origin", sql.NVarChar, req.body.Origin)
        .input("ColorID", sql.Numeric, req.body.ColorID)
        .input("PackagingTypeID", sql.Numeric, req.body.PackagingTypeID)
        .input("PackagingLevelID", sql.Numeric, req.body.PackagingLevelID)
        .input("MnfCode", sql.VarChar, req.body.MnfCode)
        .input("MnfGLN", sql.VarChar, req.body.MnfGLN)
        .input("ProvGLN", sql.VarChar, req.body.ProvGLN)
        .input("ImageURL", sql.VarChar, req.body.ImageURL)
        .input("DetailsPage", sql.VarChar, req.body.DetailsPage)
        .input("ChildProductID", sql.Numeric, req.body.ChildProductID)
        .input("ChildQuantity", sql.Numeric, req.body.ChildQuantity)
        .input("UOMID", sql.Numeric, req.body.UOMID)
        .input("Size", sql.Numeric, req.body.Size)

        .input("BarCodeID", sql.Numeric, req.body.BarCodeID)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("BarCodeURL", sql.NVarChar, req.body.BarCodeURL)
        .input("IsActive", sql.TinyInt, req.body.IsActive)
        .input("CreatedBy", sql.Numeric, req.body.CreatedBy)
        .input("CreatedDate", sql.DateTime, req.body.CreatedDate)
        .input("UpdatedBy", sql.Numeric, req.body.UpdatedBy)
        .input("UpdatedDate", sql.DateTime, req.body.UpdatedDate)
       
        


        .query(
          ` 
            INSERT INTO [dbo].[tblMemberProducts]
                      
                      ( [MemberID]
                         ,[ProductNameE]
                        ,[ProductNameA]
                         ,[BrandName]
                         ,[ProductTypeID]
                        ,[Origin]
                         ,[ColorID]
                        ,[PackagingTypeID]
                         ,[PackagingLevelID]
                         ,[MnfCode]
                        ,[MnfGLN]
                         ,[ProvGLN]
                         ,[ImageURL]
                         ,[DetailsPage]
                         ,[ChildProductID]
                         ,[ChildQuantity]
                         ,[UOMID]
                         ,[Size]
                         ,[BarCodeID]
                         ,[BarCode]
                         ,[BarCodeURL]
                         ,[IsActive]
                         ,[CreatedBy]
                         ,[CreatedDate]
                         ,[UpdatedBy]
                         ,[UpdatedDate]
                        )
                 VALUES
                       (
                       @MemberID
                       ,@ProductNameE
                       ,@ProductNameA
                       ,@BrandName
                       ,@ProductTypeID
                       ,@Origin
                       ,@ColorID
                       ,@PackagingTypeID
                       ,@PackagingLevelID
                       ,@MnfCode
                       ,@MnfGLN
                       ,@ProvGLN
                       ,@ImageURL
                       ,@DetailsPage
                       ,@ChildProductID
                       ,@ChildQuantity
                       ,@UOMID
                       ,@Size
                       ,@BarCodeID
                       ,@BarCode
                       ,@BarCodeURL
                       ,@IsActive
                       ,@CreatedBy
                       ,@CreatedDate
                       ,@UpdatedBy
                       ,@UpdatedDate
                   
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async Members_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("UserID", sql.Numeric, req.body.UserID)
        .input("MemberNameE", sql.NVarChar, req.body.MemberNameE)
        .input("MemberNameA", sql.NVarChar, req.body.MemberNameA)
        .input("MemberType", sql.VarChar, req.body.MemberType)
        .input("Address1", sql.NVarChar, req.body.Address1)
        .input("Address2", sql.NVarChar, req.body.Address2)
        .input("POBox", sql.VarChar, req.body.POBox)
        .input("CityID", sql.Numeric, req.body.CityID)
        .input("Phone1", sql.VarChar, req.body.Phone1)
        .input("Phone2", sql.VarChar, req.body.Phone2)
        .input("Fax", sql.VarChar, req.body.Fax)
        .input("Staff", sql.Numeric, req.body.Staff)
        .input("Email", sql.VarChar, req.body.Email)
        .input("Website", sql.VarChar, req.body.Website)
        .input("IndustryTypeID", sql.VarChar, req.body.IndustryTypeID)
        .input("FieldOfWorkID", sql.VarChar, req.body.FieldOfWorkID)
        .input("OtherFieldOfWork", sql.NVarChar, req.body.OtherFieldOfWork)
        .input("Products", sql.VarChar, req.body.Products)

        .input("GS1Prefix", sql.Numeric, req.body.GS1Prefix)
        .input("MOCRegNo", sql.VarChar, req.body.MOCRegNo)
        .input("MOCRegDate", sql.Date, req.body.MOCRegDate)
        .input("MOCRegCert", sql.VarChar, req.body.MOCRegCert)
        .input("GLNID", sql.Numeric, req.body.GLNID)
        .input("GLN", sql.VarChar, req.body.GLN)
        .input("Is14", sql.TinyInt, req.body.Is14)
        .input("Status", sql.VarChar, req.body.Status)
       
        .input("Parent", sql.Numeric, req.body.Parent)
        .input("CreatedBy", sql.Numeric, req.body.CreatedBy)
        .input("CreatedDate", sql.DateTime, req.body.CreatedDate)
        .input("UpdatedBy", sql.Numeric, req.body.UpdatedBy)
        .input("UpdatedDate", sql.DateTime, req.body.UpdatedDate)
        .input("MembershipTypeID", sql.Numeric, req.body.MembershipTypeID)
        .input("OtherIndustry", sql.NVarChar, req.body.OtherIndustry)
        .input("IntID", sql.Numeric, req.body.IntID)
        


        .query(
          ` 
            INSERT INTO [dbo].[tblMembers]
                      
                      ( [UserID]
                         ,[MemberNameE]
                        ,[MemberNameA]
                         ,[MemberType]
                         ,[Address1]
                        ,[Address2]
                         ,[POBox]
                        ,[CityID]
                         ,[Phone1]
                         ,[Phone2]
                        ,[Fax]
                         ,[Staff]
                         ,[Email]
                         ,[Website]
                         ,[IndustryTypeID]
                         ,[FieldOfWorkID]
                         ,[OtherFieldOfWork]
                         ,[Products]


                         ,[GS1Prefix]
                         ,[MOCRegNo]
                         ,[MOCRegDate]
                         ,[MOCRegCert]
                         ,[GLNID]
                         ,[GLN]
                         ,[Is14]
                         ,[Status]


                         ,[Parent]
                         ,[CreatedBy]
                         ,[CreatedDate]
                         ,[UpdatedBy]
                         ,[UpdatedDate]
                         ,[MembershipTypeID]
                         ,[OtherIndustry]
                         ,[IntID]
                        )
                 VALUES
                       (
                       @UserID
                       ,@MemberNameE
                       ,@MemberNameA
                       ,@MemberType
                       ,@Address1
                       ,@Address2
                       ,@POBox
                       ,@CityID
                       ,@Phone1
                       ,@Phone2
                       ,@Fax
                       ,@Staff
                       ,@Email
                       ,@Website
                       ,@IndustryTypeID
                       ,@FieldOfWorkID
                       ,@OtherFieldOfWork
                       ,@Products

                       ,@GS1Prefix
                       ,@MOCRegNo
                       ,@MOCRegDate
                       ,@MOCRegCert
                       ,@GLNID
                       ,@GLN
                       ,@Is14
                       ,@Status

                       ,@Parent
                       ,@CreatedBy
                       ,@CreatedDate
                       ,@UpdatedBy
                       ,@UpdatedDate
                       ,@MembershipTypeID
                       ,@OtherIndustry
                       ,@IntID
                   
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFs_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        
         
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFs]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]
                        
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName
                      
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsRPrintInvoice_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        
         
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsRPrintInvoice]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]
                        
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName
                      
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async tblPDFsRPrintInvoiceDirect_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsRPrintInvoiceDirect]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]   
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName             
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesCollectionPrint_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsSalesCollectionPrint]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]   
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName             
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesCollectionReprint_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsSalesCollectionReprint]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]   
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName             
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesReturnPrint_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsSalesReturnPrint]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]   
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName             
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesReturnReprint_post(req, res, next) {
    try {
    const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsSalesReturnReprint]
                      
                      ( [RPDocNo]
                         ,[PDFFileName]   
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@PDFFileName             
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSummary_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("SalesManName", sql.VarChar, req.body.SalesManName)
        .query(
          ` 
            INSERT INTO [dbo].[tblPDFsSummary]
                      
                      ( [SalesManName]  
                        )
                 VALUES
                       (
                       @SalesManName         
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async QRCodeLogin_post(req, res, next) {
    try {
    
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("QRLoginID", sql.VarChar, req.body.QRLoginID)
        .input("QRLoginPass", sql.VarChar, req.body.QRLoginPass)
        .query(
          ` 
            INSERT INTO [dbo].[tblQRCodeLogin]
                      
                      ( [QRLoginID]
                        ,[QRLoginPass]  
                        )
                 VALUES
                       (
                       @QRLoginID 
                       ,@QRLoginPass         
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestDets_post(req, res, next) {
    try {
     const file = req.files["ProductPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("ProductID", sql.Numeric, req.body.ProductID)
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("ProductBarcode", sql.VarChar, req.body.ProductBarcode)
        .input("ProductDescriptionE", sql.VarChar, req.body.ProductDescriptionE)
        .input("ProductDescriptionA", sql.VarChar, req.body.ProductDescriptionA)
        .input("ProductModelNo", sql.VarChar, req.body.ProductModelNo)
        .input("ProductSerialNo", sql.VarChar, req.body.ProductSerialNo)
        .input("ProductHSCode", sql.VarChar, req.body.ProductHSCode)
        .input("ProductBrandName", sql.VarChar, req.body.ProductBrandName)
        .input("ProductUnit", sql.VarChar, req.body.ProductUnit)
        .input("ProductType", sql.VarChar, req.body.ProductType)
        .input("ProductSize", sql.VarChar, req.body.ProductSize)
        .input("ProductPhotoIDNo", sql.Numeric, req.body.ProductPhotoIDNo)
        .input("ProductPhoto", sql.VarChar, url)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .input("ProductQtyOrder", sql.Numeric, req.body.ProductQtyOrder)
        .query(
          ` 
            INSERT INTO [dbo].[tblRequestDets]
                      
                      ( [ProductID]
                         ,[RequestNo]
                        ,[DateRequested]
                         ,[RequestStatus]
                         ,[ProductBarcode]
                        ,[ProductDescriptionE]
                         ,[ProductDescriptionA]
                        ,[ProductModelNo]
                         ,[ProductSerialNo]
                         ,[ProductHSCode]
                        ,[ProductBrandName]
                         ,[ProductUnit]
                         ,[ProductType]
                         ,[ProductSize]
                         ,[ProductPhotoIDNo]
                         ,[ProductPhoto]
                         ,[ShipmentGLNNo]
                         ,[ProductQtyOrder]
                        
                        )
                 VALUES
                       (
                       @ProductID
                       ,@RequestNo
                       ,@DateRequested
                       ,@RequestStatus
                       ,@ProductBarcode
                       ,@ProductDescriptionE
                       ,@ProductDescriptionA
                       ,@ProductModelNo
                       ,@ProductSerialNo
                       ,@ProductHSCode
                       ,@ProductBrandName
                       ,@ProductUnit
                       ,@ProductType
                       ,@ProductSize
                       ,@ProductPhotoIDNo
                       ,@ProductPhoto
                       ,@ShipmentGLNNo
                       ,@ProductQtyOrder
                      
                   
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestDetsSHP_post(req, res, next) {
    try {
     const file = req.files["ProductPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        .input("ProductID", sql.Numeric, req.body.ProductID)
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("ProductBarcode", sql.VarChar, req.body.ProductBarcode)
        .input("ProductDescriptionE", sql.VarChar, req.body.ProductDescriptionE)
        .input("ProductDescriptionA", sql.VarChar, req.body.ProductDescriptionA)
        .input("ProductModelNo", sql.VarChar, req.body.ProductModelNo)
        .input("ProductSerialNo", sql.VarChar, req.body.ProductSerialNo)
        .input("ProductHSCode", sql.VarChar, req.body.ProductHSCode)
        .input("ProductBrandName", sql.VarChar, req.body.ProductBrandName)
        .input("ProductUnit", sql.VarChar, req.body.ProductUnit)
        .input("ProductType", sql.VarChar, req.body.ProductType)
        .input("ProductSize", sql.VarChar, req.body.ProductSize)
        .input("ProductPhotoIDNo", sql.Numeric, req.body.ProductPhotoIDNo)
        .input("ProductPhoto", sql.VarChar, url)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .input("ProductQtyOrder", sql.Numeric, req.body.ProductQtyOrder)
        .query(
          ` 
            INSERT INTO [dbo].[tblRequestDetsSHP]
                      
                      ( [ProductID]
                         ,[RequestNo]
                        ,[DateRequested]
                         ,[RequestStatus]
                         ,[ProductBarcode]
                        ,[ProductDescriptionE]
                         ,[ProductDescriptionA]
                        ,[ProductModelNo]
                         ,[ProductSerialNo]
                         ,[ProductHSCode]
                        ,[ProductBrandName]
                         ,[ProductUnit]
                         ,[ProductType]
                         ,[ProductSize]
                         ,[ProductPhotoIDNo]
                         ,[ProductPhoto]
                         ,[ShipmentGLNNo]
                         ,[ProductQtyOrder]
                        
                        )
                 VALUES
                       (
                       @ProductID
                       ,@RequestNo
                       ,@DateRequested
                       ,@RequestStatus
                       ,@ProductBarcode
                       ,@ProductDescriptionE
                       ,@ProductDescriptionA
                       ,@ProductModelNo
                       ,@ProductSerialNo
                       ,@ProductHSCode
                       ,@ProductBrandName
                       ,@ProductUnit
                       ,@ProductType
                       ,@ProductSize
                       ,@ProductPhotoIDNo
                       ,@ProductPhoto
                       ,@ShipmentGLNNo
                       ,@ProductQtyOrder
                      
                   
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestMaster_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("FEName", sql.VarChar, req.body.FEName)
        .input("FECountryOrigin", sql.VarChar, req.body.FECountryOrigin)
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .query(
          ` 
            INSERT INTO [dbo].[tblRequestMaster]
                      
                      ( 
                         [RequestNo]
                        ,[DateRequested]
                         ,[RequestStatus]
                         ,[FEName]
                        ,[FECountryOrigin]
                         ,[MemberID]
                        ,[ShipmentGLNNo]
                        )
                 VALUES
                       (
                       @RequestNo
                       ,@DateRequested
                       ,@RequestStatus
                       ,@FEName
                       ,@FECountryOrigin
                       ,@MemberID
                       ,@ShipmentGLNNo
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestMasterSHP_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("FEName", sql.VarChar, req.body.FEName)
        .input("FECountryOrigin", sql.VarChar, req.body.FECountryOrigin)
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .query(
          ` 
            INSERT INTO [dbo].[tblRequestMasterSHP]
                      
                      ( 
                         [RequestNo]
                        ,[DateRequested]
                         ,[RequestStatus]
                         ,[FEName]
                        ,[FECountryOrigin]
                         ,[MemberID]
                        ,[ShipmentGLNNo]
                        )
                 VALUES
                       (
                       @RequestNo
                       ,@DateRequested
                       ,@RequestStatus
                       ,@FEName
                       ,@FECountryOrigin
                       ,@MemberID
                       ,@ShipmentGLNNo
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteDetails_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.VarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOPickedQty", sql.Numeric, req.body.SOPickedQty)
        .query(
          ` 
            INSERT INTO [dbo].[tblRouteDetails]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                         ,[SOItemPrice]
                        ,[SOPickedQty]
                        
                        
                       
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOPickedQty
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterData_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RouteIDNo", sql.VarChar, req.body.RouteIDNo)
        .input("RouteRegion", sql.VarChar, req.body.RouteRegion)
        .input("RouteCity", sql.VarChar, req.body.RouteCity)
        .input("RouteArea", sql.VarChar, req.body.RouteArea)
        .input("RouteAreaGPS", sql.VarChar, req.body.RouteAreaGPS)
        .input("RouteGeoFenceGPS", sql.VarChar, req.body.RouteGeoFenceGPS)
        .input("RouteInUsed", sql.TinyInt, req.body.RouteInUsed)
        .query(
          ` 
            INSERT INTO [dbo].[tblRouteMasterData]
                      
                      ( 
                         [RouteIDNo]
                        ,[RouteRegion]
                         ,[RouteCity]
                         ,[RouteArea]
                        ,[RouteAreaGPS]
                         ,[RouteGeoFenceGPS]
                        ,[RouteInUsed]
                        )
                 VALUES
                       (
                       @RouteIDNo
                       ,@RouteRegion
                       ,@RouteCity
                       ,@RouteArea
                       ,@RouteAreaGPS
                       ,@RouteGeoFenceGPS
                       ,@RouteInUsed
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterPlan_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SoDate", sql.DateTime, req.body.SoDate)
        .input("SOAreaAssigned", sql.VarChar, req.body.SOAreaAssigned)
        .input("SORouteNo", sql.VarChar, req.body.SORouteNo)
        .input("SOShipTo", sql.VarChar, req.body.SOShipTo)
        .input("SOusername", sql.VarChar, req.body.SOBillTo)
        .input("SOStage", sql.VarChar, req.body.SOStage)
        .input("SOBillTo", sql.VarChar, req.body.SOBillTo)
        .input("SOAssignedVanIDNo", sql.VarChar, req.body.SOAssignedVanIDNo)
        .input("SOAssignedDriverIDNo", sql.VarChar, req.body.SOAssignedDriverIDNo)
        .input("SOAreaGPS", sql.VarChar, req.body.SOAreaGPS)
        .input("SOStartTime", sql.DateTime, req.body.SOStartTime)
        .input("SOEndTime", sql.DateTime, req.body.SOEndTime)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
       
        .query(
          ` 
            INSERT INTO [dbo].[tblRouteMasterPlan]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SoDate]
                        ,[SOAreaAssigned]
                         ,[SORouteNo]
                        ,[SOShipTo]
                        ,[SOBillTo]
                        ,[SOStage]
                        ,[SOAssignedVanIDNo]
                        ,[SOAssignedDriverIDNo]
                        ,[SOAreaGPS]
                        ,[SOStartTime]
                        ,[SOEndTime]
                        ,[SOCustomerNo]
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SoDate
                       ,@SOAreaAssigned
                       ,@SORouteNo
                       ,@SOShipTo
                       ,@SOBillTo
                       ,@SOStage
                       ,@SOAssignedVanIDNo
                       ,@SOAssignedDriverIDNo
                       ,@SOAreaGPS
                       ,@SOStartTime
                       ,@SOEndTime
                       ,@SOCustomerNo
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterPlan1_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SoDate", sql.DateTime, req.body.SoDate)
        .input("SOAreaAssigned", sql.VarChar, req.body.SOAreaAssigned)
        .input("SORouteNo", sql.VarChar, req.body.SORouteNo)
        .input("SOShipTo", sql.VarChar, req.body.SOShipTo)
        .input("SOBillTo", sql.VarChar, req.body.SOBillTo)
        .input("SOStage", sql.VarChar, req.body.SOStage)
        .input("SOAssignedVanIDNo", sql.VarChar, req.body.SOAssignedVanIDNo)
        .input("SOAssignedDriverIDNo", sql.VarChar, req.body.SOAssignedDriverIDNo)
        .input("SOAreaGPS", sql.VarChar, req.body.SOAreaGPS)
        .input("SOStartTime", sql.DateTime, req.body.SOStartTime)
        .input("SOEndTime", sql.DateTime, req.body.SOEndTime)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
       
        .query(
          ` 
            INSERT INTO [dbo].[tblRouteMasterPlan1]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SoDate]
                        ,[SOAreaAssigned]
                         ,[SORouteNo]
                        ,[SOShipTo]
                        ,[SOBillTo]
                        ,[SOStage]
                        ,[SOAssignedVanIDNo]
                        ,[SOAssignedDriverIDNo]
                        ,[SOAreaGPS]
                        ,[SOStartTime]
                        ,[SOEndTime]
                        ,[SOCustomerNo]
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SoDate
                       ,@SOAreaAssigned
                       ,@SORouteNo
                       ,@SOShipTo
                       ,@SOBillTo
                       ,@SOStage
                       ,@SOAssignedVanIDNo
                       ,@SOAssignedDriverIDNo
                       ,@SOAreaGPS
                       ,@SOStartTime
                       ,@SOEndTime
                       ,@SOCustomerNo
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterPlanDownloaded_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SoDate", sql.DateTime, req.body.SoDate)
        .input("SOAreaAssigned", sql.VarChar, req.body.SOAreaAssigned)
        .input("SORouteNo", sql.VarChar, req.body.SORouteNo)
        .input("SOShipTo", sql.VarChar, req.body.SOShipTo)
        .input("SOBillTo", sql.VarChar, req.body.SOBillTo)
        .input("SOStage", sql.VarChar, req.body.SOStage)
        .query(
          ` 
            INSERT INTO [dbo].[tblRouteMasterPlanDownloaded]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SoDate]
                        ,[SOAreaAssigned]
                         ,[SORouteNo]
                        ,[SOShipTo]
                        ,[SOBillTo]
                        ,[SOStage]
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SoDate
                       ,@SOAreaAssigned
                       ,@SORouteNo
                       ,@SOShipTo
                       ,@SOBillTo
                       ,@SOStage
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesCustomers_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("code", sql.NVarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("addressLo", sql.NVarChar, req.body.addressLo)
        .input("addressFo", sql.NVarChar, req.body.addressFo)
        .input("isActive", sql.VarChar, req.body.isActive)
        .input("phone", sql.VarChar, req.body.phone)
        .input("phoneExt", sql.VarChar, req.body.phoneExt)
        .input("mobile", sql.NVarChar, req.body.mobile)
        .input("rem", sql.VarChar, req.body.rem)
        .input("email", sql.NVarChar, req.body.email)
        .input("customerType", sql.VarChar, req.body.customerType)
        .input("creditPeriod", sql.VarChar, req.body.creditPeriod)
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesCustomers]
                      
                      ( 
                         [id]
                        ,[code]
                         ,[descLo]
                         ,[descFo]
                        ,[shDescLo]
                         ,[shDescFo]
                        ,[addressLo]
                        ,[addressFo]
                        ,[isActive]
                        ,[phone]
                        ,[phoneExt]
                        ,[mobile]
                        ,[rem]
                        ,[email]
                        ,[customerType]
                        ,[creditPeriod]
                        )
                 VALUES
                       (
                       @id
                       ,@code
                       ,@descLo
                       ,@descFo
                       ,@shDescLo
                       ,@shDescFo
                       ,@addressLo
                       ,@addressFo
                       ,@isActive
                       ,@phone
                       ,@phoneExt
                       ,@mobile
                       ,@rem
                       ,@email
                       ,@customerType
                       ,@creditPeriod
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesCustomersReturn_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("code", sql.NVarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("addressLo", sql.NVarChar, req.body.addressLo)
        .input("addressFo", sql.NVarChar, req.body.addressFo)
        .input("isActive", sql.VarChar, req.body.isActive)
        .input("phone", sql.VarChar, req.body.phone)
        .input("phoneExt", sql.VarChar, req.body.phoneExt)
        .input("mobile", sql.NVarChar, req.body.mobile)
        .input("rem", sql.VarChar, req.body.rem)
        .input("email", sql.NVarChar, req.body.email)
        .input("customerType", sql.VarChar, req.body.customerType)
        .input("creditPeriod", sql.VarChar, req.body.creditPeriod)
        .input("accountBalanceAmount", sql.Real, req.body.accountBalanceAmount)
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesCustomersReturn]
                      
                      ( 
                         [id]
                        ,[code]
                         ,[descLo]
                         ,[descFo]
                        ,[shDescLo]
                         ,[shDescFo]
                        ,[addressLo]
                        ,[addressFo]
                        ,[isActive]
                        ,[phone]
                        ,[phoneExt]
                        ,[mobile]
                        ,[rem]
                        ,[email]
                        ,[customerType]
                        ,[creditPeriod]
                         ,[accountBalanceAmount]
                        )
                 VALUES
                       (
                       @id
                       ,@code
                       ,@descLo
                       ,@descFo
                       ,@shDescLo
                       ,@shDescFo
                       ,@addressLo
                       ,@addressFo
                       ,@isActive
                       ,@phone
                       ,@phoneExt
                       ,@mobile
                       ,@rem
                       ,@email
                       ,@customerType
                       ,@creditPeriod
                       ,@accountBalanceAmount
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesInvoiceDets_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("nameFo", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
        .input("lineId", sql.VarChar, req.body.lineId)
        .input("seq", sql.VarChar, req.body.seq)
        .input("source", sql.VarChar, req.body.source)
        .input("entryLevel", sql.VarChar, req.body.entryLevel)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("roiId", sql.VarChar, req.body.roiId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemScn", sql.VarChar, req.body.itemScn)

        .input("qty", sql.Numeric, req.body.qty)
        .input("freeQtyManual", sql.VarChar, req.body.freeQtyManual)
        .input("imuId", sql.VarChar, req.body.imuId)
        .input("baseImuId", sql.VarChar, req.body.baseImuId)
        .input("baseUomQty", sql.VarChar, req.body.baseUomQty)
        .input("unitPriceAlc", sql.Real, req.body.unitPriceAlc)
        .input("unitPriceAfc", sql.Real, req.body.unitPriceAfc)
        .input("totPriceAlc", sql.Real, req.body.totPriceAlc)
        .input("totPriceAfc", sql.Real, req.body.totPriceAfc)
        .input("priceListUnitPriceAlc", sql.Real, req.body.priceListUnitPriceAlc)
        .input("priceListUnitPriceAfc", sql.Real, req.body.priceListUnitPriceAfc)
        .input("priceSource", sql.VarChar, req.body.priceSource)
        .input("discountType", sql.VarChar, req.body.discountType)
        .input("discountPerc", sql.VarChar, req.body.discountPerc)
        .input("itemAddonsAlc", sql.VarChar, req.body.itemAddonsAlc)
        .input("itemAddonsAfc", sql.VarChar, req.body.itemAddonsAfc)
        .input("itemNetPriceAlc", sql.Real, req.body.itemNetPriceAlc)

        .input("itemNetPriceAfc", sql.Real, req.body.itemNetPriceAfc)
        .input("warantyPeriod", sql.VarChar, req.body.warantyPeriod)
        .input("warantyPeriodUom", sql.VarChar, req.body.warantyPeriodUom)
        .input("lineStatus", sql.NVarChar, req.body.lineStatus)
        .input("itemsDiscAlc", sql.Real, req.body.itemsDiscAlc)
        .input("itemsDiscAfc", sql.Real, req.body.itemsDiscAfc)
        .input("actualCostAlc", sql.Real, req.body.actualCostAlc)
        .input("actualCostAfc", sql.Real, req.body.actualCostAfc)
        .input("balanceQty", sql.Numeric, req.body.balanceQty)
        .input("longDesc", sql.NVarChar, req.body.longDesc)
        .input("taxAlc", sql.Numeric, req.body.taxAlc)
        .input("taxAfc", sql.Numeric, req.body.taxAfc)
        .input("maxDiscPer", sql.Numeric, req.body.maxDiscPer)
        .input("allowedDiscPerc", sql.VarChar, req.body.allowedDiscPerc)
        .input("allowedDiscAlc", sql.VarChar, req.body.allowedDiscAlc)
        .input("allowedDiscAfc", sql.VarChar, req.body.allowedDiscAfc)
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesInvoiceDets]
                      
                      ( 
                         [id]
                        ,[fogId]
                         ,[melId]
                         ,[floId]
                        ,[code]
                         ,[refCode]
                        ,[dateDgr]
                        ,[dateDhi]
                        ,[globalStatus]
                        ,[type]
                        ,[header]
                        ,[targetMelId]
                        ,[targetTrxHeaderId]
                        ,[targetTrxCode]
                        ,[maeId]
                        ,[mcaId]
                         ,[partType]

                         ,[gprId]
                        ,[siteId]
                         ,[contactId]
                         ,[billToFreeText]
                        ,[PaymentTerms]
                         ,[creditPeriodDays]
                        ,[crrId]
                        ,[fcuId]
                        ,[exchngRate]
                        ,[itemsTotalAlc]
                        ,[addonsTotalAlc]
                        ,[addonsTotalAfc]
                        ,[totalDiscountsAlc]
                        ,[totalDiscountsAfc]
                        ,[netPriceAlc]
                        ,[netPriceAfc]
                         ,[currApproxAlc]

                         ,[proposedAmountAlc]
                        ,[proposedamountAfc]
                         ,[rem]
                         ,[ertId]
                        ,[shipToFreeText]
                         ,[isOnAccount]
                        ,[taxExemptionPerc]
                        ,[lines]
                        ,[lineId]
                        ,[seq]
                        ,[source]
                       
                        ,[entryLevel]
                        ,[BarCode]
                        ,[roiId]
                        ,[itemType]
                         ,[itemId]

                         ,[itemScn]
                        ,[qty]
                         ,[freeQtyManual]
                         ,[imuId]
                        ,[baseImuId]
                         ,[baseUomQty]
                        ,[unitPriceAlc]
                        ,[unitPriceAfc]
                        ,[totPriceAlc]
                        ,[totPriceAfc]
                        ,[priceListUnitPriceAlc]
                        ,[priceListUnitPriceAfc]
                        ,[priceSource]
                        ,[discountType]
                        ,[discountPerc]
                        ,[itemAddonsAlc]
                         ,[itemAddonsAfc]

                          ,[itemNetPriceAlc]
                        ,[itemNetPriceAfc]
                         ,[warantyPeriod]
                         ,[warantyPeriodUom]
                        ,[lineStatus]
                         ,[itemsDiscAlc]
                        ,[itemsDiscAfc]
                        ,[actualCostAlc]
                        ,[actualCostAfc]
                        ,[balanceQty]
                        ,[longDesc]
                        ,[taxAlc]
                        ,[taxAfc]
                        ,[maxDiscPer]
                        ,[allowedDiscPerc]
                        ,[allowedDiscAlc]
                         ,[allowedDiscAfc]
                        )
                 VALUES
                       (
                       @id
                       ,@fogId
                       ,@melId
                       ,@floId
                       ,@code
                       ,@refCode
                       ,@dateDgr
                       ,@dateDhi
                       ,@globalStatus
                       ,@type
                       ,@header
                       ,@targetMelId
                       ,@targetTrxHeaderId
                       ,@targetTrxCode
                       ,@maeId
                       ,@mcaId
                       ,@partType

                       ,@gprId
                       ,@siteId
                       ,@contactId
                       ,@billToFreeText
                       ,@PaymentTerms
                       ,@creditPeriodDays
                       ,@crrId
                       ,@fcuId
                       ,@exchngRate
                       ,@itemsTotalAlc
                       ,@addonsTotalAlc
                       ,@addonsTotalAfc
                       ,@totalDiscountsAlc
                       ,@totalDiscountsAfc
                       ,@netPriceAlc
                       ,@netPriceAfc
                       ,@currApproxAlc

                       ,@proposedAmountAlc
                       ,@proposedamountAfc
                       ,@rem
                       ,@ertId
                       ,@shipToFreeText
                       ,@isOnAccount
                       ,@taxExemptionPerc
                       ,@lines
                       ,@lineId
                       ,@seq
                       ,@source
                       ,@entryLevel
                       ,@BarCode
                       ,@roiId
                       ,@itemType
                       ,@itemId
                       ,@itemScn

                        ,@qty
                       ,@freeQtyManual
                       ,@imuId
                       ,@baseImuId
                       ,@baseUomQty
                       ,@unitPriceAlc
                       ,@unitPriceAfc
                       ,@totPriceAlc
                       ,@totPriceAfc
                       ,@priceListUnitPriceAlc
                       ,@priceListUnitPriceAfc
                       ,@priceSource
                       ,@discountType
                       ,@discountPerc
                       ,@itemAddonsAlc
                       ,@itemAddonsAfc
                       ,@itemNetPriceAlc

                       ,@itemNetPriceAfc
                       ,@warantyPeriod
                       ,@warantyPeriodUom
                       ,@lineStatus
                       ,@itemsDiscAlc
                       ,@itemsDiscAfc
                       ,@actualCostAlc
                       ,@actualCostAfc
                       ,@balanceQty
                       ,@longDesc
                       ,@taxAlc
                       ,@taxAfc
                       ,@maxDiscPer
                       ,@allowedDiscPerc
                       ,@allowedDiscAlc
                       ,@allowedDiscAfc
                      

                  
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesInvoiceM_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
       
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesInvoiceM]
                      
                      ( 
                         [id]
                        ,[fogId]
                         ,[melId]
                         ,[floId]
                        ,[code]
                         ,[refCode]
                        ,[dateDgr]
                        ,[dateDhi]
                        ,[globalStatus]
                        ,[type]
                        ,[header]
                        ,[targetMelId]
                        ,[targetTrxHeaderId]
                        ,[targetTrxCode]
                        ,[maeId]
                        ,[mcaId]
                         ,[partType]

                         ,[gprId]
                        ,[siteId]
                         ,[contactId]
                         ,[billToFreeText]
                        ,[PaymentTerms]
                         ,[creditPeriodDays]
                        ,[crrId]
                        ,[fcuId]
                        ,[exchngRate]
                        ,[itemsTotalAlc]
                        ,[addonsTotalAlc]
                        ,[addonsTotalAfc]
                        ,[totalDiscountsAlc]
                        ,[totalDiscountsAfc]
                        ,[netPriceAlc]
                        ,[netPriceAfc]
                         ,[currApproxAlc]

                         ,[proposedAmountAlc]
                        ,[proposedamountAfc]
                         ,[rem]
                         ,[ertId]
                        ,[shipToFreeText]
                         ,[isOnAccount]
                        ,[taxExemptionPerc]
                        ,[lines]
                       
                        )
                 VALUES
                       (
                       @id
                       ,@fogId
                       ,@melId
                       ,@floId
                       ,@code
                       ,@refCode
                       ,@dateDgr
                       ,@dateDhi
                       ,@globalStatus
                       ,@type
                       ,@header
                       ,@targetMelId
                       ,@targetTrxHeaderId
                       ,@targetTrxCode
                       ,@maeId
                       ,@mcaId
                       ,@partType

                       ,@gprId
                       ,@siteId
                       ,@contactId
                       ,@billToFreeText
                       ,@PaymentTerms
                       ,@creditPeriodDays
                       ,@crrId
                       ,@fcuId
                       ,@exchngRate
                       ,@itemsTotalAlc
                       ,@addonsTotalAlc
                       ,@addonsTotalAfc
                       ,@totalDiscountsAlc
                       ,@totalDiscountsAfc
                       ,@netPriceAlc
                       ,@netPriceAfc
                       ,@currApproxAlc

                       ,@proposedAmountAlc
                       ,@proposedamountAfc
                       ,@rem
                       ,@ertId
                       ,@shipToFreeText
                       ,@isOnAccount
                       ,@taxExemptionPerc
                       ,@lines
                       
                      

                  
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesInvoiceMList_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("code", sql.NVarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("addressLo", sql.NVarChar, req.body.addressLo)
        .input("addressFo", sql.NVarChar, req.body.addressFo)
        .input("isActive", sql.VarChar, req.body.isActive)
        .input("phone", sql.VarChar, req.body.phone)
        .input("phoneExt", sql.VarChar, req.body.phoneExt)
        .input("mobile", sql.NVarChar, req.body.mobile)
        .input("rem", sql.VarChar, req.body.rem)
        .input("email", sql.NVarChar, req.body.email)
        .input("customerType", sql.VarChar, req.body.customerType)
        .input("creditPeriod", sql.VarChar, req.body.creditPeriod)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesInvoiceMList]
                      
                      ( 
                         [id]
                        ,[code]
                         ,[descLo]
                         ,[descFo]
                        ,[shDescLo]
                         ,[shDescFo]
                        ,[addressLo]
                        ,[addressFo]
                        ,[isActive]
                        ,[phone]
                        ,[phoneExt]
                        ,[mobile]
                        ,[rem]
                        ,[email]
                        ,[customerType]
                        ,[creditPeriod]
                        
                        )
                 VALUES
                       (
                       @id
                       ,@code
                       ,@descLo
                       ,@descFo
                       ,@shDescLo
                       ,@shDescFo
                       ,@addressLo
                       ,@addressFo
                       ,@isActive
                       ,@phone
                       ,@phoneExt
                       ,@mobile
                       ,@rem
                       ,@email
                       ,@customerType
                       ,@creditPeriod
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedDetsView_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
        .input("lineId", sql.VarChar, req.body.lineId)
        .input("seq", sql.VarChar, req.body.seq)
        .input("source", sql.VarChar, req.body.source)
        .input("entryLevel", sql.VarChar, req.body.entryLevel)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("roiId", sql.VarChar, req.body.roiId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemScn", sql.VarChar, req.body.itemScn)

        .input("qty", sql.Numeric, req.body.qty)
        .input("freeQtyManual", sql.VarChar, req.body.freeQtyManual)
        .input("imuId", sql.VarChar, req.body.imuId)
        .input("baseImuId", sql.VarChar, req.body.baseImuId)
        .input("baseUomQty", sql.VarChar, req.body.baseUomQty)
        .input("unitPriceAlc", sql.Real, req.body.unitPriceAlc)
        .input("unitPriceAfc", sql.Real, req.body.unitPriceAfc)
        .input("totPriceAlc", sql.Real, req.body.totPriceAlc)
        .input("totPriceAfc", sql.Real, req.body.totPriceAfc)
        .input("priceListUnitPriceAlc", sql.Real, req.body.priceListUnitPriceAlc)
        .input("priceListUnitPriceAfc", sql.Real, req.body.priceListUnitPriceAfc)
        .input("priceSource", sql.VarChar, req.body.priceSource)
        .input("discountType", sql.VarChar, req.body.discountType)
        .input("discountPerc", sql.VarChar, req.body.discountPerc)
        .input("itemAddonsAlc", sql.VarChar, req.body.itemAddonsAlc)
        .input("itemAddonsAfc", sql.VarChar, req.body.itemAddonsAfc)
        .input("itemNetPriceAlc", sql.Real, req.body.itemNetPriceAlc)

        .input("itemNetPriceAfc", sql.Real, req.body.itemNetPriceAfc)
        .input("warantyPeriod", sql.VarChar, req.body.warantyPeriod)
        .input("warantyPeriodUom", sql.VarChar, req.body.warantyPeriodUom)
        .input("lineStatus", sql.NVarChar, req.body.lineStatus)
        .input("itemsDiscAlc", sql.Real, req.body.itemsDiscAlc)
        .input("itemsDiscAfc", sql.Real, req.body.itemsDiscAfc)
        .input("actualCostAlc", sql.Real, req.body.actualCostAlc)
        .input("actualCostAfc", sql.Real, req.body.actualCostAfc)
        .input("balanceQty", sql.Numeric, req.body.balanceQty)
        .input("longDesc", sql.NVarChar, req.body.longDesc)
        .input("taxAlc", sql.Numeric, req.body.taxAlc)
        .input("taxAfc", sql.Numeric, req.body.taxAfc)
        .input("maxDiscPer", sql.Numeric, req.body.maxDiscPer)
        .input("allowedDiscPerc", sql.VarChar, req.body.allowedDiscPerc)
        .input("allowedDiscAlc", sql.VarChar, req.body.allowedDiscAlc)
        .input("allowedDiscAfc", sql.VarChar, req.body.allowedDiscAfc)
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesManConfirmedDetsView]
                      
                      ( 
                         [id]
                        ,[fogId]
                         ,[melId]
                         ,[floId]
                        ,[code]
                         ,[refCode]
                        ,[dateDgr]
                        ,[dateDhi]
                        ,[globalStatus]
                        ,[type]
                        ,[header]
                        ,[targetMelId]
                        ,[targetTrxHeaderId]
                        ,[targetTrxCode]
                        ,[maeId]
                        ,[mcaId]
                         ,[partType]

                         ,[gprId]
                        ,[siteId]
                         ,[contactId]
                         ,[billToFreeText]
                        ,[PaymentTerms]
                         ,[creditPeriodDays]
                        ,[crrId]
                        ,[fcuId]
                        ,[exchngRate]
                        ,[itemsTotalAlc]
                        ,[addonsTotalAlc]
                        ,[addonsTotalAfc]
                        ,[totalDiscountsAlc]
                        ,[totalDiscountsAfc]
                        ,[netPriceAlc]
                        ,[netPriceAfc]
                         ,[currApproxAlc]

                         ,[proposedAmountAlc]
                        ,[proposedamountAfc]
                         ,[rem]
                         ,[ertId]
                        ,[shipToFreeText]
                         ,[isOnAccount]
                        ,[taxExemptionPerc]
                        ,[lines]
                        ,[lineId]
                        ,[seq]
                        ,[source]
                       
                        ,[entryLevel]
                        ,[BarCode]
                        ,[roiId]
                        ,[itemType]
                         ,[itemId]

                         ,[itemScn]
                        ,[qty]
                         ,[freeQtyManual]
                         ,[imuId]
                        ,[baseImuId]
                         ,[baseUomQty]
                        ,[unitPriceAlc]
                        ,[unitPriceAfc]
                        ,[totPriceAlc]
                        ,[totPriceAfc]
                        ,[priceListUnitPriceAlc]
                        ,[priceListUnitPriceAfc]
                        ,[priceSource]
                        ,[discountType]
                        ,[discountPerc]
                        ,[itemAddonsAlc]
                         ,[itemAddonsAfc]

                          ,[itemNetPriceAlc]
                        ,[itemNetPriceAfc]
                         ,[warantyPeriod]
                         ,[warantyPeriodUom]
                        ,[lineStatus]
                         ,[itemsDiscAlc]
                        ,[itemsDiscAfc]
                        ,[actualCostAlc]
                        ,[actualCostAfc]
                        ,[balanceQty]
                        ,[longDesc]
                        ,[taxAlc]
                        ,[taxAfc]
                        ,[maxDiscPer]
                        ,[allowedDiscPerc]
                        ,[allowedDiscAlc]
                         ,[allowedDiscAfc]
                        )
                 VALUES
                       (
                       @id
                       ,@fogId
                       ,@melId
                       ,@floId
                       ,@code
                       ,@refCode
                       ,@dateDgr
                       ,@dateDhi
                       ,@globalStatus
                       ,@type
                       ,@header
                       ,@targetMelId
                       ,@targetTrxHeaderId
                       ,@targetTrxCode
                       ,@maeId
                       ,@mcaId
                       ,@partType

                       ,@gprId
                       ,@siteId
                       ,@contactId
                       ,@billToFreeText
                       ,@PaymentTerms
                       ,@creditPeriodDays
                       ,@crrId
                       ,@fcuId
                       ,@exchngRate
                       ,@itemsTotalAlc
                       ,@addonsTotalAlc
                       ,@addonsTotalAfc
                       ,@totalDiscountsAlc
                       ,@totalDiscountsAfc
                       ,@netPriceAlc
                       ,@netPriceAfc
                       ,@currApproxAlc

                       ,@proposedAmountAlc
                       ,@proposedamountAfc
                       ,@rem
                       ,@ertId
                       ,@shipToFreeText
                       ,@isOnAccount
                       ,@taxExemptionPerc
                       ,@lines
                       ,@lineId
                       ,@seq
                       ,@source
                       ,@entryLevel
                       ,@BarCode
                       ,@roiId
                       ,@itemType
                       ,@itemId
                       ,@itemScn

                        ,@qty
                       ,@freeQtyManual
                       ,@imuId
                       ,@baseImuId
                       ,@baseUomQty
                       ,@unitPriceAlc
                       ,@unitPriceAfc
                       ,@totPriceAlc
                       ,@totPriceAfc
                       ,@priceListUnitPriceAlc
                       ,@priceListUnitPriceAfc
                       ,@priceSource
                       ,@discountType
                       ,@discountPerc
                       ,@itemAddonsAlc
                       ,@itemAddonsAfc
                       ,@itemNetPriceAlc

                       ,@itemNetPriceAfc
                       ,@warantyPeriod
                       ,@warantyPeriodUom
                       ,@lineStatus
                       ,@itemsDiscAlc
                       ,@itemsDiscAfc
                       ,@actualCostAlc
                       ,@actualCostAfc
                       ,@balanceQty
                       ,@longDesc
                       ,@taxAlc
                       ,@taxAfc
                       ,@maxDiscPer
                       ,@allowedDiscPerc
                       ,@allowedDiscAlc
                       ,@allowedDiscAfc
                      

                  
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedOrderDets_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesManConfirmedOrderDets]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]                       
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                       
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesManConfirmedOrderDetsSelected_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesManConfirmedOrderDetsSelected]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]                       
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                       
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesManConfirmedOrdersM_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesManConfirmedOrdersM]
                      
                      ( 
                         [SORefCodeNo]
                        ,[BillTo]
                         ,[ShipTo]
                         ,[PaymentTerms]
                        ,[MobileNo]
                         ,[ShiperGLNNo]
                        ,[RPDocNo]
                        ,[SOStatus]
                        ,[SODateTimeCreated]
                        ,[SOSalesManIdNo]
                        ,[SOTotalAmountNoVat]
                        ,[SOTotalAmountWVat]
                        
                        ,[SOTotalVatAmount]
                        ,[SOTotalItemFreeQty]
                        ,[SOTotalItemFreeAmount]
                        
                        ,[creditPeriodDays]  
                        ,[grpID]  
                        ,[dateDgr]  
                        ,[param1]  
                        ,[param2]  
                        )
                 VALUES
                       (
                       @SORefCodeNo
                       ,@BillTo
                       ,@ShipTo
                       ,@PaymentTerms
                       ,@MobileNo
                       ,@ShiperGLNNo
                       ,@RPDocNo
                       ,@SOStatus
                       ,@SODateTimeCreated
                       ,@SOSalesManIdNo
                       ,@SOTotalAmountNoVat
                       ,@SOTotalAmountWVat
                     
                       ,@SOTotalVatAmount
                       ,@SOTotalItemFreeQty
                       ,@SOTotalItemFreeAmount

                       ,@creditPeriodDays
                       ,@grpID
                       ,@dateDgr
                       ,@param1
                       ,@param2
                       
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesManConfirmedOrdersMSelected_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesManConfirmedOrdersMSelected]
                      
                      ( 
                         [SORefCodeNo]
                        ,[BillTo]
                         ,[ShipTo]
                         ,[PaymentTerms]
                        ,[MobileNo]
                         ,[ShiperGLNNo]
                        ,[RPDocNo]
                        ,[SOStatus]
                        ,[SODateTimeCreated]
                        ,[SOSalesManIdNo]
                        ,[SOTotalAmountNoVat]
                        ,[SOTotalAmountWVat]
                        
                        ,[SOTotalVatAmount]
                        ,[SOTotalItemFreeQty]
                        ,[SOTotalItemFreeAmount]
                        
                        ,[creditPeriodDays]  
                        ,[grpID]  
                        ,[dateDgr]  
                        ,[param1]  
                        ,[param2]  
                        )
                 VALUES
                       (
                       @SORefCodeNo
                       ,@BillTo
                       ,@ShipTo
                       ,@PaymentTerms
                       ,@MobileNo
                       ,@ShiperGLNNo
                       ,@RPDocNo
                       ,@SOStatus
                       ,@SODateTimeCreated
                       ,@SOSalesManIdNo
                       ,@SOTotalAmountNoVat
                       ,@SOTotalAmountWVat
                     
                       ,@SOTotalVatAmount
                       ,@SOTotalItemFreeQty
                       ,@SOTotalItemFreeAmount

                       ,@creditPeriodDays
                       ,@grpID
                       ,@dateDgr
                       ,@param1
                       ,@param2
                       
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrder_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

       
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrder]
                      
                      ( 
                         [SORefCodeNo]
                        ,[BillTo]
                         ,[ShipTo]
                         ,[PaymentTerms]
                        ,[MobileNo]
                         ,[ShiperGLNNo]
                        ,[RPDocNo]
                        ,[SOStatus]
                        ,[SODateTimeCreated]
                        ,[SOSalesManIdNo]
                        ,[SOTotalAmountNoVat]
                        ,[SOTotalAmountWVat]
                        
                        ,[SOTotalVatAmount]
                        ,[SOTotalItemFreeQty]
                        ,[SOTotalItemFreeAmount]
                        
                       
                        )
                 VALUES
                       (
                       @SORefCodeNo
                       ,@BillTo
                       ,@ShipTo
                       ,@PaymentTerms
                       ,@MobileNo
                       ,@ShiperGLNNo
                       ,@RPDocNo
                       ,@SOStatus
                       ,@SODateTimeCreated
                       ,@SOSalesManIdNo
                       ,@SOTotalAmountNoVat
                       ,@SOTotalAmountWVat
                     
                       ,@SOTotalVatAmount
                       ,@SOTotalItemFreeQty
                       ,@SOTotalItemFreeAmount

  
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDets_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        .input("SORemarks", sql.VarChar, req.body.SORemarks)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDets]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                        ,[SORemarks]                       
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                       ,@SORemarks
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsM_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        .input("SORemarks", sql.VarChar, req.body.SORemarks)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsM]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                        ,[SORemarks]                       
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                       ,@SORemarks
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrint_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
         .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrint]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrintCollection_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
         .input("CustomerSignature", sql.VarChar, req.body.CustomerSignature)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintCollection]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                         ,[CustomerSignature]
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                       ,@CustomerSignature
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrintCollectionR_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
         .input("CustomerSignature", sql.VarChar, req.body.CustomerSignature)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintCollectionR]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                         ,[CustomerSignature]
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                       ,@CustomerSignature
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrintDN_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintDN]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrintDSI_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintDSI]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                        ,[SOVatNumber]
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                      ,@SOVatNumber
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrintR_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintR]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                        ,[SOVatNumber]
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                      ,@SOVatNumber
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsMPrintRSReturn_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintRSReturn]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                        ,[SOVatNumber]
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                      ,@SOVatNumber
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintRSReturnInvoice_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsMPrintRSReturnInvoice]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SOSalesmanName]
                        ,[SOLineRemarks]
                        ,[SOPaymentType]
                        ,[SOCustomerName]
                        ,[SOVatNumber]
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SOSalesmanName
                      ,@SOLineRemarks
                      ,@SOPaymentType
                      ,@SOCustomerName
                      ,@SOVatNumber
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsViewInvoiceLine_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SORemarks", sql.VarChar, req.body.SORemarks)
        
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsViewInvoiceLine]
                      
                      ( 
                         [RPDocNo]
                        ,[DateTimeCreated]
                         ,[SORefCodeNo]
                         ,[SOItemCode]
                        ,[SOItemDescription]
                         ,[SOOrderQty]
                        ,[SOItemUnit]
                        ,[SOItemPrice]
                        ,[SOCustomerNo]
                        ,[SOAlreadySelected]
                        ,[SOItemFreeQty]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SORemarks]
                       
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@DateTimeCreated
                       ,@SORefCodeNo
                       ,@SOItemCode
                       ,@SOItemDescription
                       ,@SOOrderQty
                       ,@SOItemUnit
                       ,@SOItemPrice
                       ,@SOCustomerNo
                       ,@SOAlreadySelected
                       ,@SOItemFreeQty
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SORemarks
                    
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderDetsViewInvoiceLine1_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("dateDgr", sql.DateTime, req.body.dateDgr)
        .input("RefCode", sql.VarChar, req.body.RefCode)
        .input("Barcode", sql.VarChar, req.body.Barcode)
        .input("longDesc", sql.NVarChar, req.body.longDesc)
        .input("qty", sql.Numeric, req.body.qty)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("unitPriceAlc", sql.Float, req.body.unitPriceAlc)
        .input("gprId", sql.VarChar, req.body.gprId)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("freeQtyManual", sql.Numeric, req.body.freeQtyManual)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SORemarks", sql.VarChar, req.body.SORemarks)
        
         
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderDetsViewInvoiceLine1]
                      
                      ( 
                         [RPDocNo]
                        ,[dateDgr]
                         ,[RefCode]
                         ,[Barcode]
                        ,[longDesc]
                         ,[qty]
                        ,[itemType]
                        ,[unitPriceAlc]
                        ,[gprId]
                        ,[SOAlreadySelected]
                        ,[freeQtyManual]
                        ,[SOTotalAmountPrice]
                        ,[SOTotalAmountNetPrice]
                        ,[SOTotalVatAmount]
                        ,[SOTotalDiscountAmount]
                                 
                        ,[SORemarks]
                       
                        
                        )
                 VALUES
                       (
                       @RPDocNo
                       ,@dateDgr
                       ,@RefCode
                       ,@Barcode
                       ,@longDesc
                       ,@qty
                       ,@itemType
                       ,@unitPriceAlc
                       ,@gprId
                       ,@SOAlreadySelected
                       ,@freeQtyManual
                       ,@SOTotalAmountPrice
                       ,@SOTotalAmountNetPrice
                       ,@SOTotalVatAmount
                       ,@SOTotalDiscountAmount
                      
                      ,@SORemarks
                    
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
async SalesOrderfromERPM_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
       
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderfromERPM]
                      
                      ( 
                         [id]
                        ,[fogId]
                         ,[melId]
                         ,[floId]
                        ,[code]
                         ,[refCode]
                        ,[dateDgr]
                        ,[dateDhi]
                        ,[globalStatus]
                        ,[type]
                        ,[header]
                        ,[targetMelId]
                        ,[targetTrxHeaderId]
                        ,[targetTrxCode]
                        ,[maeId]
                        ,[mcaId]
                         ,[partType]

                         ,[gprId]
                        ,[siteId]
                         ,[contactId]
                         ,[billToFreeText]
                        ,[PaymentTerms]
                         ,[creditPeriodDays]
                        ,[crrId]
                        ,[fcuId]
                        ,[exchngRate]
                        ,[itemsTotalAlc]
                        ,[addonsTotalAlc]
                        ,[addonsTotalAfc]
                        ,[totalDiscountsAlc]
                        ,[totalDiscountsAfc]
                        ,[netPriceAlc]
                        ,[netPriceAfc]
                         ,[currApproxAlc]

                         ,[proposedAmountAlc]
                        ,[proposedamountAfc]
                         ,[rem]
                         ,[ertId]
                        ,[shipToFreeText]
                         ,[isOnAccount]
                        ,[taxExemptionPerc]
                        ,[lines]
                        
                        )
                 VALUES
                       (
                       @id
                       ,@fogId
                       ,@melId
                       ,@floId
                       ,@code
                       ,@refCode
                       ,@dateDgr
                       ,@dateDhi
                       ,@globalStatus
                       ,@type
                       ,@header
                       ,@targetMelId
                       ,@targetTrxHeaderId
                       ,@targetTrxCode
                       ,@maeId
                       ,@mcaId
                       ,@partType

                       ,@gprId
                       ,@siteId
                       ,@contactId
                       ,@billToFreeText
                       ,@PaymentTerms
                       ,@creditPeriodDays
                       ,@crrId
                       ,@fcuId
                       ,@exchngRate
                       ,@itemsTotalAlc
                       ,@addonsTotalAlc
                       ,@addonsTotalAfc
                       ,@totalDiscountsAlc
                       ,@totalDiscountsAfc
                       ,@netPriceAlc
                       ,@netPriceAfc
                       ,@currApproxAlc

                       ,@proposedAmountAlc
                       ,@proposedamountAfc
                       ,@rem
                       ,@ertId
                       ,@shipToFreeText
                       ,@isOnAccount
                       ,@taxExemptionPerc
                       ,@lines
                      

                  
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderM_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
        
        
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderM]
                      
                      ( 
                         [SORefCodeNo]
                        ,[BillTo]
                         ,[ShipTo]
                         ,[PaymentTerms]
                        ,[MobileNo]
                         ,[ShiperGLNNo]
                        ,[RPDocNo]
                        ,[SOStatus]
                        ,[SODateTimeCreated]
                        ,[SOSalesManIdNo]
                        ,[SOTotalAmountNoVat]
                        ,[SOTotalAmountWVat]
                        
                        ,[SOTotalVatAmount]
                        ,[SOTotalItemFreeQty]
                        ,[SOTotalItemFreeAmount]
                        
                        ,[creditPeriodDays]  
                        ,[grpID]  
                        ,[dateDgr]  
                        ,[param1]  
                        ,[param2]  
                        )
                 VALUES
                       (
                       @SORefCodeNo
                       ,@BillTo
                       ,@ShipTo
                       ,@PaymentTerms
                       ,@MobileNo
                       ,@ShiperGLNNo
                       ,@RPDocNo
                       ,@SOStatus
                       ,@SODateTimeCreated
                       ,@SOSalesManIdNo
                       ,@SOTotalAmountNoVat
                       ,@SOTotalAmountWVat
                     
                       ,@SOTotalVatAmount
                       ,@SOTotalItemFreeQty
                       ,@SOTotalItemFreeAmount

                       ,@creditPeriodDays
                       ,@grpID
                       ,@dateDgr
                       ,@param1
                       ,@param2
                       
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesOrderMPosted_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
        
        .input("SORemarks", sql.VarChar, req.body.param2)
        .query(
          ` 
            INSERT INTO [dbo].[tblSalesOrderMPosted]
                      
                      ( 
                         [SORefCodeNo]
                        ,[BillTo]
                         ,[ShipTo]
                         ,[PaymentTerms]
                        ,[MobileNo]
                         ,[ShiperGLNNo]
                        ,[RPDocNo]
                        ,[SOStatus]
                        ,[SODateTimeCreated]
                        ,[SOSalesManIdNo]
                        ,[SOTotalAmountNoVat]
                        ,[SOTotalAmountWVat]
                        
                        ,[SOTotalVatAmount]
                        ,[SOTotalItemFreeQty]
                        ,[SOTotalItemFreeAmount]
                        
                        ,[creditPeriodDays]  
                        ,[grpID]  
                        ,[dateDgr]  
                        ,[param1]  
                        ,[param2]  
                        ,[SORemarks]  
                        )
                 VALUES
                       (
                       @SORefCodeNo
                       ,@BillTo
                       ,@ShipTo
                       ,@PaymentTerms
                       ,@MobileNo
                       ,@ShiperGLNNo
                       ,@RPDocNo
                       ,@SOStatus
                       ,@SODateTimeCreated
                       ,@SOSalesManIdNo
                       ,@SOTotalAmountNoVat
                       ,@SOTotalAmountWVat
                     
                       ,@SOTotalVatAmount
                       ,@SOTotalItemFreeQty
                       ,@SOTotalItemFreeAmount

                       ,@creditPeriodDays
                       ,@grpID
                       ,@dateDgr
                       ,@param1
                       ,@param2
                       
                      ,@SORemarks
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async ShipmentGLNTracking_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("FEName", sql.VarChar, req.body.FEName)
        .input("FECountryOrigin", sql.VarChar, req.body.FECountryOrigin)
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .input("ShipmentDateConfirmation", sql.DateTime, req.body.ShipmentDateConfirmation)
        .input("GPSLocation", sql.VarChar, req.body.GPSLocation)
        .input("GPSLatitude", sql.VarChar, req.body.GPSLatitude)
        .input("GPSLongitude", sql.VarChar, req.body.GPSLongitude)
        .input("ProductBarcode", sql.VarChar, req.body.ProductBarcode)
        .input("ProductDescriptionE", sql.VarChar, req.body.ProductDescriptionE)
        .query(
          ` 
            INSERT INTO [dbo].[tblShipmentGLNTracking]
                      
                      ( 
                         [RequestNo]
                        ,[DateRequested]
                         ,[RequestStatus]
                         ,[FEName]
                        ,[FECountryOrigin]
                         ,[MemberID]
                        ,[ShipmentGLNNo]
                        ,[ShipmentDateConfirmation]
                        ,[GPSLocation]
                        ,[GPSLatitude]
                        ,[GPSLongitude]
                        ,[ProductBarcode]
                        
                        ,[ProductDescriptionE]
                       
                        )
                 VALUES
                       (
                       @RequestNo
                       ,@DateRequested
                       ,@RequestStatus
                       ,@FEName
                       ,@FECountryOrigin
                       ,@MemberID
                       ,@ShipmentGLNNo
                       ,@ShipmentDateConfirmation
                       ,@GPSLocation
                       ,@GPSLatitude
                       ,@GPSLongitude
                       ,@ProductBarcode
                       ,@ProductDescriptionE
                     
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async StockRequestVan_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.VarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("RequestStatusCode", sql.VarChar, req.body.RequestStatusCode)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblStockRequestVan]
                      
                      ( 
                         [ItemCode]
                        ,[ItemDescription]
                         ,[ItemUnit]
                         ,[AvailableQty]
                        ,[BinNoLocation]
                         ,[ItemPrice]
                        ,[RequestStatus]
                        ,[RequestStatusCode]
                        
                       
                        )
                 VALUES
                       (
                       @ItemCode
                       ,@ItemDescription
                       ,@ItemUnit
                       ,@AvailableQty
                       ,@BinNoLocation
                       ,@ItemPrice
                       ,@RequestStatus
                       ,@RequestStatusCode
                      
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async StocksOnVan_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.VarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("RequestStatusCode", sql.VarChar, req.body.RequestStatusCode)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblStocksOnVan]
                      
                      ( 
                         [ItemCode]
                        ,[ItemDescription]
                         ,[ItemUnit]
                         ,[AvailableQty]
                        ,[BinNoLocation]
                         ,[ItemPrice]
                        ,[RequestStatus]
                        ,[RequestStatusCode]
                        
                       
                        )
                 VALUES
                       (
                       @ItemCode
                       ,@ItemDescription
                       ,@ItemUnit
                       ,@AvailableQty
                       ,@BinNoLocation
                       ,@ItemPrice
                       ,@RequestStatus
                       ,@RequestStatusCode
                      
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async StocksOnVanPrint_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.VarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("RequestStatusCode", sql.VarChar, req.body.RequestStatusCode)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblStocksOnVanPrint]
                      
                      ( 
                         [ItemCode]
                        ,[ItemDescription]
                         ,[ItemUnit]
                         ,[AvailableQty]
                        ,[BinNoLocation]
                         ,[ItemPrice]
                        ,[RequestStatus]
                        ,[RequestStatusCode]
                        
                       
                        )
                 VALUES
                       (
                       @ItemCode
                       ,@ItemDescription
                       ,@ItemUnit
                       ,@AvailableQty
                       ,@BinNoLocation
                       ,@ItemPrice
                       ,@RequestStatus
                       ,@RequestStatusCode
                      
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SysNo_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("trxCtr", sql.Numeric, req.body.trxCtr)
        .input("RoutePlanNo", sql.Numeric, req.body.RoutePlanNo)
        .input("SalesOrderNo", sql.Numeric, req.body.SalesOrderNo)
        .input("VanAutoNumber", sql.Numeric, req.body.VanAutoNumber)
       
        
        .query(
          ` 
            INSERT INTO [dbo].[TblSysNo]
                      
                      ( 
                         [trxCtr]
                        ,[RoutePlanNo]
                         ,[SalesOrderNo]
                         ,[VanAutoNumber]
                        
                        
                       
                        )
                 VALUES
                       (
                       @trxCtr
                       ,@RoutePlanNo
                       ,@SalesOrderNo
                       ,@VanAutoNumber
                      
                      
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SysNoCounter_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("SalesOrderNo", sql.Numeric, req.body.SalesOrderNo)
        .input("SalesInvoiceNo", sql.Numeric, req.body.SalesInvoiceNo)
        .input("VanAutoNumber", sql.Numeric, req.body.VanAutoNumber)
        .input("trxCtr", sql.Numeric, req.body.trxCtr)
        .input("SalesReturnNo", sql.Numeric, req.body.SalesReturnNo)
       
        
        .query(
          ` 
            INSERT INTO [dbo].[TblSysNoCounter]
                      
                      ( 
                         [SalesOrderNo]
                        ,[SalesInvoiceNo]
                         ,[VanAutoNumber]
                         ,[trxCtr]
                        ,[SalesReturnNo]
                        
                       
                        )
                 VALUES
                       (
                       @SalesOrderNo
                       ,@SalesInvoiceNo
                       ,@VanAutoNumber
                       ,@trxCtr
                       ,@SalesReturnNo
                      
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async UsersLoggedIn_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("jwtToken", sql.VarChar, req.body.jwtToken)
        .input("UserID", sql.VarChar, req.body.UserID)
        .input("username", sql.NVarChar, req.body.username)
        .input("loName", sql.VarChar, req.body.loName)
        .input("foName", sql.VarChar, req.body.foName)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("SignINStatus", sql.TinyInt, req.body.SignINStatus)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblUsersLoggedIn]
                      
                      ( 
                         [jwtToken]
                        ,[UserID]
                         ,[username]
                         ,[loName]
                        ,[foName]
                        ,[fogId]
                        ,[SignINStatus]
                       
                        )
                 VALUES
                       (
                       @jwtToken
                       ,@UserID
                       ,@username
                       ,@loName
                       ,@foName
                       ,@fogId
                        ,@SignINStatus
              
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async UsersLoginSalesMan_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("id_one", sql.VarChar, req.body.id_one)
        .input("username", sql.NVarChar, req.body.username)
        .input("nameLo", sql.NVarChar, req.body.nameLo)
        .input("nameFo", sql.NVarChar, req.body.nameFo)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("salesman", sql.NVarChar, req.body.salesman)
        .input("id_two", sql.VarChar, req.body.id_two)
        .input("code", sql.VarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("role", sql.NVarChar, req.body.role)
        .input("eepId", sql.VarChar, req.body.eepId)
        .input("rem", sql.VarChar, req.body.rem)
        .input("categoryId", sql.VarChar, req.body.categoryId)
        
        .input("type", sql.VarChar, req.body.type)
        .input("issuePolicyId", sql.VarChar, req.body.issuePolicyId)
        .input("isVanSale", sql.VarChar, req.body.isVanSale)
        .input("flold", sql.VarChar, req.body.flold)
        .input("priceListId", sql.VarChar, req.body.priceListId)
        .input("salesPolicyId", sql.VarChar, req.body.salesPolicyId)
        .input("collectionPolicyId", sql.VarChar, req.body.collectionPolicyId)
        .input("vouchSetupId", sql.VarChar, req.body.vouchSetupId)
        .input("collectionMethodId", sql.VarChar, req.body.collectionMethodId)
        .input("targetBcdId", sql.VarChar, req.body.targetBcdId)
        .input("checkCreditLimit", sql.Real, req.body.checkCreditLimit)
        .input("openingBalanceAlc", sql.VarChar, req.body.openingBalanceAlc)
        .input("regionID", sql.VarChar, req.body.regionID)
        .input("branchFlold", sql.VarChar, req.body.branchFlold)
        .input("maxDiscountPerc", sql.VarChar, req.body.maxDiscountPerc)
        .input("en", sql.VarChar, req.body.en)
        .input("token", sql.VarChar, req.body.token)
        .query(
          ` 
            INSERT INTO [dbo].[tblUsersLoginSalesMan]
                      
                      ( 
                         [id_one]
                        ,[username]
                         ,[nameLo]
                         ,[nameFo]
                        ,[fogId]
                         ,[salesman]
                        ,[id_two]
                        ,[code]
                        ,[descLo]
                        ,[descFo]
                        ,[role]
                        ,[eepId]
                        ,[rem]
                        ,[categoryId]
                        ,[shDescLo]
                        ,[shDescFo]       
                        
                        ,[type]
                        ,[issuePolicyId]
                         ,[isVanSale]
                         ,[flold]
                        ,[priceListId]
                         ,[salesPolicyId]
                        ,[collectionPolicyId]
                        ,[vouchSetupId]
                        ,[collectionMethodId]
                        ,[targetBcdId]
                        ,[checkCreditLimit]
                        ,[openingBalanceAlc]
                        ,[regionID]
                        ,[branchFlold]
                        ,[maxDiscountPerc]
                        ,[en]
                        ,[token]
                        )
                 VALUES
                       (
                       @id_one
                       ,@username
                       ,@nameLo
                       ,@nameFo
                       ,@fogId
                       ,@salesman
                       ,@id_two
                       ,@code
                       ,@descLo
                       ,@descFo
                       ,@role
                       ,@eepId
                       ,@rem
                       ,@categoryId
                       ,@shDescLo
                       ,@shDescFo
                      
                        ,@type
                       ,@issuePolicyId
                       ,@isVanSale
                       ,@flold
                       ,@priceListId
                       ,@salesPolicyId
                       ,@collectionPolicyId
                       ,@vouchSetupId
                       ,@collectionMethodId
                       ,@targetBcdId
                       ,@checkCreditLimit
                       ,@openingBalanceAlc
                       ,@regionID
                       ,@branchFlold
                       ,@maxDiscountPerc
                       ,@en
                       ,@token
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async VanMaster_post(req, res, next) {
    try {
  const file = req.files["Photo"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("VanIDNo", sql.VarChar, req.body.VanIDNo)
        .input("ModelNo", sql.VarChar, req.body.ModelNo)
        .input("VanMake", sql.VarChar, req.body.VanMake)
        .input("VanColor", sql.VarChar, req.body.VanColor)
        .input("PlateNo", sql.VarChar, req.body.PlateNo)
        .input("Photo", sql.VarChar, url)
        .input("VanInUsed", sql.TinyInt, req.body.VanInUsed)
        .input("VanSelected", sql.TinyInt, req.body.VanSelected)
        .input("VehCategory", sql.VarChar, req.body.VehCategory)
        .input("VehSize", sql.VarChar, req.body.VehSize)
        .input("VehWeight", sql.Real, req.body.VehWeight)
        .query(
          ` 
            INSERT INTO [dbo].[tblVanMaster]
                      
                      ( 
                         [VanIDNo]
                        ,[ModelNo]
                         ,[VanMake]
                         ,[VanColor]
                        ,[PlateNo]
                         ,[Photo]
                        ,[VanInUsed]
                        ,[VanSelected]
                        ,[VehCategory]
                        ,[VehSize]
                        ,[VehWeight]
                       
                        
                        )
                 VALUES
                       (
                       @VanIDNo
                       ,@ModelNo
                       ,@VanMake
                       ,@VanColor
                       ,@PlateNo
                       ,@Photo
                       ,@VanInUsed
                       ,@VanSelected
                       ,@VehCategory
                       ,@VehSize
                       ,@VehWeight
                      
                      
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async VehicleConditions_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
       .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("PlateNo", sql.VarChar, req.body.PlateNo)
        .input("TiresCondition", sql.NVarChar, req.body.TiresCondition)
        .input("ACCondition", sql.VarChar, req.body.ACCondition)
        .input("PetrolLevel", sql.VarChar, req.body.PetrolLevel)
        .input("Odometer", sql.Numeric, req.body.Odometer)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("VanIDNo", sql.VarChar, req.body.VanIDNo)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblVehicleConditions]
                      
                      ( 
                         [DateTimeCreated]
                        ,[PlateNo]
                         ,[TiresCondition]
                         ,[ACCondition]
                        ,[PetrolLevel]
                        ,[Odometer]
                        ,[UserLoginID]
                        ,[VanIDNo]
                        )
                 VALUES
                       (
                       @DateTimeCreated
                       ,@PlateNo
                       ,@TiresCondition
                       ,@ACCondition
                       ,@PetrolLevel
                       ,@Odometer
                        ,@UserLoginID
                       ,@VanIDNo
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async VehiclePhotos_post(req, res, next) {
    try {
  const file = req.files["VPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("VPhoto", sql.VarChar, url)
        .input("VIDNo", sql.VarChar, req.body.VIDNo)
        
        .query(
          ` 
            INSERT INTO [dbo].[tblVehiclePhotos]
                      
                      ( 
                         [DateTimeCreated]
                        ,[VPhoto]
                         ,[VIDNo]
                     
                        )
                 VALUES
                       (
                       @DateTimeCreated
                       ,@VPhoto
                       ,@VIDNo
        
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async VersionNo_post(req, res, next) {
    try {
  
      let pool = await sql.connect(config);

      let data = await pool
        .request()
      
        
       .input("TableName", sql.VarChar, req.body.TableName)
        .input("VersionNum", sql.Numeric, req.body.VersionNum)
       
        
        .query(
          ` 
            INSERT INTO [dbo].[tblVersionNo]
                      
                      ( 
                         [TableName]
                        ,[VersionNum]
                        
                        )
                 VALUES
                       (
                       @TableName
                       ,@VersionNum
                       
                       )`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
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
   async ItemBarcodesReturns_Put(req, res, next) {
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
        .input("qtyreturn", sql.Numeric, req.body.qtyreturn)
        .input("unitPriceAfc", sql.Real, req.body.unitPriceAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("totalTaxAlc", sql.Real, req.body.totalTaxAlc)
        .input("itemDiscAlc", sql.Real, req.body.itemDiscAlc)

        .query(
          ` 
          UPDATE [dbo].[tblItemBarcodesReturns]
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
,[qtyreturn] =@qtyreturn
,[unitPriceAfc] =@unitPriceAfc
,[rem] =@rem
,[totalTaxAlc] =@totalTaxAlc
,[itemDiscAlc] =@itemDiscAlc



WHERE tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async ItemBarcodesTmp_Put(req, res, next) {
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
       .input("unitPriceAlc", sql.Real, req.body.unitPriceAlc)
        .input("longDesc", sql.VarChar, req.body.longDesc)
        .input("qty", sql.Numeric, req.body.qty)

        .query(
          ` 
          UPDATE [dbo].[tblItemBarcodesTmp]
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
,[unitPriceAlc] =@unitPriceAlc
,[longDesc] =@longDesc

,[qty] =@qty




WHERE tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async ItemMaster_Put(req, res, next) {
    try {
        const file = req.files["ItemPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

       .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.NVarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("ItemCategoryCode", sql.VarChar, req.body.ItemCategoryCode)
        .input("ItemCategoryDesc", sql.VarChar, req.body.ItemCategoryDesc)
        .input("ItemPhoto", sql.VarChar, url)

        .query(
          ` 
          UPDATE [dbo].[tblItemMaster]
SET

[ItemCode] =@ItemCode
,[ItemDescription] =@ItemDescription
,[ItemUnit] =@ItemUnit
,[AvailableQty] =@AvailableQty
,[BinNoLocation] =@BinNoLocation
,[ItemPrice] =@ItemPrice
,[ItemCategoryCode] =@ItemCategoryCode
,[ItemCategoryDesc] =@ItemCategoryDesc
,[ItemPhoto] =@ItemPhoto

WHERE tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async LIMembers_Put(req, res, next) {
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
          UPDATE [dbo].[tblLIMembers]
SET

[MemberID] =@MemberID
,[GCPCode] =@GCPCode
,[CompanyNameE] =@CompanyNameE
,[CompanyNameA] =@CompanyNameA
,[CompanyCRNo] =@CompanyCRNo
,[CompanyAddress] =@CompanyAddress
,[CompanyVatNo] =@CompanyVatNo
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
    async MemberProducts_Put(req, res, next) {
    try {
      
      let pool = await sql.connect(config);
      const ProductID = req.params.ProductID;
      let data = await pool
        .request()

          .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ProductNameE", sql.NVarChar, req.body.ProductNameE)
        .input("ProductNameA", sql.NVarChar, req.body.ProductNameA)
        .input("BrandName", sql.NVarChar, req.body.BrandName)
        .input("ProductTypeID", sql.Numeric, req.body.ProductTypeID)
        .input("Origin", sql.NVarChar, req.body.Origin)
        .input("ColorID", sql.Numeric, req.body.ColorID)
        .input("PackagingTypeID", sql.Numeric, req.body.PackagingTypeID)
        .input("PackagingLevelID", sql.Numeric, req.body.PackagingLevelID)
        .input("MnfCode", sql.VarChar, req.body.MnfCode)
        .input("MnfGLN", sql.VarChar, req.body.MnfGLN)
        .input("ProvGLN", sql.VarChar, req.body.ProvGLN)
        .input("ImageURL", sql.VarChar, req.body.ImageURL)
        .input("DetailsPage", sql.VarChar, req.body.DetailsPage)
        .input("ChildProductID", sql.Numeric, req.body.ChildProductID)
        .input("ChildQuantity", sql.Numeric, req.body.ChildQuantity)
        .input("UOMID", sql.Numeric, req.body.UOMID)
        .input("Size", sql.Numeric, req.body.Size)

        .input("BarCodeID", sql.Numeric, req.body.BarCodeID)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("BarCodeURL", sql.NVarChar, req.body.BarCodeURL)
        .input("IsActive", sql.TinyInt, req.body.IsActive)
        .input("CreatedBy", sql.Numeric, req.body.CreatedBy)
        .input("CreatedDate", sql.DateTime, req.body.CreatedDate)
        .input("UpdatedBy", sql.Numeric, req.body.UpdatedBy)
        .input("UpdatedDate", sql.DateTime, req.body.UpdatedDate)
        .query(
          ` 
          UPDATE [dbo].[tblMemberProducts]
SET

[MemberID] =@MemberID
,[ProductNameE] =@ProductNameE
,[ProductNameA] =@ProductNameA
,[BrandName] =@BrandName
,[ProductTypeID] =@ProductTypeID
,[Origin] =@Origin
,[ColorID] =@ColorID
,[PackagingTypeID] =@PackagingTypeID
,[PackagingLevelID] =@PackagingLevelID
,[MnfCode] =@MnfCode
,[MnfGLN] =@MnfGLN
,[ProvGLN] =@ProvGLN
,[ImageURL] =@ImageURL
,[DetailsPage] =@DetailsPage
,[ChildProductID] =@ChildProductID
,[ChildQuantity] =@ChildQuantity
,[UOMID] =@UOMID
,[Size] =@Size
,[BarCodeID] =@BarCodeID
,[BarCode] =@BarCode
,[BarCodeURL] =@BarCodeURL
,[IsActive] =@IsActive
,[CreatedBy] =@CreatedBy
,[CreatedDate] =@CreatedDate
,[UpdatedBy] =@UpdatedBy
,[UpdatedDate] =@UpdatedDate

WHERE ProductID='${ProductID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async Members_Put(req, res, next) {
    try {
      
      let pool = await sql.connect(config);
      const MemberID = req.params.MemberID;
      let data = await pool
        .request()

           .input("UserID", sql.Numeric, req.body.UserID)
        .input("MemberNameE", sql.NVarChar, req.body.MemberNameE)
        .input("MemberNameA", sql.NVarChar, req.body.MemberNameA)
        .input("MemberType", sql.VarChar, req.body.MemberType)
        .input("Address1", sql.NVarChar, req.body.Address1)
        .input("Address2", sql.NVarChar, req.body.Address2)
        .input("POBox", sql.VarChar, req.body.POBox)
        .input("CityID", sql.Numeric, req.body.CityID)
        .input("Phone1", sql.VarChar, req.body.Phone1)
        .input("Phone2", sql.VarChar, req.body.Phone2)
        .input("Fax", sql.VarChar, req.body.Fax)
        .input("Staff", sql.Numeric, req.body.Staff)
        .input("Email", sql.VarChar, req.body.Email)
        .input("Website", sql.VarChar, req.body.Website)
        .input("IndustryTypeID", sql.VarChar, req.body.IndustryTypeID)
        .input("FieldOfWorkID", sql.VarChar, req.body.FieldOfWorkID)
        .input("OtherFieldOfWork", sql.NVarChar, req.body.OtherFieldOfWork)
        .input("Products", sql.VarChar, req.body.Products)

        .input("GS1Prefix", sql.Numeric, req.body.GS1Prefix)
        .input("MOCRegNo", sql.VarChar, req.body.MOCRegNo)
        .input("MOCRegDate", sql.Date, req.body.MOCRegDate)
        .input("MOCRegCert", sql.VarChar, req.body.MOCRegCert)
        .input("GLNID", sql.Numeric, req.body.GLNID)
        .input("GLN", sql.VarChar, req.body.GLN)
        .input("Is14", sql.TinyInt, req.body.Is14)
        .input("Status", sql.VarChar, req.body.Status)
       
        .input("Parent", sql.Numeric, req.body.Parent)
        .input("CreatedBy", sql.Numeric, req.body.CreatedBy)
        .input("CreatedDate", sql.DateTime, req.body.CreatedDate)
        .input("UpdatedBy", sql.Numeric, req.body.UpdatedBy)
        .input("UpdatedDate", sql.DateTime, req.body.UpdatedDate)
        .input("MembershipTypeID", sql.Numeric, req.body.MembershipTypeID)
        .input("OtherIndustry", sql.NVarChar, req.body.OtherIndustry)
        .input("IntID", sql.Numeric, req.body.IntID)
        .query(
          ` 
          UPDATE [dbo].[tblMembers]
SET

[UserID] =@UserID
,[MemberNameE] =@MemberNameE
,[MemberNameA] =@MemberNameA
,[MemberType] =@MemberType
,[Address1] =@Address1
,[Address2] =@Address2
,[POBox] =@POBox
,[CityID] =@CityID
,[Phone1] =@Phone1
,[Phone2] =@Phone2
,[Fax] =@Fax
,[Staff] =@Staff
,[Email] =@Email
,[Website] =@Website
,[IndustryTypeID] =@IndustryTypeID
,[FieldOfWorkID] =@FieldOfWorkID
,[OtherFieldOfWork] =@OtherFieldOfWork
,[Products] =@Products

,[GS1Prefix] =@GS1Prefix
,[MOCRegNo] =@MOCRegNo
,[MOCRegDate] =@MOCRegDate
,[MOCRegCert] =@MOCRegCert
,[GLNID] =@GLNID
,[GLN] =@GLN
,[Is14] =@Is14
,[Status] =@Status

,[Parent] =@Parent
,[CreatedBy] =@CreatedBy
,[CreatedDate] =@CreatedDate
,[UpdatedBy] =@UpdatedBy
,[UpdatedDate] =@UpdatedDate
,[MembershipTypeID] =@MembershipTypeID
,[OtherIndustry] =@OtherIndustry
,[IntID] =@IntID

WHERE MemberID='${MemberID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFs_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFs]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsRPrintInvoice_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFsRPrintInvoice]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsRPrintInvoiceDirect_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFsRPrintInvoiceDirect]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesCollectionPrint_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFsSalesCollectionPrint]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesCollectionReprint_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFsSalesCollectionReprint]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesReturnPrint_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFsSalesReturnPrint]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSalesReturnReprint_Put(req, res, next) {
    try {
        const file = req.files["PDFFileName"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("PDFFileName", sql.VarChar, url)
        .query(
          ` 
          UPDATE [dbo].[tblPDFsSalesReturnReprint]
SET

[RPDocNo] =@RPDocNo
,[PDFFileName] =@PDFFileName



WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async PDFsSummary_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

          .input("SalesManName", sql.VarChar, req.body.SalesManName)
       
        .query(
          ` 
          UPDATE [dbo].[tblPDFsSummary]
SET

[SalesManName] =@SalesManName
WHERE tblPDFsID='${tblPDFsID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async QRCodeLogin_Put(req, res, next) {
    try {
        
      let pool = await sql.connect(config);
      const tblQRCodeLoginID = req.params.tblQRCodeLoginID;
      let data = await pool
        .request()

          .input("QRLoginID", sql.VarChar, req.body.QRLoginID)
        .input("QRLoginPass", sql.VarChar, req.body.QRLoginPass)
       
        .query(
          ` 
          UPDATE [dbo].[tblQRCodeLogin]
SET

[QRLoginID] =@QRLoginID
,[QRLoginPass] =@QRLoginPass
WHERE tblQRCodeLoginID='${tblQRCodeLoginID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestDets_Put(req, res, next) {
    try {
       const file = req.files["ProductPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

           .input("ProductID", sql.Numeric, req.body.ProductID)
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("ProductBarcode", sql.VarChar, req.body.ProductBarcode)
        .input("ProductDescriptionE", sql.VarChar, req.body.ProductDescriptionE)
        .input("ProductDescriptionA", sql.VarChar, req.body.ProductDescriptionA)
        .input("ProductModelNo", sql.VarChar, req.body.ProductModelNo)
        .input("ProductSerialNo", sql.VarChar, req.body.ProductSerialNo)
        .input("ProductHSCode", sql.VarChar, req.body.ProductHSCode)
        .input("ProductBrandName", sql.VarChar, req.body.ProductBrandName)
        .input("ProductUnit", sql.VarChar, req.body.ProductUnit)
        .input("ProductType", sql.VarChar, req.body.ProductType)
        .input("ProductSize", sql.VarChar, req.body.ProductSize)
        .input("ProductPhotoIDNo", sql.Numeric, req.body.ProductPhotoIDNo)
        .input("ProductPhoto", sql.VarChar, url)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .input("ProductQtyOrder", sql.Numeric, req.body.ProductQtyOrder)
        .query(
          ` 
          UPDATE [dbo].[tblRequestDets]
SET

[ProductID] =@ProductID
,[RequestNo] =@RequestNo
,[DateRequested] =@DateRequested
,[RequestStatus] =@RequestStatus
,[ProductBarcode] =@ProductBarcode
,[ProductDescriptionE] =@ProductDescriptionE
,[ProductDescriptionA] =@ProductDescriptionA
,[ProductModelNo] =@ProductModelNo
,[ProductSerialNo] =@ProductSerialNo
,[ProductHSCode] =@ProductHSCode
,[ProductBrandName] =@ProductBrandName
,[ProductUnit] =@ProductUnit
,[ProductType] =@ProductType
,[ProductSize] =@ProductSize
,[ProductPhotoIDNo] =@ProductPhotoIDNo
,[ProductPhoto] =@ProductPhoto
,[ShipmentGLNNo] =@ShipmentGLNNo
,[ProductQtyOrder] =@ProductQtyOrder

WHERE tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestDetsSHP_Put(req, res, next) {
    try {
       const file = req.files["ProductPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

           .input("ProductID", sql.Numeric, req.body.ProductID)
        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("ProductBarcode", sql.VarChar, req.body.ProductBarcode)
        .input("ProductDescriptionE", sql.VarChar, req.body.ProductDescriptionE)
        .input("ProductDescriptionA", sql.VarChar, req.body.ProductDescriptionA)
        .input("ProductModelNo", sql.VarChar, req.body.ProductModelNo)
        .input("ProductSerialNo", sql.VarChar, req.body.ProductSerialNo)
        .input("ProductHSCode", sql.VarChar, req.body.ProductHSCode)
        .input("ProductBrandName", sql.VarChar, req.body.ProductBrandName)
        .input("ProductUnit", sql.VarChar, req.body.ProductUnit)
        .input("ProductType", sql.VarChar, req.body.ProductType)
        .input("ProductSize", sql.VarChar, req.body.ProductSize)
        .input("ProductPhotoIDNo", sql.Numeric, req.body.ProductPhotoIDNo)
        .input("ProductPhoto", sql.VarChar, url)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .input("ProductQtyOrder", sql.Numeric, req.body.ProductQtyOrder)
        .query(
          ` 
          UPDATE [dbo].[tblRequestDetsSHP]
SET

[ProductID] =@ProductID
,[RequestNo] =@RequestNo
,[DateRequested] =@DateRequested
,[RequestStatus] =@RequestStatus
,[ProductBarcode] =@ProductBarcode
,[ProductDescriptionE] =@ProductDescriptionE
,[ProductDescriptionA] =@ProductDescriptionA
,[ProductModelNo] =@ProductModelNo
,[ProductSerialNo] =@ProductSerialNo
,[ProductHSCode] =@ProductHSCode
,[ProductBrandName] =@ProductBrandName
,[ProductUnit] =@ProductUnit
,[ProductType] =@ProductType
,[ProductSize] =@ProductSize
,[ProductPhotoIDNo] =@ProductPhotoIDNo
,[ProductPhoto] =@ProductPhoto
,[ShipmentGLNNo] =@ShipmentGLNNo
,[ProductQtyOrder] =@ProductQtyOrder

WHERE tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestMaster_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

            .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("FEName", sql.VarChar, req.body.FEName)
        .input("FECountryOrigin", sql.VarChar, req.body.FECountryOrigin)
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .query(
          ` 
          UPDATE [dbo].[tblRequestMaster]
SET


[RequestNo] =@RequestNo
,[DateRequested] =@DateRequested
,[RequestStatus] =@RequestStatus
,[FEName] =@FEName
,[FECountryOrigin] =@FECountryOrigin
,[MemberID] =@MemberID
,[ShipmentGLNNo] =@ShipmentGLNNo
WHERE tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RequestMasterSHP_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

            .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("FEName", sql.VarChar, req.body.FEName)
        .input("FECountryOrigin", sql.VarChar, req.body.FECountryOrigin)
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .query(
          ` 
          UPDATE [dbo].[tblRequestMasterSHP]
SET


[RequestNo] =@RequestNo
,[DateRequested] =@DateRequested
,[RequestStatus] =@RequestStatus
,[FEName] =@FEName
,[FECountryOrigin] =@FECountryOrigin
,[MemberID] =@MemberID
,[ShipmentGLNNo] =@ShipmentGLNNo
WHERE tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteDetails_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

            .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.VarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOPickedQty", sql.Numeric, req.body.SOPickedQty)
        .query(
          ` 
          UPDATE [dbo].[tblRouteDetails]
SET


[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOPickedQty] =@SOPickedQty

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterData_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterDataID = req.params.tblRouteMasterDataID;
      let data = await pool
        .request()

              .input("RouteIDNo", sql.VarChar, req.body.RouteIDNo)
        .input("RouteRegion", sql.VarChar, req.body.RouteRegion)
        .input("RouteCity", sql.VarChar, req.body.RouteCity)
        .input("RouteArea", sql.VarChar, req.body.RouteArea)
        .input("RouteAreaGPS", sql.VarChar, req.body.RouteAreaGPS)
        .input("RouteGeoFenceGPS", sql.VarChar, req.body.RouteGeoFenceGPS)
        .input("RouteInUsed", sql.TinyInt, req.body.RouteInUsed)
        .query(
          ` 
          UPDATE [dbo].[tblRouteMasterData]
SET


[RouteIDNo] =@RouteIDNo
,[RouteRegion] =@RouteRegion
,[RouteCity] =@RouteCity
,[RouteArea] =@RouteArea
,[RouteAreaGPS] =@RouteAreaGPS
,[RouteGeoFenceGPS] =@RouteGeoFenceGPS
,[RouteInUsed] =@RouteInUsed


WHERE tblRouteMasterDataID='${tblRouteMasterDataID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterPlan_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

               .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SoDate", sql.DateTime, req.body.SoDate)
        .input("SOAreaAssigned", sql.VarChar, req.body.SOAreaAssigned)
        .input("SORouteNo", sql.VarChar, req.body.SORouteNo)
        .input("SOShipTo", sql.VarChar, req.body.SOShipTo)
        .input("SOBillTo", sql.VarChar, req.body.SOBillTo)
        .input("SOStage", sql.VarChar, req.body.SOStage)
        .input("SOAssignedVanIDNo", sql.VarChar, req.body.SOAssignedVanIDNo)
        .input("SOAssignedDriverIDNo", sql.VarChar, req.body.SOAssignedDriverIDNo)
        .input("SOAreaGPS", sql.VarChar, req.body.SOAreaGPS)
        .input("SOStartTime", sql.DateTime, req.body.SOStartTime)
        .input("SOEndTime", sql.DateTime, req.body.SOEndTime)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .query(
          ` 
          UPDATE [dbo].[tblRouteMasterPlan]
SET


[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SoDate] =@SoDate
,[SOAreaAssigned] =@SOAreaAssigned
,[SORouteNo] =@SORouteNo
,[SOShipTo] =@SOShipTo
,[SOBillTo] =@SOBillTo
,[SOStage] =@SOStage
,[SOAssignedVanIDNo] =@SOAssignedVanIDNo
,[SOAssignedDriverIDNo] =@SOAssignedDriverIDNo
,[SOAreaGPS] =@SOAreaGPS
,[SOStartTime] =@SOStartTime
,[SOEndTime] =@SOEndTime
,[SOCustomerNo] =@SOCustomerNo


WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterPlan1_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

               .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SoDate", sql.DateTime, req.body.SoDate)
        .input("SOAreaAssigned", sql.VarChar, req.body.SOAreaAssigned)
        .input("SORouteNo", sql.VarChar, req.body.SORouteNo)
        .input("SOShipTo", sql.VarChar, req.body.SOShipTo)
        .input("SOBillTo", sql.VarChar, req.body.SOBillTo)
        .input("SOStage", sql.VarChar, req.body.SOStage)
        .input("SOAssignedVanIDNo", sql.VarChar, req.body.SOAssignedVanIDNo)
        .input("SOAssignedDriverIDNo", sql.VarChar, req.body.SOAssignedDriverIDNo)
        .input("SOAreaGPS", sql.VarChar, req.body.SOAreaGPS)
        .input("SOStartTime", sql.DateTime, req.body.SOStartTime)
        .input("SOEndTime", sql.DateTime, req.body.SOEndTime)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .query(
          ` 
          UPDATE [dbo].[tblRouteMasterPlan1]
SET


[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SoDate] =@SoDate
,[SOAreaAssigned] =@SOAreaAssigned
,[SORouteNo] =@SORouteNo
,[SOShipTo] =@SOShipTo
,[SOBillTo] =@SOBillTo
,[SOStage] =@SOStage
,[SOAssignedVanIDNo] =@SOAssignedVanIDNo
,[SOAssignedDriverIDNo] =@SOAssignedDriverIDNo
,[SOAreaGPS] =@SOAreaGPS
,[SOStartTime] =@SOStartTime
,[SOEndTime] =@SOEndTime
,[SOCustomerNo] =@SOCustomerNo


WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async RouteMasterPlanDownloaded_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

         .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SoDate", sql.DateTime, req.body.SoDate)
        .input("SOAreaAssigned", sql.VarChar, req.body.SOAreaAssigned)
        .input("SORouteNo", sql.VarChar, req.body.SORouteNo)
        .input("SOShipTo", sql.VarChar, req.body.SOShipTo)
        .input("SOBillTo", sql.VarChar, req.body.SOBillTo)
        .input("SOStage", sql.VarChar, req.body.SOStage)
        .query(
          ` 
          UPDATE [dbo].[tblRouteMasterPlanDownloaded]
SET


[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SoDate] =@SoDate
,[SOAreaAssigned] =@SOAreaAssigned
,[SORouteNo] =@SORouteNo
,[SOShipTo] =@SOShipTo
,[SOBillTo] =@SOBillTo
,[SOStage] =@SOStage


WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesCustomers_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesCustomersID = req.params.tblSalesCustomersID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("code", sql.NVarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("addressLo", sql.NVarChar, req.body.addressLo)
        .input("addressFo", sql.NVarChar, req.body.addressFo)
        .input("isActive", sql.VarChar, req.body.isActive)
        .input("phone", sql.VarChar, req.body.phone)
        .input("phoneExt", sql.VarChar, req.body.phoneExt)
        .input("mobile", sql.NVarChar, req.body.mobile)
        .input("rem", sql.VarChar, req.body.rem)
        .input("email", sql.NVarChar, req.body.email)
        .input("customerType", sql.VarChar, req.body.customerType)
        .input("creditPeriod", sql.VarChar, req.body.creditPeriod)
        .query(
          ` 
          UPDATE [dbo].[tblSalesCustomers]
SET


[id] =@id
,[code] =@code
,[descLo] =@descLo
,[descFo] =@descFo
,[shDescLo] =@shDescLo
,[shDescFo] =@shDescFo
,[addressLo] =@addressLo
,[addressFo] =@addressFo
,[isActive] =@isActive
,[phone] =@phone
,[phoneExt] =@phoneExt
,[mobile] =@mobile
,[rem] =@rem
,[email] =@email
,[customerType] =@customerType
,[creditPeriod] =@creditPeriod


WHERE tblSalesCustomersID='${tblSalesCustomersID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesCustomersReturn_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesCustomersID = req.params.tblSalesCustomersID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("code", sql.NVarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("addressLo", sql.NVarChar, req.body.addressLo)
        .input("addressFo", sql.NVarChar, req.body.addressFo)
        .input("isActive", sql.VarChar, req.body.isActive)
        .input("phone", sql.VarChar, req.body.phone)
        .input("phoneExt", sql.VarChar, req.body.phoneExt)
        .input("mobile", sql.NVarChar, req.body.mobile)
        .input("rem", sql.VarChar, req.body.rem)
        .input("email", sql.NVarChar, req.body.email)
        .input("customerType", sql.VarChar, req.body.customerType)
        .input("creditPeriod", sql.VarChar, req.body.creditPeriod)
        .input("accountBalanceAmount", sql.Real, req.body.accountBalanceAmount)
        .query(
          ` 
          UPDATE [dbo].[tblSalesCustomersReturn]
SET


[id] =@id
,[code] =@code
,[descLo] =@descLo
,[descFo] =@descFo
,[shDescLo] =@shDescLo
,[shDescFo] =@shDescFo
,[addressLo] =@addressLo
,[addressFo] =@addressFo
,[isActive] =@isActive
,[phone] =@phone
,[phoneExt] =@phoneExt
,[mobile] =@mobile
,[rem] =@rem
,[email] =@email
,[customerType] =@customerType
,[creditPeriod] =@creditPeriod
,[accountBalanceAmount] =@accountBalanceAmount


WHERE tblSalesCustomersID='${tblSalesCustomersID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesInvoiceDets_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
        .input("lineId", sql.VarChar, req.body.lineId)
        .input("seq", sql.VarChar, req.body.seq)
        .input("source", sql.VarChar, req.body.source)
        .input("entryLevel", sql.VarChar, req.body.entryLevel)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("roiId", sql.VarChar, req.body.roiId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemScn", sql.VarChar, req.body.itemScn)

        .input("qty", sql.Numeric, req.body.qty)
        .input("freeQtyManual", sql.VarChar, req.body.freeQtyManual)
        .input("imuId", sql.VarChar, req.body.imuId)
        .input("baseImuId", sql.VarChar, req.body.baseImuId)
        .input("baseUomQty", sql.VarChar, req.body.baseUomQty)
        .input("unitPriceAlc", sql.Real, req.body.unitPriceAlc)
        .input("unitPriceAfc", sql.Real, req.body.unitPriceAfc)
        .input("totPriceAlc", sql.Real, req.body.totPriceAlc)
        .input("totPriceAfc", sql.Real, req.body.totPriceAfc)
        .input("priceListUnitPriceAlc", sql.Real, req.body.priceListUnitPriceAlc)
        .input("priceListUnitPriceAfc", sql.Real, req.body.priceListUnitPriceAfc)
        .input("priceSource", sql.VarChar, req.body.priceSource)
        .input("discountType", sql.VarChar, req.body.discountType)
        .input("discountPerc", sql.VarChar, req.body.discountPerc)
        .input("itemAddonsAlc", sql.VarChar, req.body.itemAddonsAlc)
        .input("itemAddonsAfc", sql.VarChar, req.body.itemAddonsAfc)
        .input("itemNetPriceAlc", sql.Real, req.body.itemNetPriceAlc)

        .input("itemNetPriceAfc", sql.Real, req.body.itemNetPriceAfc)
        .input("warantyPeriod", sql.VarChar, req.body.warantyPeriod)
        .input("warantyPeriodUom", sql.VarChar, req.body.warantyPeriodUom)
        .input("lineStatus", sql.NVarChar, req.body.lineStatus)
        .input("itemsDiscAlc", sql.Real, req.body.itemsDiscAlc)
        .input("itemsDiscAfc", sql.Real, req.body.itemsDiscAfc)
        .input("actualCostAlc", sql.Real, req.body.actualCostAlc)
        .input("actualCostAfc", sql.Real, req.body.actualCostAfc)
        .input("balanceQty", sql.Numeric, req.body.balanceQty)
        .input("longDesc", sql.NVarChar, req.body.longDesc)
        .input("taxAlc", sql.Numeric, req.body.taxAlc)
        .input("taxAfc", sql.Numeric, req.body.taxAfc)
        .input("maxDiscPer", sql.Numeric, req.body.maxDiscPer)
        .input("allowedDiscPerc", sql.VarChar, req.body.allowedDiscPerc)
        .input("allowedDiscAlc", sql.VarChar, req.body.allowedDiscAlc)
        .input("allowedDiscAfc", sql.VarChar, req.body.allowedDiscAfc)
        .query(
          ` 
          UPDATE [dbo].[tblSalesInvoiceDets]
SET


[id] =@id
,[fogId] =@fogId
,[melId] =@melId
,[floId] =@floId
,[code] =@code
,[refCode] =@refCode
,[dateDgr] =@dateDgr
,[dateDhi] =@dateDhi
,[globalStatus] =@globalStatus
,[type] =@type
,[header] =@header
,[targetMelId] =@targetMelId
,[targetTrxHeaderId] =@targetTrxHeaderId
,[targetTrxCode] =@targetTrxCode
,[maeId] =@maeId
,[mcaId] =@mcaId
,[partType] =@partType

,[gprId] =@gprId
,[siteId] =@siteId
,[contactId] =@contactId
,[billToFreeText] =@billToFreeText
,[PaymentTerms] =@PaymentTerms
,[creditPeriodDays] =@creditPeriodDays
,[crrId] =@crrId
,[fcuId] =@fcuId
,[exchngRate] =@exchngRate
,[itemsTotalAlc] =@itemsTotalAlc
,[addonsTotalAlc] =@addonsTotalAlc
,[addonsTotalAfc] =@addonsTotalAfc
,[totalDiscountsAlc] =@totalDiscountsAlc
,[totalDiscountsAfc] =@totalDiscountsAfc
,[netPriceAlc] =@netPriceAlc
,[netPriceAfc] =@netPriceAfc
,[currApproxAlc] =@currApproxAlc

,[proposedAmountAlc] =@proposedAmountAlc
,[proposedamountAfc] =@proposedamountAfc
,[rem] =@rem
,[ertId] =@ertId
,[shipToFreeText] =@shipToFreeText
,[isOnAccount] =@isOnAccount
,[taxExemptionPerc] =@taxExemptionPerc
,[lines] =@lines
,[lineId] =@lineId
,[seq] =@seq
,[source] =@source
,[entryLevel] =@entryLevel
,[BarCode] =@BarCode
,[roiId] =@roiId
,[itemType] =@itemType
,[itemId] =@itemId
,[itemScn] =@itemScn

,[qty] =@qty
,[freeQtyManual] =@freeQtyManual
,[imuId] =@imuId
,[baseImuId] =@baseImuId
,[baseUomQty] =@baseUomQty
,[unitPriceAlc] =@unitPriceAlc
,[unitPriceAfc] =@unitPriceAfc
,[totPriceAlc] =@totPriceAlc
,[totPriceAfc] =@totPriceAfc
,[priceListUnitPriceAlc] =@priceListUnitPriceAlc
,[priceListUnitPriceAfc] =@priceListUnitPriceAfc
,[priceSource] =@priceSource
,[discountType] =@discountType
,[discountPerc] =@discountPerc
,[itemAddonsAlc] =@itemAddonsAlc
,[itemAddonsAfc] =@itemAddonsAfc
,[itemNetPriceAlc] =@itemNetPriceAlc

,[itemNetPriceAfc] =@itemNetPriceAfc
,[warantyPeriod] =@warantyPeriod
,[warantyPeriodUom] =@warantyPeriodUom
,[lineStatus] =@lineStatus
,[itemsDiscAlc] =@itemsDiscAlc
,[itemsDiscAfc] =@itemsDiscAfc
,[actualCostAlc] =@actualCostAlc
,[actualCostAfc] =@actualCostAfc
,[balanceQty] =@balanceQty
,[longDesc] =@longDesc
,[taxAlc] =@taxAlc
,[taxAfc] =@taxAfc
,[maxDiscPer] =@maxDiscPer
,[allowedDiscPerc] =@allowedDiscPerc
,[allowedDiscAlc] =@allowedDiscAlc
,[allowedDiscAfc] =@allowedDiscAfc



WHERE tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesInvoiceM_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesInvoiceM]
SET


[id] =@id
,[fogId] =@fogId
,[melId] =@melId
,[floId] =@floId
,[code] =@code
,[refCode] =@refCode
,[dateDgr] =@dateDgr
,[dateDhi] =@dateDhi
,[globalStatus] =@globalStatus
,[type] =@type
,[header] =@header
,[targetMelId] =@targetMelId
,[targetTrxHeaderId] =@targetTrxHeaderId
,[targetTrxCode] =@targetTrxCode
,[maeId] =@maeId
,[mcaId] =@mcaId
,[partType] =@partType

,[gprId] =@gprId
,[siteId] =@siteId
,[contactId] =@contactId
,[billToFreeText] =@billToFreeText
,[PaymentTerms] =@PaymentTerms
,[creditPeriodDays] =@creditPeriodDays
,[crrId] =@crrId
,[fcuId] =@fcuId
,[exchngRate] =@exchngRate
,[itemsTotalAlc] =@itemsTotalAlc
,[addonsTotalAlc] =@addonsTotalAlc
,[addonsTotalAfc] =@addonsTotalAfc
,[totalDiscountsAlc] =@totalDiscountsAlc
,[totalDiscountsAfc] =@totalDiscountsAfc
,[netPriceAlc] =@netPriceAlc
,[netPriceAfc] =@netPriceAfc
,[currApproxAlc] =@currApproxAlc

,[proposedAmountAlc] =@proposedAmountAlc
,[proposedamountAfc] =@proposedamountAfc
,[rem] =@rem
,[ertId] =@ertId
,[shipToFreeText] =@shipToFreeText
,[isOnAccount] =@isOnAccount
,[taxExemptionPerc] =@taxExemptionPerc
,[lines] =@lines




WHERE tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesInvoiceMList_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesInvoiceMListID = req.params.tblSalesInvoiceMListID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("code", sql.NVarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("addressLo", sql.NVarChar, req.body.addressLo)
        .input("addressFo", sql.NVarChar, req.body.addressFo)
        .input("isActive", sql.VarChar, req.body.isActive)
        .input("phone", sql.VarChar, req.body.phone)
        .input("phoneExt", sql.VarChar, req.body.phoneExt)
        .input("mobile", sql.NVarChar, req.body.mobile)
        .input("rem", sql.VarChar, req.body.rem)
        .input("email", sql.NVarChar, req.body.email)
        .input("customerType", sql.VarChar, req.body.customerType)
        .input("creditPeriod", sql.VarChar, req.body.creditPeriod)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesInvoiceMList]
SET


[id] =@id
,[code] =@code
,[descLo] =@descLo
,[descFo] =@descFo
,[shDescLo] =@shDescLo
,[shDescFo] =@shDescFo
,[addressLo] =@addressLo
,[addressFo] =@addressFo
,[isActive] =@isActive
,[phone] =@phone
,[phoneExt] =@phoneExt
,[mobile] =@mobile
,[rem] =@rem
,[email] =@email
,[customerType] =@customerType
,[creditPeriod] =@creditPeriod



WHERE tblSalesInvoiceMListID='${tblSalesInvoiceMListID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedDetsView_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
        .input("lineId", sql.VarChar, req.body.lineId)
        .input("seq", sql.VarChar, req.body.seq)
        .input("source", sql.VarChar, req.body.source)
        .input("entryLevel", sql.VarChar, req.body.entryLevel)
        .input("BarCode", sql.VarChar, req.body.BarCode)
        .input("roiId", sql.VarChar, req.body.roiId)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("itemId", sql.VarChar, req.body.itemId)
        .input("itemScn", sql.VarChar, req.body.itemScn)

        .input("qty", sql.Numeric, req.body.qty)
        .input("freeQtyManual", sql.VarChar, req.body.freeQtyManual)
        .input("imuId", sql.VarChar, req.body.imuId)
        .input("baseImuId", sql.VarChar, req.body.baseImuId)
        .input("baseUomQty", sql.VarChar, req.body.baseUomQty)
        .input("unitPriceAlc", sql.Real, req.body.unitPriceAlc)
        .input("unitPriceAfc", sql.Real, req.body.unitPriceAfc)
        .input("totPriceAlc", sql.Real, req.body.totPriceAlc)
        .input("totPriceAfc", sql.Real, req.body.totPriceAfc)
        .input("priceListUnitPriceAlc", sql.Real, req.body.priceListUnitPriceAlc)
        .input("priceListUnitPriceAfc", sql.Real, req.body.priceListUnitPriceAfc)
        .input("priceSource", sql.VarChar, req.body.priceSource)
        .input("discountType", sql.VarChar, req.body.discountType)
        .input("discountPerc", sql.VarChar, req.body.discountPerc)
        .input("itemAddonsAlc", sql.VarChar, req.body.itemAddonsAlc)
        .input("itemAddonsAfc", sql.VarChar, req.body.itemAddonsAfc)
        .input("itemNetPriceAlc", sql.Real, req.body.itemNetPriceAlc)

        .input("itemNetPriceAfc", sql.Real, req.body.itemNetPriceAfc)
        .input("warantyPeriod", sql.VarChar, req.body.warantyPeriod)
        .input("warantyPeriodUom", sql.VarChar, req.body.warantyPeriodUom)
        .input("lineStatus", sql.NVarChar, req.body.lineStatus)
        .input("itemsDiscAlc", sql.Real, req.body.itemsDiscAlc)
        .input("itemsDiscAfc", sql.Real, req.body.itemsDiscAfc)
        .input("actualCostAlc", sql.Real, req.body.actualCostAlc)
        .input("actualCostAfc", sql.Real, req.body.actualCostAfc)
        .input("balanceQty", sql.Numeric, req.body.balanceQty)
        .input("longDesc", sql.NVarChar, req.body.longDesc)
        .input("taxAlc", sql.Numeric, req.body.taxAlc)
        .input("taxAfc", sql.Numeric, req.body.taxAfc)
        .input("maxDiscPer", sql.Numeric, req.body.maxDiscPer)
        .input("allowedDiscPerc", sql.VarChar, req.body.allowedDiscPerc)
        .input("allowedDiscAlc", sql.VarChar, req.body.allowedDiscAlc)
        .input("allowedDiscAfc", sql.VarChar, req.body.allowedDiscAfc)
        .query(
          ` 
          UPDATE [dbo].[tblSalesManConfirmedDetsView]
SET


[id] =@id
,[fogId] =@fogId
,[melId] =@melId
,[floId] =@floId
,[code] =@code
,[refCode] =@refCode
,[dateDgr] =@dateDgr
,[dateDhi] =@dateDhi
,[globalStatus] =@globalStatus
,[type] =@type
,[header] =@header
,[targetMelId] =@targetMelId
,[targetTrxHeaderId] =@targetTrxHeaderId
,[targetTrxCode] =@targetTrxCode
,[maeId] =@maeId
,[mcaId] =@mcaId
,[partType] =@partType

,[gprId] =@gprId
,[siteId] =@siteId
,[contactId] =@contactId
,[billToFreeText] =@billToFreeText
,[PaymentTerms] =@PaymentTerms
,[creditPeriodDays] =@creditPeriodDays
,[crrId] =@crrId
,[fcuId] =@fcuId
,[exchngRate] =@exchngRate
,[itemsTotalAlc] =@itemsTotalAlc
,[addonsTotalAlc] =@addonsTotalAlc
,[addonsTotalAfc] =@addonsTotalAfc
,[totalDiscountsAlc] =@totalDiscountsAlc
,[totalDiscountsAfc] =@totalDiscountsAfc
,[netPriceAlc] =@netPriceAlc
,[netPriceAfc] =@netPriceAfc
,[currApproxAlc] =@currApproxAlc

,[proposedAmountAlc] =@proposedAmountAlc
,[proposedamountAfc] =@proposedamountAfc
,[rem] =@rem
,[ertId] =@ertId
,[shipToFreeText] =@shipToFreeText
,[isOnAccount] =@isOnAccount
,[taxExemptionPerc] =@taxExemptionPerc
,[lines] =@lines
,[lineId] =@lineId
,[seq] =@seq
,[source] =@source
,[entryLevel] =@entryLevel
,[BarCode] =@BarCode
,[roiId] =@roiId
,[itemType] =@itemType
,[itemId] =@itemId
,[itemScn] =@itemScn

,[qty] =@qty
,[freeQtyManual] =@freeQtyManual
,[imuId] =@imuId
,[baseImuId] =@baseImuId
,[baseUomQty] =@baseUomQty
,[unitPriceAlc] =@unitPriceAlc
,[unitPriceAfc] =@unitPriceAfc
,[totPriceAlc] =@totPriceAlc
,[totPriceAfc] =@totPriceAfc
,[priceListUnitPriceAlc] =@priceListUnitPriceAlc
,[priceListUnitPriceAfc] =@priceListUnitPriceAfc
,[priceSource] =@priceSource
,[discountType] =@discountType
,[discountPerc] =@discountPerc
,[itemAddonsAlc] =@itemAddonsAlc
,[itemAddonsAfc] =@itemAddonsAfc
,[itemNetPriceAlc] =@itemNetPriceAlc

,[itemNetPriceAfc] =@itemNetPriceAfc
,[warantyPeriod] =@warantyPeriod
,[warantyPeriodUom] =@warantyPeriodUom
,[lineStatus] =@lineStatus
,[itemsDiscAlc] =@itemsDiscAlc
,[itemsDiscAfc] =@itemsDiscAfc
,[actualCostAlc] =@actualCostAlc
,[actualCostAfc] =@actualCostAfc
,[balanceQty] =@balanceQty
,[longDesc] =@longDesc
,[taxAlc] =@taxAlc
,[taxAfc] =@taxAfc
,[maxDiscPer] =@maxDiscPer
,[allowedDiscPerc] =@allowedDiscPerc
,[allowedDiscAlc] =@allowedDiscAlc
,[allowedDiscAfc] =@allowedDiscAfc



WHERE tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedOrderDets_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesManConfirmedOrderDets]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount
WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedOrderDetsSelected_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesManConfirmedOrderDetsSelected]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount
WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedOrdersM_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesManConfirmedOrdersM]
SET

[SORefCodeNo] =@SORefCodeNo
,[BillTo] =@BillTo
,[ShipTo] =@ShipTo
,[PaymentTerms] =@PaymentTerms
,[MobileNo] =@MobileNo
,[ShiperGLNNo] =@ShiperGLNNo
,[RPDocNo] =@RPDocNo
,[SOStatus] =@SOStatus
,[SODateTimeCreated] =@SODateTimeCreated
,[SOSalesManIdNo] =@SOSalesManIdNo
,[SOTotalAmountNoVat] =@SOTotalAmountNoVat
,[SOTotalAmountWVat] =@SOTotalAmountWVat
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalItemFreeQty] =@SOTotalItemFreeQty
,[SOTotalItemFreeAmount] =@SOTotalItemFreeAmount

,[creditPeriodDays] =@creditPeriodDays
,[grpID] =@grpID
,[dateDgr] =@dateDgr
,[param1] =@param1
,[param2] =@param2
WHERE tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesManConfirmedOrdersMSelected_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesManConfirmedOrdersMSelected]
SET

[SORefCodeNo] =@SORefCodeNo
,[BillTo] =@BillTo
,[ShipTo] =@ShipTo
,[PaymentTerms] =@PaymentTerms
,[MobileNo] =@MobileNo
,[ShiperGLNNo] =@ShiperGLNNo
,[RPDocNo] =@RPDocNo
,[SOStatus] =@SOStatus
,[SODateTimeCreated] =@SODateTimeCreated
,[SOSalesManIdNo] =@SOSalesManIdNo
,[SOTotalAmountNoVat] =@SOTotalAmountNoVat
,[SOTotalAmountWVat] =@SOTotalAmountWVat
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalItemFreeQty] =@SOTotalItemFreeQty
,[SOTotalItemFreeAmount] =@SOTotalItemFreeAmount

,[creditPeriodDays] =@creditPeriodDays
,[grpID] =@grpID
,[dateDgr] =@dateDgr
,[param1] =@param1
,[param2] =@param2
WHERE tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrder_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

       
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrder]
SET

[SORefCodeNo] =@SORefCodeNo
,[BillTo] =@BillTo
,[ShipTo] =@ShipTo
,[PaymentTerms] =@PaymentTerms
,[MobileNo] =@MobileNo
,[ShiperGLNNo] =@ShiperGLNNo
,[RPDocNo] =@RPDocNo
,[SOStatus] =@SOStatus
,[SODateTimeCreated] =@SODateTimeCreated
,[SOSalesManIdNo] =@SOSalesManIdNo
,[SOTotalAmountNoVat] =@SOTotalAmountNoVat
,[SOTotalAmountWVat] =@SOTotalAmountWVat
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalItemFreeQty] =@SOTotalItemFreeQty
,[SOTotalItemFreeAmount] =@SOTotalItemFreeAmount


WHERE tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDets_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
       .input("SORemarks", sql.VarChar, req.body.SORemarks)
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDets]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount
,[SORemarks] =@SORemarks
WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsM_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
       .input("SORemarks", sql.VarChar, req.body.SORemarks)
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsM]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount
,[SORemarks] =@SORemarks
WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrint_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
         .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrint]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintCollection_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("CustomerSignature", sql.VarChar, req.body.CustomerSignature)
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintCollection]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName
,[CustomerSignature] =@CustomerSignature

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintCollectionR_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("CustomerSignature", sql.VarChar, req.body.CustomerSignature)
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintCollectionR]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName
,[CustomerSignature] =@CustomerSignature

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintDN_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintDN]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName


WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintDSI_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintDSI]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName
,[SOVatNumber] =@SOVatNumber

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintR_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintR]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName
,[SOVatNumber] =@SOVatNumber

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintRSReturn_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintRSReturn]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName
,[SOVatNumber] =@SOVatNumber

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsMPrintRSReturnInvoice_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SOSalesmanName", sql.VarChar, req.body.SOSalesmanName)
        .input("SOLineRemarks", sql.VarChar, req.body.SOLineRemarks)
        .input("SOPaymentType", sql.VarChar, req.body.SOPaymentType)
        .input("SOCustomerName", sql.VarChar, req.body.SOCustomerName)
        .input("SOVatNumber", sql.VarChar, req.body.SOVatNumber)
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsMPrintRSReturnInvoice]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SOSalesmanName] =@SOSalesmanName
,[SOLineRemarks] =@SOLineRemarks
,[SOPaymentType] =@SOPaymentType
,[SOCustomerName] =@SOCustomerName
,[SOVatNumber] =@SOVatNumber

WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsViewInvoiceLine_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("SOItemCode", sql.VarChar, req.body.SOItemCode)
        .input("SOItemDescription", sql.NVarChar, req.body.SOItemDescription)
        .input("SOOrderQty", sql.Numeric, req.body.SOOrderQty)
        .input("SOItemUnit", sql.VarChar, req.body.SOItemUnit)
        .input("SOItemPrice", sql.Float, req.body.SOItemPrice)
        .input("SOCustomerNo", sql.VarChar, req.body.SOCustomerNo)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("SOItemFreeQty", sql.Numeric, req.body.SOItemFreeQty)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SORemarks", sql.VarChar, req.body.SORemarks)
       
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsViewInvoiceLine]
SET

[RPDocNo] =@RPDocNo
,[DateTimeCreated] =@DateTimeCreated
,[SORefCodeNo] =@SORefCodeNo
,[SOItemCode] =@SOItemCode
,[SOItemDescription] =@SOItemDescription
,[SOOrderQty] =@SOOrderQty
,[SOItemUnit] =@SOItemUnit
,[SOItemPrice] =@SOItemPrice
,[SOCustomerNo] =@SOCustomerNo
,[SOAlreadySelected] =@SOAlreadySelected
,[SOItemFreeQty] =@SOItemFreeQty
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SORemarks] =@SORemarks


WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderDetsViewInvoiceLine1_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("dateDgr", sql.DateTime, req.body.dateDgr)
        .input("RefCode", sql.VarChar, req.body.RefCode)
        .input("Barcode", sql.VarChar, req.body.Barcode)
        .input("longDesc", sql.NVarChar, req.body.longDesc)
        .input("qty", sql.Numeric, req.body.qty)
        .input("itemType", sql.VarChar, req.body.itemType)
        .input("unitPriceAlc", sql.Float, req.body.unitPriceAlc)
        .input("gprId", sql.VarChar, req.body.gprId)
        .input("SOAlreadySelected", sql.TinyInt, req.body.SOAlreadySelected)
        .input("freeQtyManual", sql.Numeric, req.body.freeQtyManual)
        .input("SOTotalAmountPrice", sql.Real, req.body.SOTotalAmountPrice)
        .input("SOTotalAmountNetPrice", sql.Real, req.body.SOTotalAmountNetPrice)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalDiscountAmount", sql.Real, req.body.SOTotalDiscountAmount)
        

        .input("SORemarks", sql.VarChar, req.body.SORemarks)
       
        
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderDetsViewInvoiceLine1]
SET

[RPDocNo] =@RPDocNo
,[dateDgr] =@dateDgr
,[RefCode] =@RefCode
,[Barcode] =@Barcode
,[longDesc] =@longDesc
,[qty] =@qty
,[itemType] =@itemType
,[unitPriceAlc] =@unitPriceAlc
,[gprId] =@gprId
,[SOAlreadySelected] =@SOAlreadySelected
,[freeQtyManual] =@freeQtyManual
,[SOTotalAmountPrice] =@SOTotalAmountPrice
,[SOTotalAmountNetPrice] =@SOTotalAmountNetPrice
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalDiscountAmount] =@SOTotalDiscountAmount

,[SORemarks] =@SORemarks


WHERE tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderfromERPM_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .input("id", sql.VarChar, req.body.id)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("melId", sql.VarChar, req.body.melId)
        .input("floId", sql.VarChar, req.body.floId)
        .input("code", sql.NVarChar, req.body.code)
        .input("refCode", sql.VarChar, req.body.refCode)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("dateDhi", sql.VarChar, req.body.dateDhi)
        .input("globalStatus", sql.VarChar, req.body.globalStatus)
        .input("type", sql.VarChar, req.body.type)
        .input("header", sql.NVarChar, req.body.header)
        .input("targetMelId", sql.VarChar, req.body.targetMelId)
        .input("targetTrxHeaderId", sql.VarChar, req.body.targetTrxHeaderId)
        .input("targetTrxCode", sql.VarChar, req.body.targetTrxCode)
        .input("maeId", sql.VarChar, req.body.maeId)
        .input("mcaId", sql.VarChar, req.body.mcaId)
        .input("partType", sql.VarChar, req.body.partType)

        .input("gprId", sql.VarChar, req.body.gprId)
        .input("siteId", sql.VarChar, req.body.siteId)
        .input("contactId", sql.VarChar, req.body.contactId)
        .input("billToFreeText", sql.VarChar, req.body.billToFreeText)
        .input("PaymentTerms", sql.VarChar, req.body.PaymentTerms)
        .input("creditPeriodDays", sql.VarChar, req.body.creditPeriodDays)
        .input("crrId", sql.VarChar, req.body.crrId)
        .input("fcuId", sql.VarChar, req.body.fcuId)
        .input("exchngRate", sql.VarChar, req.body.exchngRate)
        .input("itemsTotalAlc", sql.VarChar, req.body.itemsTotalAlc)
        .input("addonsTotalAlc", sql.VarChar, req.body.addonsTotalAlc)
        .input("addonsTotalAfc", sql.VarChar, req.body.addonsTotalAfc)
        .input("totalDiscountsAlc", sql.VarChar, req.body.totalDiscountsAlc)
        .input("totalDiscountsAfc", sql.VarChar, req.body.totalDiscountsAfc)
        .input("netPriceAlc", sql.VarChar, req.body.netPriceAlc)
        .input("netPriceAfc", sql.VarChar, req.body.netPriceAfc)
        .input("currApproxAlc", sql.VarChar, req.body.currApproxAlc)

        .input("proposedAmountAlc", sql.VarChar, req.body.proposedAmountAlc)
        .input("proposedamountAfc", sql.VarChar, req.body.proposedamountAfc)
        .input("rem", sql.VarChar, req.body.rem)
        .input("ertId", sql.VarChar, req.body.ertId)
        .input("shipToFreeText", sql.VarChar, req.body.shipToFreeText)
        .input("isOnAccount", sql.VarChar, req.body.isOnAccount)
        .input("taxExemptionPerc", sql.VarChar, req.body.taxExemptionPerc)
        .input("lines", sql.VarChar, req.body.lines)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderfromERPM]
SET


[id] =@id
,[fogId] =@fogId
,[melId] =@melId
,[floId] =@floId
,[code] =@code
,[refCode] =@refCode
,[dateDgr] =@dateDgr
,[dateDhi] =@dateDhi
,[globalStatus] =@globalStatus
,[type] =@type
,[header] =@header
,[targetMelId] =@targetMelId
,[targetTrxHeaderId] =@targetTrxHeaderId
,[targetTrxCode] =@targetTrxCode
,[maeId] =@maeId
,[mcaId] =@mcaId
,[partType] =@partType

,[gprId] =@gprId
,[siteId] =@siteId
,[contactId] =@contactId
,[billToFreeText] =@billToFreeText
,[PaymentTerms] =@PaymentTerms
,[creditPeriodDays] =@creditPeriodDays
,[crrId] =@crrId
,[fcuId] =@fcuId
,[exchngRate] =@exchngRate
,[itemsTotalAlc] =@itemsTotalAlc
,[addonsTotalAlc] =@addonsTotalAlc
,[addonsTotalAfc] =@addonsTotalAfc
,[totalDiscountsAlc] =@totalDiscountsAlc
,[totalDiscountsAfc] =@totalDiscountsAfc
,[netPriceAlc] =@netPriceAlc
,[netPriceAfc] =@netPriceAfc
,[currApproxAlc] =@currApproxAlc

,[proposedAmountAlc] =@proposedAmountAlc
,[proposedamountAfc] =@proposedamountAfc
,[rem] =@rem
,[ertId] =@ertId
,[shipToFreeText] =@shipToFreeText
,[isOnAccount] =@isOnAccount
,[taxExemptionPerc] =@taxExemptionPerc
,[lines] =@lines




WHERE tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderM_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
       
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderM]
SET

[SORefCodeNo] =@SORefCodeNo
,[BillTo] =@BillTo
,[ShipTo] =@ShipTo
,[PaymentTerms] =@PaymentTerms
,[MobileNo] =@MobileNo
,[ShiperGLNNo] =@ShiperGLNNo
,[RPDocNo] =@RPDocNo
,[SOStatus] =@SOStatus
,[SODateTimeCreated] =@SODateTimeCreated
,[SOSalesManIdNo] =@SOSalesManIdNo
,[SOTotalAmountNoVat] =@SOTotalAmountNoVat
,[SOTotalAmountWVat] =@SOTotalAmountWVat
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalItemFreeQty] =@SOTotalItemFreeQty
,[SOTotalItemFreeAmount] =@SOTotalItemFreeAmount

,[creditPeriodDays] =@creditPeriodDays
,[grpID] =@grpID
,[dateDgr] =@dateDgr
,[param1] =@param1
,[param2] =@param2
WHERE tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SalesOrderMPosted_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .input("SORefCodeNo", sql.VarChar, req.body.SORefCodeNo)
        .input("BillTo", sql.NVarChar, req.body.BillTo)
        .input("ShipTo", sql.NVarChar, req.body.ShipTo)
        .input("PaymentTerms", sql.NVarChar, req.body.PaymentTerms)
        .input("MobileNo", sql.VarChar, req.body.MobileNo)
        .input("ShiperGLNNo", sql.VarChar, req.body.ShiperGLNNo)
        .input("RPDocNo", sql.VarChar, req.body.RPDocNo)
        .input("SOStatus", sql.TinyInt, req.body.SOStatus)
        .input("SODateTimeCreated", sql.DateTime, req.body.SODateTimeCreated)
        .input("SOSalesManIdNo", sql.VarChar, req.body.SOSalesManIdNo)
        .input("SOTotalAmountNoVat", sql.Real, req.body.SOTotalAmountNoVat)
        .input("SOTotalAmountWVat", sql.Real, req.body.SOTotalAmountWVat)
        .input("SOTotalVatAmount", sql.Real, req.body.SOTotalVatAmount)
        .input("SOTotalItemFreeQty", sql.Numeric, req.body.SOTotalItemFreeQty)
        .input("SOTotalItemFreeAmount", sql.Real, req.body.SOTotalItemFreeAmount)

        .input("creditPeriodDays", sql.Numeric, req.body.creditPeriodDays)
        .input("grpID", sql.VarChar, req.body.grpID)
        .input("dateDgr", sql.VarChar, req.body.dateDgr)
        .input("param1", sql.VarChar, req.body.param1)
        .input("param2", sql.VarChar, req.body.param2)
       .input("SORemarks", sql.VarChar, req.body.SORemarks)
        .query(
          ` 
          UPDATE [dbo].[tblSalesOrderMPosted]
SET

[SORefCodeNo] =@SORefCodeNo
,[BillTo] =@BillTo
,[ShipTo] =@ShipTo
,[PaymentTerms] =@PaymentTerms
,[MobileNo] =@MobileNo
,[ShiperGLNNo] =@ShiperGLNNo
,[RPDocNo] =@RPDocNo
,[SOStatus] =@SOStatus
,[SODateTimeCreated] =@SODateTimeCreated
,[SOSalesManIdNo] =@SOSalesManIdNo
,[SOTotalAmountNoVat] =@SOTotalAmountNoVat
,[SOTotalAmountWVat] =@SOTotalAmountWVat
,[SOTotalVatAmount] =@SOTotalVatAmount
,[SOTotalItemFreeQty] =@SOTotalItemFreeQty
,[SOTotalItemFreeAmount] =@SOTotalItemFreeAmount

,[creditPeriodDays] =@creditPeriodDays
,[grpID] =@grpID
,[dateDgr] =@dateDgr
,[param1] =@param1
,[param2] =@param2
,[SORemarks] =@SORemarks
WHERE tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async ShipmentGLNTracking_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .input("RequestNo", sql.Numeric, req.body.RequestNo)
        .input("DateRequested", sql.DateTime, req.body.DateRequested)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("FEName", sql.VarChar, req.body.FEName)
        .input("FECountryOrigin", sql.VarChar, req.body.FECountryOrigin)
        .input("MemberID", sql.Numeric, req.body.MemberID)
        .input("ShipmentGLNNo", sql.VarChar, req.body.ShipmentGLNNo)
        .input("ShipmentDateConfirmation", sql.DateTime, req.body.ShipmentDateConfirmation)
        .input("GPSLocation", sql.VarChar, req.body.GPSLocation)
        .input("GPSLatitude", sql.VarChar, req.body.GPSLatitude)
        .input("GPSLongitude", sql.VarChar, req.body.GPSLongitude)
        .input("ProductBarcode", sql.VarChar, req.body.ProductBarcode)
        .input("ProductDescriptionE", sql.VarChar, req.body.ProductDescriptionE)
        .query(
          ` 
          UPDATE [dbo].[tblShipmentGLNTracking]
SET

[RequestNo] =@RequestNo
,[DateRequested] =@DateRequested
,[RequestStatus] =@RequestStatus
,[FEName] =@FEName
,[FECountryOrigin] =@FECountryOrigin
,[MemberID] =@MemberID
,[ShipmentGLNNo] =@ShipmentGLNNo
,[ShipmentDateConfirmation] =@ShipmentDateConfirmation
,[GPSLocation] =@GPSLocation
,[GPSLatitude] =@GPSLatitude
,[GPSLongitude] =@GPSLongitude
,[ProductBarcode] =@ProductBarcode
,[ProductDescriptionE] =@ProductDescriptionE


WHERE tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async StockRequestVan_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.VarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("RequestStatusCode", sql.VarChar, req.body.RequestStatusCode)
        .query(
          ` 
          UPDATE [dbo].[tblStockRequestVan]
SET

[ItemCode] =@ItemCode
,[ItemDescription] =@ItemDescription
,[ItemUnit] =@ItemUnit
,[AvailableQty] =@AvailableQty
,[BinNoLocation] =@BinNoLocation
,[ItemPrice] =@ItemPrice
,[RequestStatus] =@RequestStatus
,[RequestStatusCode] =@RequestStatusCode



WHERE tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async StocksOnVan_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.VarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("RequestStatusCode", sql.VarChar, req.body.RequestStatusCode)
        .query(
          ` 
          UPDATE [dbo].[tblStocksOnVan]
SET

[ItemCode] =@ItemCode
,[ItemDescription] =@ItemDescription
,[ItemUnit] =@ItemUnit
,[AvailableQty] =@AvailableQty
,[BinNoLocation] =@BinNoLocation
,[ItemPrice] =@ItemPrice
,[RequestStatus] =@RequestStatus
,[RequestStatusCode] =@RequestStatusCode



WHERE tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async StocksOnVanPrint_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .input("ItemCode", sql.VarChar, req.body.ItemCode)
        .input("ItemDescription", sql.VarChar, req.body.ItemDescription)
        .input("ItemUnit", sql.VarChar, req.body.ItemUnit)
        .input("AvailableQty", sql.Numeric, req.body.AvailableQty)
        .input("BinNoLocation", sql.VarChar, req.body.BinNoLocation)
        .input("ItemPrice", sql.Real, req.body.ItemPrice)
        .input("RequestStatus", sql.VarChar, req.body.RequestStatus)
        .input("RequestStatusCode", sql.VarChar, req.body.RequestStatusCode)
        .query(
          ` 
          UPDATE [dbo].[tblStocksOnVanPrint]
SET

[ItemCode] =@ItemCode
,[ItemDescription] =@ItemDescription
,[ItemUnit] =@ItemUnit
,[AvailableQty] =@AvailableQty
,[BinNoLocation] =@BinNoLocation
,[ItemPrice] =@ItemPrice
,[RequestStatus] =@RequestStatus
,[RequestStatusCode] =@RequestStatusCode



WHERE tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SysNo_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const TblSysNoID = req.params.TblSysNoID;
      let data = await pool
        .request()

        .input("trxCtr", sql.Numeric, req.body.trxCtr)
        .input("RoutePlanNo", sql.Numeric, req.body.RoutePlanNo)
        .input("SalesOrderNo", sql.Numeric, req.body.SalesOrderNo)
        .input("VanAutoNumber", sql.Numeric, req.body.VanAutoNumber)
        .query(
          ` 
          UPDATE [dbo].[TblSysNo]
SET

[trxCtr] =@trxCtr
,[RoutePlanNo] =@RoutePlanNo
,[SalesOrderNo] =@SalesOrderNo
,[VanAutoNumber] =@VanAutoNumber




WHERE TblSysNoID='${TblSysNoID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async SysNoCounter_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

         .input("SalesOrderNo", sql.Numeric, req.body.SalesOrderNo)
        .input("SalesInvoiceNo", sql.Numeric, req.body.SalesInvoiceNo)
        .input("VanAutoNumber", sql.Numeric, req.body.VanAutoNumber)
        .input("trxCtr", sql.Numeric, req.body.trxCtr)
        .input("SalesReturnNo", sql.Numeric, req.body.SalesReturnNo)
        .query(
          ` 
          UPDATE [dbo].[TblSysNoCounter]
SET

[trxCtr] =@trxCtr
,[SalesInvoiceNo] =@SalesInvoiceNo
,[SalesOrderNo] =@SalesOrderNo
,[VanAutoNumber] =@VanAutoNumber
,[SalesReturnNo] =@SalesReturnNo



WHERE TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async UsersLoggedIn_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblVersionNoID = req.params.tblVersionNoID;
      let data = await pool
        .request()

         .input("jwtToken", sql.VarChar, req.body.jwtToken)
        .input("UserID", sql.VarChar, req.body.UserID)
        .input("username", sql.NVarChar, req.body.username)
        .input("loName", sql.VarChar, req.body.loName)
        .input("foName", sql.VarChar, req.body.foName)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("SignINStatus", sql.TinyInt, req.body.SignINStatus)
        .query(
          ` 
          UPDATE [dbo].[tblUsersLoggedIn]
SET

[jwtToken] =@jwtToken
,[UserID] =@UserID
,[username] =@username
,[loName] =@loName
,[foName] =@foName
,[fogId] =@fogId
,[SignINStatus] =@SignINStatus

WHERE tblVersionNoID='${tblVersionNoID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async UsersLoginSalesMan_Put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblUsersLoginSalesManID = req.params.tblUsersLoginSalesManID;
      let data = await pool
        .request()

        .input("id_one", sql.VarChar, req.body.id_one)
        .input("username", sql.NVarChar, req.body.username)
        .input("nameLo", sql.NVarChar, req.body.nameLo)
        .input("nameFo", sql.NVarChar, req.body.nameFo)
        .input("fogId", sql.VarChar, req.body.fogId)
        .input("salesman", sql.NVarChar, req.body.salesman)
        .input("id_two", sql.VarChar, req.body.id_two)
        .input("code", sql.VarChar, req.body.code)
        .input("descLo", sql.NVarChar, req.body.descLo)
        .input("descFo", sql.NVarChar, req.body.descFo)
        .input("shDescLo", sql.NVarChar, req.body.shDescLo)
        .input("shDescFo", sql.NVarChar, req.body.shDescFo)
        .input("role", sql.NVarChar, req.body.role)
        .input("eepId", sql.VarChar, req.body.eepId)
        .input("rem", sql.VarChar, req.body.rem)
        .input("categoryId", sql.VarChar, req.body.categoryId)
        
        .input("type", sql.VarChar, req.body.type)
        .input("issuePolicyId", sql.VarChar, req.body.issuePolicyId)
        .input("isVanSale", sql.VarChar, req.body.isVanSale)
        .input("flold", sql.VarChar, req.body.flold)
        .input("priceListId", sql.VarChar, req.body.priceListId)
        .input("salesPolicyId", sql.VarChar, req.body.salesPolicyId)
        .input("collectionPolicyId", sql.VarChar, req.body.collectionPolicyId)
        .input("vouchSetupId", sql.VarChar, req.body.vouchSetupId)
        .input("collectionMethodId", sql.VarChar, req.body.collectionMethodId)
        .input("targetBcdId", sql.VarChar, req.body.targetBcdId)
        .input("checkCreditLimit", sql.Real, req.body.checkCreditLimit)
        .input("openingBalanceAlc", sql.VarChar, req.body.openingBalanceAlc)
        .input("regionID", sql.VarChar, req.body.regionID)
        .input("branchFlold", sql.VarChar, req.body.branchFlold)
        .input("maxDiscountPerc", sql.VarChar, req.body.maxDiscountPerc)
        .input("en", sql.VarChar, req.body.en)
        .input("token", sql.VarChar, req.body.token)
       
        .query(
          ` 
          UPDATE [dbo].[tblUsersLoginSalesMan]
SET

[id_one] =@id_one
,[username] =@username
,[nameLo] =@nameLo
,[nameFo] =@nameFo
,[fogId] =@fogId
,[salesman] =@salesman
,[id_two] =@id_two
,[code] =@code
,[descLo] =@descLo
,[descFo] =@descFo
,[shDescLo] =@shDescLo
,[shDescFo] =@shDescFo
,[role] =@role
,[eepId] =@eepId
,[rem] =@rem
,[categoryId] =@categoryId

,[type] =@type
,[issuePolicyId] =@issuePolicyId
,[isVanSale] =@isVanSale
,[flold] =@flold
,[priceListId] =@priceListId
,[salesPolicyId] =@salesPolicyId
,[collectionPolicyId] =@collectionPolicyId
,[vouchSetupId] =@vouchSetupId
,[collectionMethodId] =@collectionMethodId
,[targetBcdId] =@targetBcdId
,[checkCreditLimit] =@checkCreditLimit
,[openingBalanceAlc] =@openingBalanceAlc
,[regionID] =@regionID
,[branchFlold] =@branchFlold
,[maxDiscountPerc] =@maxDiscountPerc
,[en] =@en
,[token] =@token

WHERE tblUsersLoginSalesManID='${tblUsersLoginSalesManID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async VanMaster_Put(req, res, next) {
    try {
    const file = req.files["Photo"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblVanMasterID = req.params.tblVanMasterID;
      let data = await pool
        .request()

         .input("VanIDNo", sql.VarChar, req.body.VanIDNo)
        .input("ModelNo", sql.VarChar, req.body.ModelNo)
        .input("VanMake", sql.VarChar, req.body.VanMake)
        .input("VanColor", sql.VarChar, req.body.VanColor)
        .input("PlateNo", sql.VarChar, req.body.PlateNo)
        .input("Photo", sql.VarChar, url)
        .input("VanInUsed", sql.TinyInt, req.body.VanInUsed)
        .input("VanSelected", sql.TinyInt, req.body.VanSelected)
        .input("VehCategory", sql.VarChar, req.body.VehCategory)
        .input("VehSize", sql.VarChar, req.body.VehSize)
        .input("VehWeight", sql.Real, req.body.VehWeight)
       
       
        .query(
          ` 
          UPDATE [dbo].[tblVanMaster]
SET

[VanIDNo] =@VanIDNo
,[ModelNo] =@ModelNo
,[VanMake] =@VanMake
,[VanColor] =@VanColor
,[PlateNo] =@PlateNo
,[Photo] =@Photo
,[VanInUsed] =@VanInUsed
,[VanSelected] =@VanSelected
,[VehCategory] =@VehCategory
,[VehSize] =@VehSize
,[VehWeight] =@VehWeight


WHERE tblVanMasterID='${tblVanMasterID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async VehiclePhotosID_put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblVehiclePhotosID = req.params.tblVehiclePhotosID;
      let data = await pool
        .request()

         .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("PlateNo", sql.VarChar, req.body.PlateNo)
        .input("TiresCondition", sql.NVarChar, req.body.TiresCondition)
        .input("ACCondition", sql.VarChar, req.body.ACCondition)
        .input("PetrolLevel", sql.VarChar, req.body.PetrolLevel)
        .input("Odometer", sql.Numeric, req.body.Odometer)
        .input("UserLoginID", sql.VarChar, req.body.UserLoginID)
        .input("VanIDNo", sql.VarChar, req.body.VanIDNo)
        .query(
          ` 
          UPDATE [dbo].[tblVehicleConditions]
SET

[DateTimeCreated] =@DateTimeCreated
,[PlateNo] =@PlateNo
,[TiresCondition] =@TiresCondition
,[ACCondition] =@ACCondition
,[PetrolLevel] =@PetrolLevel
,[Odometer] =@Odometer
,[UserLoginID] =@UserLoginID
,[VanIDNo] =@VanIDNo
WHERE tblVehiclePhotosID='${tblVehiclePhotosID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async VehiclePhotos_Put(req, res, next) {
    try {
   const file = req.files["VPhoto"];

      const url = `http://gs1ksa.org:3090/api/profile/${file[0].filename}`;
      let pool = await sql.connect(config);
      const tblVehiclePhotosID = req.params.tblVehiclePhotosID;
      let data = await pool
        .request()

         .input("DateTimeCreated", sql.DateTime, req.body.DateTimeCreated)
        .input("VPhoto", sql.VarChar, url)
        .input("VIDNo", sql.VarChar, req.body.VIDNo)
       
       
        .query(
          ` 
          UPDATE [dbo].[tblVehiclePhotos]
SET

[DateTimeCreated] =@DateTimeCreated
,[VPhoto] =@VPhoto
,[VIDNo] =@VIDNo



WHERE tblVehiclePhotosID='${tblVehiclePhotosID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async VersionNo_put(req, res, next) {
    try {
    
      let pool = await sql.connect(config);
      const tblVersionNoID = req.params.tblVersionNoID;
      let data = await pool
        .request()

         .input("TableName", sql.VarChar, req.body.TableName)
        .input("VersionNum", sql.Numeric, req.body.VersionNum)
        .query(
          ` 
          UPDATE [dbo].[tblVersionNo]
SET

[TableName] =@TableName
,[VersionNum] =@VersionNum

WHERE tblVersionNoID='${tblVersionNoID}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  //----------------------------------------------------------------------------------------------------------

  //---------------------------GET----------------------------------------------------------------------------
 
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
   async ItemBarcodesReturns_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `select * from tblItemBarcodesReturns where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
    async ItemBarcodesReturns_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblItemBarcodesReturns`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async ItemBarcodesTmp_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblItemBarcodesTmp`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async ItemBarcodesTmp_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `select * from tblItemBarcodesTmp where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
     async ItemMaster_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblItemMaster where tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async ItemMaster_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblItemMaster`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async LIMembers_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblLIMembersID = req.params.tblLIMembersID;
      let data = await pool
        .request()

        .query(
          `select * from tblLIMembers where tblLIMembersID='${tblLIMembersID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async LIMembers_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblLIMembers`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async MemberProducts_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblMemberProducts`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async MemberProducts_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const ProductID = req.params.ProductID;
      let data = await pool
        .request()

        .query(
          `select * from tblMemberProducts where ProductID='${ProductID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async Members_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const MemberID = req.params.MemberID;
      let data = await pool
        .request()

        .query(
          `select * from tblMembers where MemberID='${MemberID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
      async Members_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblMembers`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
       async PDFs_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFs`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
       async PDFs_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFs where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsRPrintInvoice_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsRPrintInvoice where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsRPrintInvoice_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsRPrintInvoice`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsRPrintInvoiceDirect_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsRPrintInvoiceDirect`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsRPrintInvoiceDirect_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsRPrintInvoiceDirect where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesCollectionPrint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsSalesCollectionPrint where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesCollectionPrint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsSalesCollectionPrint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesCollectionReprint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsSalesCollectionReprint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesCollectionReprint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsSalesCollectionReprint where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesReturnPrint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsSalesReturnPrint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesReturnPrint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsSalesReturnPrint where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesReturnReprint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsSalesReturnReprint where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSalesReturnReprint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsSalesReturnReprint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSummary_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblPDFsSummary`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async PDFsSummary_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `select * from tblPDFsSummary where tblPDFsID='${tblPDFsID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async QRCodeLogin_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblQRCodeLoginID = req.params.tblQRCodeLoginID;
      let data = await pool
        .request()

        .query(
          `select * from tblQRCodeLogin where tblQRCodeLoginID='${tblQRCodeLoginID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async QRCodeLogin_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblQRCodeLogin`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestDets_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRequestDets`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestDets_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRequestDets where tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestDetsSHP_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRequestDetsSHP where tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestDetsSHP_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRequestDetsSHP`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestMaster_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRequestMaster`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestMaster_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRequestMaster where tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestMasterSHP_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRequestMasterSHP where tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RequestMasterSHP_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRequestMasterSHP`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteDetails_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRouteDetails`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteDetails_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRouteDetails where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterData_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterDataID = req.params.tblRouteMasterDataID;
      let data = await pool
        .request()

        .query(
          `select * from tblRouteMasterData where tblRouteMasterDataID='${tblRouteMasterDataID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterData_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRouteMasterData`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterPlan_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRouteMasterPlan`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterPlan_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRouteMasterPlan where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterPlan1_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRouteMasterPlan1 where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterPlan1_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRouteMasterPlan1`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterPlanDownloaded_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblRouteMasterPlanDownloaded`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async RouteMasterPlanDownloaded_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblRouteMasterPlanDownloaded where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async SalesCustomers_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesCustomersID = req.params.tblSalesCustomersID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesCustomers where tblSalesCustomersID='${tblSalesCustomersID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesCustomers_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesCustomers`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesCustomersReturn_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesCustomersReturn`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesCustomersReturn_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesCustomersID = req.params.tblSalesCustomersID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesCustomersReturn where tblSalesCustomersID='${tblSalesCustomersID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesInvoiceDets_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesInvoiceDets where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesInvoiceDets_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesInvoiceDets`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesInvoiceM_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesInvoiceM`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesInvoiceM_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesInvoiceM where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesInvoiceMList_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMListID = req.params.tblSalesInvoiceMListID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesInvoiceMList where tblSalesInvoiceMListID='${tblSalesInvoiceMListID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesInvoiceMList_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesInvoiceMList`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedDetsView_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesManConfirmedDetsView`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedDetsView_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesManConfirmedDetsView where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrderDets_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesManConfirmedOrderDets where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrderDets_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesManConfirmedOrderDets`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrderDetsSelected_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesManConfirmedOrderDetsSelected`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrderDetsSelected_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesManConfirmedOrderDetsSelected where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrdersM_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesManConfirmedOrdersM where tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrdersM_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesManConfirmedOrdersM`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrdersMSelected_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesManConfirmedOrdersMSelected`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesManConfirmedOrdersMSelected_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesManConfirmedOrdersMSelected where tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrder_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrder where tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrder_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrder`);
      res.status(200).json(data.recordsets[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDets_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDets`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDets_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDets where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsM_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsM where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsM_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsM`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrint where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintCollection_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintCollection where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintCollection_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintCollection`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintCollectionR_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintCollectionR`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintCollectionR_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintCollectionR where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintDN_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintDN where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintDN_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintDN`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintDSI_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintDSI`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintDSI_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintDSI where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintR_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintR where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintR_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintR`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintRSReturn_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintRSReturn`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintRSReturn_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintRSReturn where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintRSReturnInvoice_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsMPrintRSReturnInvoice where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsMPrintRSReturnInvoice_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsMPrintRSReturnInvoice`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsViewInvoiceLine_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsViewInvoiceLine`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsViewInvoiceLine_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsViewInvoiceLine where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsViewInvoiceLine1_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderDetsViewInvoiceLine1 where tblRouteMasterID='${tblRouteMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderDetsViewInvoiceLine1_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderDetsViewInvoiceLine1`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderfromERPM_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderfromERPM`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderfromERPM_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderfromERPM where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderM_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderM where tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderM_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderM`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderMPosted_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblSalesOrderMPosted`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SalesOrderMPosted_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `select * from tblSalesOrderMPosted where tblSalesOrderID='${tblSalesOrderID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async ShipmentGLNTracking_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblShipmentGLNTracking where tblRequestMasterID='${tblRequestMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async ShipmentGLNTracking_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblShipmentGLNTracking`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async StockRequestVan_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblStockRequestVan`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async StockRequestVan_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblStockRequestVan where tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async StocksOnVan_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblStocksOnVan where tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async StocksOnVan_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblStocksOnVan`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async StocksOnVanPrint_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblStocksOnVanPrint`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async StocksOnVanPrint_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblStocksOnVanPrint where tblItemMasterID='${tblItemMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SysNo_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoID = req.params.TblSysNoID;
      let data = await pool
        .request()

        .query(
          `select * from TblSysNo where TblSysNoID='${TblSysNoID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SysNo_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblSysNo`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SysNoCounter_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from TblSysNoCounter`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async SysNoCounter_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `select * from TblSysNoCounter where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async UsersLoggedIn_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVersionNoID = req.params.tblVersionNoID;
      let data = await pool
        .request()

        .query(
          `select * from tblUsersLoggedIn where tblVersionNoID='${tblVersionNoID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async UsersLoggedIn_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblUsersLoggedIn`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async UsersLoginSalesMan_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblUsersLoginSalesMan`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async UsersLoginSalesMan_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblUsersLoginSalesManID = req.params.tblUsersLoginSalesManID;
      let data = await pool
        .request()

        .query(
          `select * from tblUsersLoginSalesMan where tblUsersLoginSalesManID='${tblUsersLoginSalesManID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VanMaster_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVanMasterID = req.params.tblVanMasterID;
      let data = await pool
        .request()

        .query(
          `select * from tblVanMaster where tblVanMasterID='${tblVanMasterID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VanMaster_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblVanMaster`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VehicleConditions_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblVehicleConditions`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VehicleConditions_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVehiclePhotosID = req.params.tblVehiclePhotosID;
      let data = await pool
        .request()

        .query(
          `select * from tblVehicleConditions where tblVehiclePhotosID='${tblVehiclePhotosID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VehiclePhotos_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVehiclePhotosID = req.params.tblVehiclePhotosID;
      let data = await pool
        .request()

        .query(
          `select * from tblVehiclePhotos where tblVehiclePhotosID='${tblVehiclePhotosID}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VehiclePhotos_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblVehiclePhotos`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VersionNo_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from tblVersionNo`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
 async VersionNo_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVersionNoID = req.params.tblVersionNoID;
      let data = await pool
        .request()

        .query(
          `select * from tblVersionNo where tblVersionNoID='${tblVersionNoID}'`
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
   async ItemBarcodesReturns_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `delete from tblItemBarcodesReturns where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemBarcodesTmp_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemBarcodesID = req.params.tblItemBarcodesID;
      let data = await pool
        .request()

        .query(
          `delete from tblItemBarcodesTmp where tblItemBarcodesID='${tblItemBarcodesID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ItemMaster_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblItemMaster where tblItemMasterID='${tblItemMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async LIMembers_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblLIMembersID = req.params.tblLIMembersID;
      let data = await pool
        .request()

        .query(
          `delete from tblLIMembers where tblLIMembersID='${tblLIMembersID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async MemberProducts_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const ProductID = req.params.ProductID;
      let data = await pool
        .request()

        .query(
          `delete from tblMemberProducts where ProductID='${ProductID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async Members_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const MemberID = req.params.MemberID;
      let data = await pool
        .request()

        .query(
          `delete from tblMembers where MemberID='${MemberID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFs_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFs where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsRPrintInvoice_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsRPrintInvoice where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsRPrintInvoiceDirect_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsRPrintInvoiceDirect where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsSalesCollectionPrint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsSalesCollectionPrint where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsSalesCollectionReprint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsSalesCollectionReprint where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsSalesReturnPrint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsSalesReturnPrint where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsSalesReturnReprint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsSalesReturnReprint where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async PDFsSummary_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblPDFsID = req.params.tblPDFsID;
      let data = await pool
        .request()

        .query(
          `delete from tblPDFsSummary where tblPDFsID='${tblPDFsID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async QRCodeLogin_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblQRCodeLoginID = req.params.tblQRCodeLoginID;
      let data = await pool
        .request()

        .query(
          `delete from tblQRCodeLogin where tblQRCodeLoginID='${tblQRCodeLoginID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RequestDets_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRequestDets where tblRequestMasterID='${tblRequestMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RequestDetsSHP_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRequestDetsSHP where tblRequestMasterID='${tblRequestMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RequestMaster_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRequestMaster where tblRequestMasterID='${tblRequestMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RequestMasterSHP_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRequestMasterSHP where tblRequestMasterID='${tblRequestMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RouteDetails_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRouteDetails where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RouteMasterData_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterDataID = req.params.tblRouteMasterDataID;
      let data = await pool
        .request()

        .query(
          `delete from tblRouteMasterData where tblRouteMasterDataID='${tblRouteMasterDataID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RouteMasterPlan_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRouteMasterPlan where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RouteMasterPlan1_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRouteMasterPlan1 where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async RouteMasterPlanDownloaded_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblRouteMasterPlanDownloaded where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesCustomers_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesCustomersID = req.params.tblSalesCustomersID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesCustomers where tblSalesCustomersID='${tblSalesCustomersID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesCustomersReturn_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesCustomersID = req.params.tblSalesCustomersID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesCustomersReturn where tblSalesCustomersID='${tblSalesCustomersID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesInvoiceDets_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesInvoiceDets where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesInvoiceM_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesInvoiceM where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesInvoiceMList_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMListID = req.params.tblSalesInvoiceMListID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesInvoiceMList where tblSalesInvoiceMListID='${tblSalesInvoiceMListID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesManConfirmedDetsView_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesManConfirmedDetsView where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesManConfirmedOrderDets_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesManConfirmedOrderDets where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesManConfirmedOrderDetsSelected_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesManConfirmedOrderDetsSelected where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesManConfirmedOrdersM_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesManConfirmedOrdersM where tblSalesOrderID='${tblSalesOrderID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesManConfirmedOrdersMSelected_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesManConfirmedOrdersMSelected where tblSalesOrderID='${tblSalesOrderID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrder_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrder where tblSalesOrderID='${tblSalesOrderID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDets_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDets where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsM_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsM where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrint where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintCollection_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintCollection where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintCollectionR_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintCollectionR where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintDN_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintDN where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintDSI_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintDSI where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintR_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintR where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintRSReturn_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintRSReturn where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsMPrintRSReturnInvoice_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsMPrintRSReturnInvoice where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsViewInvoiceLine_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsViewInvoiceLine where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderDetsViewInvoiceLine1_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRouteMasterID = req.params.tblRouteMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderDetsViewInvoiceLine1 where tblRouteMasterID='${tblRouteMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderfromERPM_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesInvoiceMID = req.params.tblSalesInvoiceMID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderfromERPM where tblSalesInvoiceMID='${tblSalesInvoiceMID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderM_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderM where tblSalesOrderID='${tblSalesOrderID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SalesOrderMPosted_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblSalesOrderID = req.params.tblSalesOrderID;
      let data = await pool
        .request()

        .query(
          `delete from tblSalesOrderMPosted where tblSalesOrderID='${tblSalesOrderID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async ShipmentGLNTracking_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblRequestMasterID = req.params.tblRequestMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblShipmentGLNTracking where tblRequestMasterID='${tblRequestMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async StockRequestVan_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblStockRequestVan where tblItemMasterID='${tblItemMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async StocksOnVan_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblStocksOnVan where tblItemMasterID='${tblItemMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async StocksOnVanPrint_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblItemMasterID = req.params.tblItemMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblStocksOnVanPrint where tblItemMasterID='${tblItemMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SysNo_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoID = req.params.TblSysNoID;
      let data = await pool
        .request()

        .query(
          `delete from TblSysNo where TblSysNoID='${TblSysNoID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async SysNoCounter_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const TblSysNoCounterID = req.params.TblSysNoCounterID;
      let data = await pool
        .request()

        .query(
          `delete from TblSysNoCounter where TblSysNoCounterID='${TblSysNoCounterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async UsersLoggedIn_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVersionNoID = req.params.tblVersionNoID;
      let data = await pool
        .request()

        .query(
          `delete from tblUsersLoggedIn where tblVersionNoID='${tblVersionNoID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async UsersLoginSalesMan_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblUsersLoginSalesManID = req.params.tblUsersLoginSalesManID;
      let data = await pool
        .request()

        .query(
          `delete from tblUsersLoginSalesMan where tblUsersLoginSalesManID='${tblUsersLoginSalesManID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async VanMaster_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVanMasterID = req.params.tblVanMasterID;
      let data = await pool
        .request()

        .query(
          `delete from tblVanMaster where tblVanMasterID='${tblVanMasterID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async VehicleConditions_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVehiclePhotosID = req.params.tblVehiclePhotosID;
      let data = await pool
        .request()

        .query(
          `delete from tblVehicleConditions where tblVehiclePhotosID='${tblVehiclePhotosID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async VehiclePhotos_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVehiclePhotosID = req.params.tblVehiclePhotosID;
      let data = await pool
        .request()

        .query(
          `delete from tblVehiclePhotos where tblVehiclePhotosID='${tblVehiclePhotosID}'`
        );
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
   async VersionNo_DELETE_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const tblVersionNoID = req.params.tblVersionNoID;
      let data = await pool
        .request()

        .query(
          `delete from tblVersionNo where tblVersionNoID='${tblVersionNoID}'`
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
//