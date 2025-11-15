import { cloudinary } from '../config/cloudinary.js';

export const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'products',
    resource_type: 'image'
  });
  return result.secure_url;
};

export const deleteFromCloudinary = async (url) => {
  const publicId = url.split('/').slice(-2).join('/').split('.')[0];
  await cloudinary.uploader.destroy(publicId);
};
