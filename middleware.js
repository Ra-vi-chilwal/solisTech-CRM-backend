const { verify } = require("jsonwebtoken");
const User = require("./Auth/model");
const Role = require("./role/model");
const fs = require("fs");


module.exports = {
  checkToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
          return res.status(404).json({
            code: "INVALIDTOKEN",
            data: err,
          });
        } else {
          User.findById(decoded._id).populate({
            path: 'company',
            populate: {
              path: 'plan',
              model: 'Pricing'
            }
          })
            .exec((err, result) => {
              if (result) {
                const currentDate = new Date().toISOString().substring(0, 10);
                const expiredOn = result.company && result.company.expiredOn;
                if (expiredOn <= currentDate) {
                  return res.status(200).json({
                    body: {
                      code: "PLANEXPIRED",
                      token: token,
                      verified: true,
                    },
                  });
                } else {
                  Role.findById({ _id: result.role }).exec((err, roleData) => {
                    if (roleData) {
                      result['role'] = roleData;
                      req.user = result;
                      req.roleData = roleData;
                      next();
                    }
                  })


                }
              }
              else {
                return res.status(404).json({
                  code: "USERNOTFOUND",
                  data: err,
                });
              }
            });
        }
      });
    } else {
      return res.status(401).json({
        code: "UNAUTHORIZED",
      });
    }
  },

  superAdmin: async (req, res, next) => {
    try {
      const roles = await Role.findById({ _id: req.user.role._id });
      if (roles.slug == "superadmin" && roles.permissions && roles.permissions.some((item) => item.value == "root")) {
        next();
      }
      else {
        return res.status(401).json({
          code: "UNAUTHORIZED",
          data: 'You are not superadmin !!'
        });
      }
    } catch (error) {
      return res.status(401).json({
        code: "ERROROCCURED",
        data: error
      });
    }
  },

  // delete
  checkDelete: (req, res, next) => {
    const roleData = req.roleData;
    if (
      roleData &&
      roleData.permissions && roleData.permissions.some((element) => element.value === "delete")
    ) {
      next();
    } else {

      return res.status(200).json({ message: "You do not have permission for delete" })

    }
  },
  checkUpdate: (req, res, next) => {
    const roleData = req.roleData;
    if (roleData &&
      roleData.permissions && roleData.permissions.some((element) => element.value === "update")
    ) {
      next();
    } else {
      return res
        .status(200)
        .json({ message: "You do not have permission for update" })
        .end();
    }
  },
  checkCreate: (req, res, next) => {
    const roleData = req.roleData;
    if (
      roleData &&
      roleData.permissions && roleData.permissions.some((element) => element.value === "create")
    ) {
      next();
    } else {
      return res
        .status(200)
        .json({ message: "You do not have permission for create" })
        .end();
    }
  },
  checkRead: (req, res, next) => {
    const roleData = req.roleData;
    if (
      roleData &&
      roleData.permissions && roleData.permissions.some((element) => element.value === "read")
    ) {
      next();
    } else {
      return res
        .status(200)
        .json({ message: "You do not have permission for read." })
        .end();
    }
  },

  posFolder: (req, res, next) => {
    const folderName = `./public/pos/${req.user && req.user.company && req.user.company.title}`;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
      next();
    } catch (err) {
      return res.json({
        data: err,
        code: "ERRORINDIRECTORY"
      })
    }
  },
  rcFolder: (req, res, next) => {
    fs.mkdir(`./public/rc/${req.user.company.title}`, (error) => {
      if (error) {
        next();
      } else {
        console.log('New folder has been created.')
        next();
      }
    })
  },
  approvalFolder: (req, res, next) => {
    const folderName = `./public/approval/${req.user && req.user.company && req.user.company.title}`;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
      next();
    } catch (err) {
      return res.json({
        data: err,
        code: "ERRORINDIRECTORY"
      })
    }
  }
};