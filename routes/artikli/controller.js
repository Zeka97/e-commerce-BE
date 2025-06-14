import * as service from "./service.js";
import fs from "fs";
import path from "path";

export const getAllArticles = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.getAllArticles(params);
    return res.status(200).send(result);
  } catch (e) {
    return res.sendStatus(500);
  }
};

export const getArticle = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.getArticle(params);
    return res.status(200).send(result);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const getImage = async (req, res, next) => {
  try {
    const { imagePath } = req.params;
    const fullPath = path.join(process.cwd(), "public", imagePath);

    console.log(fullPath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).send("Image not found");
    }

    // Read the file
    const imageBuffer = fs.readFileSync(fullPath);

    // Set appropriate headers
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", imageBuffer.length);

    // Send the image
    res.send(imageBuffer);
  } catch (err) {
    console.error("Error serving image:", err);
    return res.status(500).send("Error serving image");
  }
};
