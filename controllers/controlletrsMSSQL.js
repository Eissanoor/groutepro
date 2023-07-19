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
  //
  //-----------------------------------------------------------------------------------

  //---------------------------PUT--------------------------------------------------------

 
  async WarrantyPeriod_Put(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const WarrantyPeriodCode = req.params.WarrantyPeriodCode;
      let data = await pool
        .request()

        .input("WarrantyPeriodDesc", sql.VarChar, req.body.WarrantyPeriodDesc)

        .query(
          ` 
          UPDATE [dbo].[prmWarrantyPeriod]
SET

[WarrantyPeriodDesc] =@WarrantyPeriodDesc
WHERE WarrantyPeriodCode='${WarrantyPeriodCode}'`
        );
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  //-------------------------------------------------------------------------------------

  //---------------------------GET--------------------------------------------------------
 
  async MaritalStatus_GET_LIST(req, res, next) {
    try {
      let pool = await sql.connect(config);
      let data = await pool.request().query(`select * from prmMaritalStatus`);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  async MaritalStatus_GET_BYID(req, res, next) {
    try {
      let pool = await sql.connect(config);
      const MaritalCode = req.params.MaritalCode;
      let data = await pool
        .request()

        .query(
          `select * from prmMaritalStatus where MaritalCode='${MaritalCode}'`
        );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: `${error}` });
    }
  },
  //-----------------------------------------------------------------------------------

  //---------------------------DELETE--------------------------------------------------------

 
  
};
export default FATSDB;

