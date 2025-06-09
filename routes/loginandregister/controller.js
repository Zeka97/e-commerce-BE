import * as service from "./service.js";

export const checkLogin = async (req, res, next) => {
  try {
    let params = req.body.params;
    const user = await service.checkUserLogin(params);
    if (user)
      return res.status(200).send({ user: { ...user, isAdmin: false } });
    const admin = await service.checkAdminLogin(params);
    if (admin)
      return res.status(200).send({ admin: { ...admin, isAdmin: true } });
    return res.status(500).send({ message: "User ne postoji" });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const params = req.body.params;
    const result = await service.registerUser(params);
    if (result) return res.sendStatus(200);
    else return res.sendStatus(500);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};
