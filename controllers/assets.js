const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;


// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createAssets = async (req, res) => {
  try {
    const {
      title,
      description,
      priceRent,
      priceSale,
      location,
      categoryId,
      ownerName,
      ownerContact,
      image,
    } = req.body;
    

    const assets = await prisma.assets.create({
      data: {
        title: title,
        description: description,
        priceRent: parseInt(priceRent),
        priceSale: parseInt(priceSale),
        location: location,
        categoryId: parseInt(categoryId),
        ownerName: ownerName,
        ownerContact: ownerContact,
        images: {
          create: image.map((item) => ({
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
      priceRent,
      priceSale,
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
        priceRent: parseInt(priceRent),
        priceSale: parseInt(priceSale),
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

    //ค้นหา assets ด้วย id จาก params
    const assets = await prisma.assets.findFirst({
      where: {
        id: parseInt(id)
      },
      include: {
        images: true
      }
    })

    //Check empty assets
    if (!assets) {
      return res.status(400).json({ msg: "Assets not found!" });
    }

    //เข้าถึง images[]ที่ได้จาก assets
    //แล้วทำการ map() ให้เป็น new Promise((resolve, reject) => cloudinary.uploader.destroy(item.public_id (x,i)=> )
    //คือการวนลูป เพื่อเรียกใช้ new Promise() เพื่อลบรูปภาพบน Cloudinary แบบรอกันทีละรูปภาพ
    const assetsImage = assets.images.map((item) => new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(item.public_id, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    }))

    //ใช้งาน Promise.all() เพื่อให้ทำงานแบบรมกันทั้งหมด
    await Promise.all(assetsImage)
    

    //ลบข้อมูลใน DB Assets
    const result = await prisma.assets.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};


//Controller Image
exports.createImage = async (req, res) => {
  try {
    const { image } = req.body;

    //Upload Image to cloudinary
    const result = await cloudinary.uploader.upload(image, {
      public_id: `Image-${Date.now()}`,
      resource_type: "auto",
      folder: "home-sale",
    });

    res.status(200).json(result);
  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    //public_id
    const { public_id } = req.body;   

    //Delete Image in cloudinary
    cloudinary.uploader.destroy(public_id, (result) => {
      res.status(200).json({ msg: "Remove image success" });
    });

  } catch (err) {
    console.log("Err", err);
    res.status(500).json({ msg: "Server Error!" });
  }
};
