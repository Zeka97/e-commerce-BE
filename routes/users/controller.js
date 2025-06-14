import * as service from "./service.js";

export const listaNarudzbi = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.listaNarudzbi(params);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const kreirajNarudzbu = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.kreirajNarudzbu(params);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.updateUserProfile(params);
    return res.status(200).send(result);
  } catch (e) {
    return res.status(500).send(e);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.changePassword(params);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send(e);
  }
};
