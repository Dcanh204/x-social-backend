import { Request } from "express";
import { handlerUploadImage, handlerUploadVideo } from "~/utils/fileUpload.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { UPLOAD_IMAGE_DIR } from "~/constants/dirUploads.js";
import { isProduction } from "~/config/config.js";
import { MediaType } from "~/constants/enums.js";
export const uploadImage = async (req: Request) => {
  const file = await handlerUploadImage(req);
  // lấy tên file bỏ đuôi
  const result = await Promise.all(
    file.map(async (file) => {
      const newName = path.basename(file.newFilename, path.extname(file.newFilename));
      const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`);
      await sharp(file.filepath).jpeg({ quality: 90 }).toFile(newPath);
      fs.unlinkSync(file.filepath);
      console.log(file.filepath);
      return {
        url: isProduction
          ? `${process.env.HOST}/static/images/${newName}.jpg`
          : `http://localhost:${process.env.PORT}/static/images/${newName}.jpg`,
        type: MediaType.Image
      };
    })
  );
  return result;
};

export const uploadVideo = async (req: Request) => {
  const file = await handlerUploadVideo(req);
  const result = file.map((file) => {
    return {
      url: isProduction
        ? `${process.env.HOST}/static/videos/${file.newFilename}`
        : `http://localhost:${process.env.PORT}/static/videos/${file.newFilename}`,
      type: MediaType.Video
    };
  });
  return result;
};
