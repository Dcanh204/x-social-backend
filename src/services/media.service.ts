import { Request } from "express";
import { handlerUploadImage } from "~/utils/fileUpload.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";

import { UPLOAD_DIR, UPLOAD_TEMP_DIR } from "~/constants/dirUploads.js";
import { isProduction } from "~/config/config.js";
export const uploadImage = async (req: Request) => {
  const file = await handlerUploadImage(req);
  // lấy tên file bỏ đuôi
  const newName = path.basename(file.newFilename, path.extname(file.newFilename));
  const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`);
  await sharp(file.filepath).jpeg({ quality: 90 }).toFile(newPath);
  fs.unlinkSync(file.filepath);
  return isProduction
    ? `${process.env.HOST}/images/${newName}.jpg`
    : `http://localhost:${process.env.PORT}/images/${newName}.jpg`;
};
