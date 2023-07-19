const express = require("express");
const cors = require("cors");
const multer = require('multer');
const connect = require("./config/connect");
var bodyParser = require('body-parser')
const path = require("path")
require("dotenv").config()
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(
  express.urlencoded({
    extended: true,
    parameterLimit: 1500000,
  })
);
connect();
app.use(cors());


//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,  uniqueSuffix+'-'+file.originalname); // File naming convention
  },
});
const upload = multer({ storage: storage });

const authRouter = require('./Auth/router.js');
const planRouter = require('./plan/router.js');
const companyRouter = require('./company/router');
const  roleRouter  = require("./role/router");
const  verifyRouter  = require("./verify/router");
app.use("/auth", authRouter);
app.use("/plan", planRouter);
app.use("/role", roleRouter);
app.use("/verify", verifyRouter);
app.use("/company",upload.single('companyLogo'), companyRouter);
// app.use("/auth", authRouter);

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(5000, () => {
  console.log("Port is running on 5000...");
});