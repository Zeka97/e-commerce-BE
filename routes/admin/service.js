import * as model from "./model.js";

export const getAllTransactions = async (params) => {
  let total;
  if (params.page == 1) {
    total = (
      await model.getAllTransactions({
        ...params,
        offset: 0,
        limit: Number.MAX_SAFE_INTEGER,
      })
    ).length;
  }
  const rows = await model.getAllTransactions({
    ...params,
    offset: (params.page - 1) * params.limit,
    limit: params.limit,
  });
  console.log(total, rows);

  return { total, rows };
};

export const changeArticleVisibility = async (params) => {
  const result = await model.changeArticleVisibility(params);

  return result;
};

export const setArticleOutOfStock = async (params) => {
  const result = await model.setArticleOutOfStock(params);
  return result;
};
