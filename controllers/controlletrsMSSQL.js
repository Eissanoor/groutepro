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
};
export default FATSDB;

