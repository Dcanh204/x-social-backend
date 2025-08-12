import { Request } from "express";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import ApiError from "./ApiError.js";
import { StatusCodes } from "http-status-codes";
import { UPLOAD_TEMP_DIR } from "~/constants/dirUploads.js";

export const initFolderUploads = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, { recursive: true });
  }
};

export const handlerUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: path.resolve(UPLOAD_TEMP_DIR),
    maxFiles: 1,
    maxFileSize: 300 * 1024,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = Boolean(mimetype) && Boolean(mimetype?.includes("image"));
      if (!valid) {
        form.emit("error" as any, new ApiError(StatusCodes.BAD_REQUEST, "File type is not valid") as any);
      }
      return valid;
    }
  });
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const hasFile = Object.values(files).some((fileList) => Array.isArray(fileList) && fileList.length > 0);

      if (!hasFile) {
        return reject(new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded"));
      }
      resolve((files.image as formidable.File[])[0]);
    });
  });
};
