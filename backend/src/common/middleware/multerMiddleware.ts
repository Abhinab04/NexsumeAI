import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

const uploadDirectory = path.join(
  process.cwd(),
  "upload",
);

// Make sure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    _req,
    _file,
    cb,
  ) => {
    cb(null, uploadDirectory);
  },

  filename: (
    _req,
    file,
    cb,
  ) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const filename =
      `${crypto.randomUUID()}${extension}`;

    cb(null, filename);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb,
) => {
  const allowedExtensions = [
    ".pdf",
    ".docx",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Only PDF and DOCX files are allowed",
      ),
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
