const { verify } = require("jsonwebtoken");
const {Users} = require("./Auth/model");
const {Role} = require("./role/model");
const fs = require("fs");


module.exports = {
   checkToken : async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
 
    try {
      if (token) {
        verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
          if (err) {
            return res.status(404).json({
              code: 'INVALIDTOKEN',
              data: err,
            });
          } else {
            const result = await Users.findById(decoded._id).populate({
              path: 'company',
              populate: {
                path: 'plan',
                model: 'plan',
              },
            });
            if (result) {
              const currentDate = new Date().toISOString().substring(0, 10);
             
              const expiredOn = result.company && result.company.expireOn;
            
              if (expiredOn <= currentDate) {
                return res.status(200).json({
                  code: 'PLANEXPIRED',
                  body: {
                    token: token,
                    verified: true,
                  },
                });
              } else {
                try {
                  const roleData = await Role.findById(result.role).exec();
            
              
                  if (roleData) {
                    result.role = roleData;
                    req.user = result;
                    req.roleData = roleData;
                    next();
                  }
                } catch (err) {
                  console.error(err);
                  // Handle the error as needed
                }
              }
            } else {
              console.log(err)
              return res.status(200).json({
                code: 'USERNOTFOUND',
                data: err,
              });
            }
          }
        });
      } else {
        return res.status(401).json({
          code: 'UNAUTHORIZED',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        code: 'SERVERERROR',
        error: error.message,
      });
    }
  }
  

  // superAdmin: async (req, res, next) => {
  //   try {
  //     const roles = await Role.findById({ _id: req.user.role._id });
  //     if (roles.slug == "superadmin" && roles.permissions && roles.permissions.some((item) => item.value == "root")) {
  //       next();
  //     }
  //     else {
  //       return res.status(401).json({
  //         code: "UNAUTHORIZED",
  //         data: 'You are not superadmin !!'
  //       });
  //     }
  //   } catch (error) {
  //     return res.status(401).json({
  //       code: "ERROROCCURED",
  //       data: error
  //     });
  //   }
  // },

  // delete
  // checkDelete: (req, res, next) => {
  //   const roleData = req.roleData;
  //   if (
  //     roleData &&
  //     roleData.permissions && roleData.permissions.some((element) => element.value === "delete")
  //   ) {
  //     next();
  //   } else {

  //     return res.status(200).json({ message: "You do not have permission for delete" })

  //   }
  // },
  // checkUpdate: (req, res, next) => {
  //   const roleData = req.roleData;
  //   if (roleData &&
  //     roleData.permissions && roleData.permissions.some((element) => element.value === "update")
  //   ) {
  //     next();
  //   } else {
  //     return res
  //       .status(200)
  //       .json({ message: "You do not have permission for update" })
  //       .end();
  //   }
  // },
  // checkCreate: (req, res, next) => {
  //   const roleData = req.roleData;
  //   if (
  //     roleData &&
  //     roleData.permissions && roleData.permissions.some((element) => element.value === "create")
  //   ) {
  //     next();
  //   } else {
  //     return res
  //       .status(200)
  //       .json({ message: "You do not have permission for create" })
  //       .end();
  //   }
  // },
  // checkRead: (req, res, next) => {
  //   const roleData = req.roleData;
  //   if (
  //     roleData &&
  //     roleData.permissions && roleData.permissions.some((element) => element.value === "read")
  //   ) {
  //     next();
  //   } else {
  //     return res
  //       .status(200)
  //       .json({ message: "You do not have permission for read." })
  //       .end();
  //   }
  // },




};