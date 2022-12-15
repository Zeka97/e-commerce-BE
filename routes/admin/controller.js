import * as service from "./service.js";

export const getAllTransactions = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.getAllTransactions(params);
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const changeArticleVisibility = async (req, res, next) => {
  try {
    const params = req.body.params;
    console.log(params);
    const result = await service.changeArticleVisibility(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const setArticleOutOfStock = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.setArticleOutOfStock(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
