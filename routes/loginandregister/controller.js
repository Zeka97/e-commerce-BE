import * as service from "./service.js";

export const checkLogin = async (req, res, next) => {
    let params = req.body.params;
    if(params.username == 'admin'){
      try{
      const admin = await service.checkAdminLogin(params);
      return res.status(200).send({admin: admin});
      }
      catch(error){
        return res.status(500).send(error);
      }
    }
    else{
      try{
      const user = await service.checkUserLogin(params);
      return res.status(200).send({user: user});
    }
    catch(error){
      return res.status(500).send(error);
    }
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
