import * as model from "./model.js";
import bcrypt from "bcrypt";

export const checkUserLogin = async (params) => {
  const user = await model.checkUserLogin(params);
  console.log(user);
  console.log(user.blocked_forever);
  if (user) {
    if(user.blocked_forever === true) {
      throw {message: 'Your account has been blocked by admin'};
    }
    else if (bcrypt.compareSync(params.password, user.password)) return user;
    else throw {message: "Incorrect password!"};
  }
  else{
    throw {message: "Incorrect username or email"};
  }
};

export const checkAdminLogin = async (params) => {
  const admin = await model.checkAdminLogin(params);
  if (admin) {
    if (params.password == admin.password) return admin;
    else throw {message: "incorrect password"};
  }
  else throw {message: "Incorrect username or email"};
};

export const registerUser = async (params) => {
  const result = await model.checkIfUserExists(params);
  if (!result.length && params.username !== "admin") {
    const register = await model.registerUser(params);
    return register;
  } else
    throw { message: "Postoji user sa trenutnim username-om ili email-om" };
};
