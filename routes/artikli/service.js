import * as model from "./model.js";

export const getAllArticles = async (params) => {
  const result = await model.getAllArticles({
    searchValue: params.searchValue || null,
    kategorija_id: params.kategorija_id || null,
    limit: params.limit || Number.MAX_SAFE_INTEGER,
    discount: params.discount || null,
    popular: params.popular || null,
    ...params,
  });

  return result;
};

export const getArticle = async (params) => {
  const result = await model.getArticle(params);

  return result[0];
};
