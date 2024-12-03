import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'uploads',
      resource_type: 'image',
      public_id: (req, file) => file.originalname.split('.')[0],
    },
});

export const deleteFile = async (url) => {
  const publicIdMatch = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  const publicId = publicIdMatch ? publicIdMatch[1] : null;

  if(!publicId) 
    return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error:', error);
  }
}

  

const parser = multer({ storage: storage });

export default parser;