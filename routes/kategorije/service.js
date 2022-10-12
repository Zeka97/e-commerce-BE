import * as model from "./model.js";

export const getAllCategories = async (params) => {
  const result = await model.getAllCategories({
    ...params,
    limit: params.limit || Number.MAX_SAFE_INTEGER,
  });

  return result;
};
