const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

exports.listUser = async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.readUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.changePasswordUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    //Hash-Password
    const hashPassword = await bcrypt.hash(newPassword, 10); //bcrypt.hash(req.body.password, salt)

    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        password: hashPassword,
      },
    });

    res.status(200).json(user);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.delete({
      where: {
        id: Number(id)
      }
    })

    res.status(200).json(user);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.changeRoleUser = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const user = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        role: role,
      },
    });

    res.status(200).json({ msg: "Update role success" });
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};
