import multer from "multer";
import path from "path";
import fs from "fs";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("articlePhoto");

export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    upload({ file }, null, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

export const saveBase64Image = (base64String, filename) => {
  return new Promise((resolve, reject) => {
    try {
      // Remove the data:image/png;base64, part from the string
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

      // Create buffer from base64 string
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save the file
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, imageBuffer);

      resolve(`uploads/${filename}`);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.join(process.cwd(), "public", imagePath);

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        resolve(false); // File doesn't exist, consider it already deleted
        return;
      }

      // Delete the file
      fs.unlinkSync(fullPath);
      resolve(true);
    } catch (error) {
      console.error("Error deleting image:", error);
      reject(error);
    }
  });
};
