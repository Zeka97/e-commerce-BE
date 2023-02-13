import { response } from "express";
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

export const updateArticleDiscountPrice = async (req, res, next) => {
  try {
    const params = req.body.params;
    console.log(params);
    const result = await service.updateArticleDiscountPrice(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const removeArticleDiscountPrice = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.removeArticleDiscountPrice(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const editArticle = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.editArticle(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const addNewCategory = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.addNewCategory(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.updateCategory(params);
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const params = req.query;
    console.log(params);
    const result = await service.getAllUsers(params);
    return res.status(200).send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
