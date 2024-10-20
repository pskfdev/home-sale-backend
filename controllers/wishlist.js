const prisma = require("../config/prisma");

//Create wishlist
exports.addWishlist = async (req, res) => {
  try {
    const { id } = req.user;
    const { wishlist } = req.body;

    //ค้นหา user ด้วย id จาก req.user
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    //ลบข้อมูลเก่าใน DB assetsOnWishlist ก่อน
    await prisma.assetsOnWishlist.deleteMany({
      where: {
        wishlist: {
          userId: user.id,
        },
      },
    });
    //ลบข้อมูลเก่าใน DB wishlist ก่อน
    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
      },
    });

    //เตรียมข้อมูล Wishlist ที่ส่งมาจากหน้าบ้าน
    let assets = wishlist.map((item) => ({
      assetsId: item.id,
    }));

    //New-wishlist
    const newWishlist = await prisma.wishlist.create({
      data: {
        assets: {
          create: assets,
        },
        userId: user.id,
      },
    });

    res.status(200).json({ msg: "Add wishlist success" });
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

//Get wishlist
exports.listWishlist = async (req, res) => {
  try {
    const { id } = req.user;

    const wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: parseInt(id),
      },
      include: {
        assets: {
          include: {
            assets: true,
          },
        },
      },
    });

    res.status(200).json({ wishlist: wishlist.assets });
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

//Remove wishlist
exports.removeWishlist = async (req, res) => {
  try {
    const { id } = req.user;

    //ค้นหา Wishlist ของ userId ที่ส่งมา
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: parseInt(id),
      },
    });

    if (!wishlist) {
      return res.status(400).json({ msg: "No wishlist!" });
    }

    //ลบข้อมูลเก่าใน DB assetsOnWishlist
    await prisma.assetsOnWishlist.deleteMany({
      where: {
        wishlistId: wishlist.id,
      },
    });
    //ลบข้อมูลเก่าใน DB wishlist
    await prisma.wishlist.deleteMany({
      where: {
        userId: parseInt(id),
      },
    });

    res.status(200).json({ msg: "Remove wishlist success" });
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};
