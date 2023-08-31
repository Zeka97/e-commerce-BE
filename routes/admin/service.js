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

export const updateArticleDiscountPrice = async (params) => {
  const result = await model.updateArticleDiscountPrice(params);
  return result;
};

export const removeArticleDiscountPrice = async (params) => {
  const result = await model.removeArticleDiscountPrice(params);

  return result;
};

export const editArticle = async (params) => {
  const result = await model.editArticle(params);

  return result;
};

export const addNewCategory = async (params) => {
  const result = await model.addNewCategory(params);
  return result;
};

export const updateCategory = async (params) => {
  const result = await model.updateCategory(params);

  return result;
};

export const getAllUsers = async (params) => {
  let totalItems;
  if (params.page == 1) {
    totalItems = await model.getAllUsers({
      limit: Number.MAX_SAFE_INTEGER,
      offset: (params.page - 1) * params.limit,
      ...params,
    });
  }

  const data = await model.getAllUsers({
    limit: params.limit,
    offset: (params.page - 1) * params.limit,
    ...params,
  });

  return { rows: data, total: totalItems.length };
};

export const getUserDetails = async (id) => {
  const data = await model.getUserDetails(id);

  return data;
};

export const getStatistic = async () => {
  const data = await model.getStatistic();

  return data;
};
