import * as model from "./model.js";

export const getAllArticles = async (params) => {
  let total;
  if (params.page == 1) {
    total = (
      await model.getAllArticles({
        ...params,
        searchValue: params.searchValue || null,
        kategorija_id: params.kategorija_id || null,
        limit: Number.MAX_SAFE_INTEGER,
        discount: params.discount || null,
        offset: 0,
        popular: params.popular || null,
      })
    ).length;
  }

  const result = await model.getAllArticles({
    ...params,
    searchValue: params.searchValue || null,
    kategorija_id: params.kategorija_id || null,
    discount: params.discount || null,
    popular: params.popular || null,
    offset: (params.page -1) * params.limit,
  });

  return { total, articles: result };
};

export const getArticle = async (params) => {
  const result = await model.getArticle(params);

  return result[0];
};
