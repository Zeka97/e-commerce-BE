import * as service from "./service.js";

export const listaNarudzbi = async (req, res, next) => {
  try {
    const params = req.query;
    const result = await service.listaNarudzbi(params);
    return res.status(200).json(result);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export const kreirajNarudzbu = async (req, res, next) => {
  try {
    const params = req.body.params;
    console.log(params);
    const result = service.kreirajNarudzbu(params);
    return res.status(200).send(result);
  } catch (e) {
    res.status(500).send(e);
    next(e);
  }
};
