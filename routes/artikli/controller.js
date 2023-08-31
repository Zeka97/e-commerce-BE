import * as service from "./service.js";

export const getAllArticles = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.getAllArticles(params);
    return res.status(200).send(result);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
};

export const getArticle = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.getArticle(params);
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};
