import knex from "../../db.js";
import bcrypt from "bcrypt";

export const checkUserLogin = async (params) => {
  const result = await knex("users")
    .select()
    .where("users.username", "=", params.username);

  return result;
};
export const checkAdminLogin = async (params) => {
  const result = await knex("admin")
    .select()
    .where("admin.username", "=", params.username);

  return result;
};

export const checkIfUserExists = async (params) => {
  const result = await knex("users")
    .select()
    .where("username", "=", params.username)
    .orWhere("email", "=", params.email);

  return result;
};

export const registerUser = async (params) => {
  const password = bcrypt.hashSync(params.password, 10);
  const result = await knex("users").insert({ ...params, password: password });

  return result;
};
