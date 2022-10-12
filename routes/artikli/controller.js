import * as service from "./service.js";

export const getAllArticles = async (req, res, next) => {
  try {
    const params = req.query;
    console.log(params);
    const result = await service.getAllArticles(params);
    return res.status(200).send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
