const prisma = require("../config/prisma");

//Create wishlist
exports.addWishlist = async (req, res) => {
  try {
    const { id } = req.user;
    const { assetsId } = req.body;

    //ค้นหา user ด้วย id จาก req.user
    const user = await prisma.user.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    //New-wishlist
    const newWishlist = await prisma.wishlist.create({
      data: {
        assetsId: parseInt(assetsId),
        userId: parseInt(user.id),
      },
    });

    res.status(200).json(newWishlist);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

//Get wishlist
exports.listWishlist = async (req, res) => {
  try {
    const { id } = req.user;

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: parseInt(id),
      },
      include: {
        assets: true,
      },
    });

    res.status(200).json(wishlist);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

//Remove wishlist
exports.removeWishlist = async (req, res) => {
  try {
    const { id } = req.user;
    const { wishlistId } = req.body;

    //ค้นหา Wishlist ของ userId ที่ส่งมา
    const wishlists = await prisma.wishlist.findMany({
      where: {
        userId: parseInt(id),
      },
    });

    if (!wishlists) {
      return res.status(400).json({ msg: "No wishlist!" });
    }


    //ลบข้อมูลเก่าใน DB wishlist
    const wishlist = await prisma.wishlist.delete({
      where: {
        id: parseInt(wishlistId),
      },
    });

    res.status(200).json(wishlist);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};
