const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");


const mydb = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"password",
    database:"CRUD-Nodejs-reactjs",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const uid = req.body.userid;
  const uname = req.body.username;


  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    const insert = "INSERT INTO mydb (id ,uName ,LName, photo) VALUES (? , ? , ? ,?)";
    mydb.query(insert,[uid ,uname , " " , `/uploads/${file.name}`],(err,result)=>{

});
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

app.get("/react/show",(req,res) => {
    
  const Select = "SELECT * FROM mydb";
  mydb.query(Select,(err,result)=>{

      res.send(result);

});
});


app.delete("/react/delete/:userid",(req,res) => {
  const userid = req.params.userid;
  const sqdelete = "DELETE FROM mydb WHERE id = ?";
  mydb.query(sqdelete , userid ,(err,result) =>{
      if (err) console.log(err);



  });
});
app.put("/react/update/",(req,res) => {
      
  const userid = req.body.userid;
  const username = req.body.username;
 
  const Update = "UPDATE mydb SET uName = ? WHERE id = ? ";
  mydb.query(Update, [username, userid], (err,result)=>{
     console.log(req.body);
     console.log(err);
      res.send(result);

});
});

app.listen(5000, () => console.log('Server Started...'));
