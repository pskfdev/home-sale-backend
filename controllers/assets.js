const prisma = require("../config/prisma");

exports.createAssets = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      categoryId,
      ownerName,
      ownerContact,
      images,
    } = req.body;

    const assets = await prisma.assets.create({
      data: {
        title: title,
        description: description,
        price: parseInt(price),
        location: location,
        categoryId: parseInt(categoryId),
        ownerName: ownerName,
        ownerContact: ownerContact,
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    res.status(200).json(assets);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.listAssets = async (req, res) => {
  try {
    const assets = await prisma.assets.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        category: true,
        images: true,
      },
    }); //orderBy เป็น options ช่วยเรียงข้อมูลตาม property ที่ต้องการ

    res.status(200).json(assets);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.readAssets = async (req, res) => {
  try {
    const { id } = req.params;

    const assets = await prisma.assets.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.status(200).json(assets);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.updateAssets = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      location,
      categoryId,
      ownerName,
      ownerContact,
      images,
    } = req.body;

    /* ลบรูปเก่าออกก่อน */
    await prisma.image.deleteMany({
      where: {
        assetsId: parseInt(id),
      },
    });

    const assets = await prisma.assets.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
        description: description,
        price: parseInt(price),
        location: location,
        categoryId: parseInt(categoryId),
        ownerName: ownerName,
        ownerContact: ownerContact,
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    res.status(200).json(assets);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.removeAssets = async (req, res) => {
  try {
    const { id } = req.params;

    /* จัดการลบรูปด้วย */

    const assets = await prisma.assets.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json(assets);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};
