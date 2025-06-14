import knex from "../../db.js";

export const getAllCategories = async (params) => {
  const result = await knex("kategorije").select().limit(params.limit);

  return result;
};
