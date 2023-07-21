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
                       ,@ChildrenNames
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
  
};
export default FATSDB;

