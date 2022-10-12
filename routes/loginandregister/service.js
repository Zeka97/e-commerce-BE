import * as model from "./model.js";
import bcrypt from "bcrypt";

export const checkUserLogin = async (params) => {
  const user = await model.checkUserLogin(params);
  if (user.length) {
    if (bcrypt.compareSync(params.password, user[0].password)) return user[0];
  }
  return false;
};

export const checkAdminLogin = async (params) => {
  const admin = await model.checkAdminLogin(params);
  if (admin.length) {
    if (params.password == admin[0].password) return admin[0];
  }
  return false;
};

export const registerUser = async (params) => {
  const result = await model.checkIfUserExists(params);
  if (!result.length) {
    const register = await model.registerUser(params);
    return register;
  }
  return false;
};
