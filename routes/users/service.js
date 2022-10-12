import * as model from "./model.js";

export const listaNarudzbi = async (params) => {
  const result = await model.listaNarudzbi(params);
  return result;
};

export const kreirajNarudzbu = async (params) => {
  const result = model.kreirajNarudzbu(params);
  return result;
};
