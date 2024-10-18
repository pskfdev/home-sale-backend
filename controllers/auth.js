const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check req.body.email & password
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password is required!" });
    }

    //Check Email in DB
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.status(400).json({ msg: "Email already exits!" });
    }

    //Hash-Password
    const hashPassword = await bcrypt.hash(password, 10); //bcrypt.hash(req.body.password, salt)

    //Create to DB
    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });

    res.status(200).json({ msg: "Register success." });
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check req.body.email & password
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password is required!" });
    }

    //Check Email in DB
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ msg: "User not found!" });
    }

    //Check Password in DB by bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password Invalid!" });
    }

    //Create payload and Generate Token
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: "15d" },
      (err, token) => {
        
        if (err) {
          return res.status(500).json({ msg: "Server Error!" });
        }

        res.status(200).json({ payload, token });
      }
    );
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.currentUser = async (req, res) => {
  try {
    res.send("Hello Current-user");
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.currentAdmin = async (req, res) => {
  try {
    res.send("Hello Current-admin");
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};
