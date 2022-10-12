import * as service from "./service.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.getAllCategories(params);
    return res.status(200).send(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
