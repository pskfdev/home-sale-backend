const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken) {
      return res.status(401).json({ msg: "No Token, Authorization!" });
    }

    //แยก Bearer ออกจาก Token ที่ส่งมา
    const token = headerToken.split(" ")[1];

    //ถอดรหัส token เป็นข้อมูล(data)
    const decode = jwt.verify(token, process.env.SECRET);

    //เพิ่ม property user=decode เข้าไปใน object req
    req.user = decode;

    //ค้นหา Email ที่ได้จากการ decode ไปค้นหาใน DB
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(401).json({ msg: "User not found!" });
    }

    next();
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Token Invalid!" });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;

    //ค้นหา email ใน DB
    const adminUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    //Check ว่ามี user นี้ไหม และ user นี้เป็น role="admin" ไหม
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ msg: "Error access denied: Admin only!" });
    }

    next();
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Error Admin access denied!" });
  }
};
