const { Users } = require("./model");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { Role } = require("../role/model");

require("dotenv").config();
module.exports = {
  // ------------Register-------------------------
  register: (req, res) => {
    Users.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res.json({
          code: "DUPLICATEDATA",
        });
      } else {
     
        hash(req.body.password, 8, (err, hash) => {
          if (hash) {
            const user = new Users({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hash,
              company: req.body.company,
              gender: req.body.gender,
              dob: req.body.dob,
              role: req.body.role,
              company:req.body.company

            });
            user.save().then(async (user) => {
              return res.status(200).json({
                code: "CREATED",
                data: user,
              });
            });
          }
        });
      }
    });
  },
  //------------End-------------------------

  //----------------Delete User-----------------------
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await Users.findByIdAndDelete({ _id: req.body.id });
      if (deletedUser) {
        return res.status(200).json({
          code: "DELETED",
          data: "User has been deleted !!",
        });
      } else {
        return res.status(400).json({
          code: "NOT DELETED",
          data: "This Id does not exist in our database!!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        code: "ERROROCCURED",
        data: error,
      });
    }
  },
  //---------------End-----------------------

  //--------------------Update User-----------------
  updateUser: async (req, res) => {
    try {
      const updatedUser = await Users.findByIdAndUpdate(
        { _id: req.body.id },
        { $set: { ...req.body } }
      );
      if (updatedUser) {
        return res.status(200).json({
          code: "UPDATED",
          data: "User has been updated !!",
        });
      } else {
        return res.status(400).json({
          code: "NOT UPDATED",
          data: "This Id does not exist in our database!!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        code: "ERROROCCURED",
        data: error,
      });
    }
  },
  //----------------End--------------------------

  //---------------------Login-----------------------------


  login: async (req, res, next) => {
    const { email, password } = req.body;

    // Check if username and password is provided
    if (!email || !password) {
      return res.status(200).json({
        code: "ERROROCCURRED",
        data: "email or Password not present",
      });
    }
    try {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(200).json({
          code: "ERROROCCURRED",
          data: "User not found",
        });
      } else {
  
        // comparing given password with hashed password
        bcrypt.compare(password, user.password).then(async function ( result,err) {
          
          if (result) {
            const role = await Role.find({ _id: user.role })
            if (err) {
              return res.status(200).json({
                code: "ERROROCCURRED",
                data: err,
              });
            } else {
              user.password = undefined;
              const token = sign(
                {
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  company: user.company,
                  role: role,
               
                },
                process.env.TOKEN_KEY,
                {
                  expiresIn: "1d",
                }
              );
              
              return res.status(200).json({
                code: "FETCHED",
                token: token,
              })
            }

          }else{
           
              return res.status(200).json({
                code: "UNAUTHORISED",
                data : "User password is not correct"
              })
            
          }

        });
      }
    } catch (error) {
      res.status(200).json({
        message: "ERROROCCURRED",
        error: error.message,
      });
    }
  },
  //--------------------End--------------------------

  //------------------VerifyOtp-------------------------
  verifyOtp: async (req, res) => {
    try {
      const { reset_otp } = req.body;
      if (reset_otp != null) {
        const userExist = await Users.findOne({ reset_otp: reset_otp });
        if (userExist) {
          return res.status(200).json({
            code: "OTP_VERIFIED",
            data: userExist.email,
          });
        } else {
          return res.status(400).json({
            code: "ERROROCCURED",
            data: "Invalid OTP",
          });
        }
      } else {
        return res.status(400).json({
          code: "ERROROCCURED",
          data: "Please enter four digit OTP !!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        code: "ERROROCCURED",

        data: error,
      });
    }
  },
  //-------------------end--------------------

  //---------------Update Passsword----------------
  updatePassword: async (req, res) => {
    const { email, password, otp } = req.body;
    try {
      const hashedPassword = await hash(password, 10);
      const updatedUserPassword = await User.findOneAndUpdate(
        { email: email, otp: otp },
        { $set: { password: hashedPassword, reset_otp: null } }
      );
      if (updatedUserPassword) {
        return res.status(200).json({
          code: "UPDATED",
          data: "YOUR PASWORD HAS BEEN UPDATED !!",
        });
      } else {
        return res.status(400).json({
          code: "NOTUPDATED",
          data: "THIS USER DOES NOT EXIST IN OUR DATABASE !!",
        });
      }
    } catch (error) {
      return res.status(400).json({
        code: "ERROROCCURED",
        data: error,
      });
    }
  },

  // --------- Get All uSer----------------------
getAllUser: async (req, res) => {
    try {
      const roleName = req.roleData?.slug;
      let userList;
      const data = req.roleData
   
      if (
        roleName === "superadmin" &&
        req.roleData?.permission?.some((item) => item.value === "root")
        ) {
          userList = await Users.find({})
          .populate("company")
          .populate("role")
          .sort([["createdAt", -1]]);

      } else {
        userList = await Users.find({ company: req.user?.company })
          .populate("company")
          .populate("role")
          .sort([["createdAt", -1]]);
      }

      return res.status(200).json({
        code: "FETCHED",
        data: userList,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        code: "ERROROCCURED",
        data: error.message,  
      });
    }
  },
  
  //-------change Pasword------------------
  changePassword: (req, res) => {
    User.findOne({ _id: req.user._id }).exec((err, user) => {
      const passwordEnteredByUser = req.body.password;
      const hashedPassword = user.password;
      compare(passwordEnteredByUser, hashedPassword, function (err, isMatch) {
        if (err) {
          return res.status(400).json({
            code: " ERROROCCURED",
            data: err,
          });
        } else if (!isMatch) {
          return res.status(400).json({
            code: "PASSWORDISNOTMATCHED",
            data: err,
          });
        } else {
          hash(req.body.newpassword, 10, (err, hash) => {
            User.findOneAndUpdate(
              { _id: req.user._id },
              { password: hash },
              null,
              function (err, result) {
                if (err) {
                  res.status(200).json({
                    code: "ERROROCCURED",
                    data: err,
                  });
                } else {
                  res.status(200).json({
                    code: "UPDATED",
                    data: result,
                  });
                }
              }
            );
          });
        }
      });
    });
  },
  //----------End--------------------
};
