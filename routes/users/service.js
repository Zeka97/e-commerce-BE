import * as model from "./model.js";

export const listaNarudzbi = async (params) => {
  let total;
  if (params.page == 1) {
    total = (
      await model.listaNarudzbi({
        ...params,
        offset: 0,
        limit: Number.MAX_SAFE_INTEGER,
      })
    ).length;
  }
  const rows = await model.listaNarudzbi({
    ...params,
    offset: (params.page - 1) * params.limit,
    limit: params.limit,
  });
  console.log(total, rows);

  return { total, rows };
};

export const kreirajNarudzbu = async (params) => {
  const result = model.kreirajNarudzbu(params);
  return result;
};
