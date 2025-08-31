import { Request } from "express";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import ApiError from "./ApiError.js";
import { StatusCodes } from "http-status-codes";
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from "~/constants/dirUploads.js";

export const initFolderUploads = () => {
  [UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

export const handlerUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_IMAGE_TEMP_DIR),
    maxFiles: 4,
    maxFileSize: 300 * 1024,
    maxTotalFileSize: 300 * 1024 * 4,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = Boolean(mimetype) && Boolean(mimetype?.includes("image"));
      if (!valid) {
        form.emit("error" as any, new ApiError(StatusCodes.BAD_REQUEST, "File type is not valid") as any);
      }
      return valid;
    }
  });
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const hasFile = Object.values(files).some((fileList) => Array.isArray(fileList) && fileList.length > 0);

      if (!hasFile) {
        return reject(new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded"));
      }
      resolve(files.image as formidable.File[]);
    });
  });
};

export const handlerUploadVideo = (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR),
    maxFiles: 4,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = Boolean(mimetype) && Boolean(mimetype?.includes("mp4"));
      if (!valid) {
        form.emit("error" as any, new ApiError(StatusCodes.BAD_REQUEST, "File type is not valid") as any);
      }
      return valid;
    }
  });
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const hasFile = Object.values(files).some((fileList) => Array.isArray(fileList) && fileList.length > 0);

      if (!hasFile) {
        return reject(new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded"));
      }
      resolve(files.video as formidable.File[]);
    });
  });
};
