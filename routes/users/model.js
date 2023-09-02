import bcrypt from "bcrypt";
import knex from "../../db.js";

export const listaNarudzbi = async (params) => {
  console.log("params", params);
  const result = await knex("narudzbe")
    .select(
      "narudzbe.id as id",
      "user_id",
      "datum_narudzbe",
      "ukupna_cijena",
      "u.ime",
      "u.prezime",
      "u.email",
      "u.adresa",
      "u.telefon",
      "u.grad"
    )
    .innerJoin("users as u", "u.id", "narudzbe.user_id")
    .where("user_id", "=", params.user_id)
    .modify((QueryBuilder) => {
      if (params.dateFrom)
        QueryBuilder.andWhere("narudzbe.datum_narudzbe", ">=", params.dateFrom);
      if (params.dateTo)
        QueryBuilder.andWhere("narudzbe.datum_narudzbe", "<=", params.dateTo);
    })
    .offset(params.offset)
    .limit(params.limit)
    .orderBy("narudzbe.datum_narudzbe", "desc");

  await knex.transaction(async (trx) => {
    for (let i = 0; i < result.length; i++) {
      const artikli = await knex("artikli_narudzbe")
        .select()
        .where("narudzba_id", "=", result[i].id)
        .transacting(trx);
      result[i].artikli = artikli;
    }
  });
  return result;
};

export const kreirajNarudzbu = async (params) => {
  let tsx;

  try {
    tsx = await knex.transaction();

    const [nardudzbaID] = await tsx("narudzbe")
      .insert({ user_id: params.user_id, ukupna_cijena: params.ukupna })
      .returning("id");

    console.log("narudzba_id: ", nardudzbaID);

    console.log("artikli", params.artikli);

    // Povezivanje narudzbe_id sa artiklima
    for (let i = 0; i < params.artikli.length; i++) {
      params.artikli[i].narudzba_id = nardudzbaID.id;
    }

    const addArtikli = await tsx("artikli_narudzbe").insert(params.artikli);

    for (let i = 0; i < params.artikli.length; i++) {
      console.log(params.artikli[i].naziv);
      console.log(params.artikli[i].cijena);
      // id artikla iz korpe //
      let id_artikla = await tsx("artikli")
        .select("id")
        .where("naziv", "=", params.artikli[i].naziv);

      console.log("asd", id_artikla);

      // Broj prodanih se update-a iz baze za vrijednost kolicine novog artikla iz korpe
      let artikal = await tsx("artikli")
        .select("broj_prodanih", "max_kolicina")
        .where("id", "=", id_artikla[0].id);

      let broj_prodanih = artikal[0].broj_prodanih + params.artikli[i].kolicina;
      let new_max = artikal[0].max_kolicina - params.artikli[i].kolicina;
      console.log(new_max);

      console.log("br_prodanih", broj_prodanih);

      await tsx("artikli").where({ id: id_artikla[0].id }).update({
        max_kolicina: new_max,
        broj_prodanih: broj_prodanih,
      });
    }

    const staraPotrosnja = await knex("users")
      .select("potrosen_novac")
      .where("id", "=", params.user_id);

    const updateUser = await knex("users")
      .update({
        potrosen_novac: staraPotrosnja[0].potrosen_novac + params.ukupna,
      })
      .where("id", "=", params.user_id);

    await tsx.commit();
  } catch (err) {
    if (tsx) await tsx.rollback();
    console.log(err);
    throw err;
  }
};

export const updateUserProfile = async (params) => {
  console.log(params);

  const { password, ...values } = params.values;

  console.log("values", values);

  const user = await knex("users").select().where("id", "=", params.id);

  const passwordCorrect = bcrypt.compareSync(password, user[0].password);
  if (passwordCorrect) {
    const result = await knex("users")
      .where("id", "=", params.id)
      .update(values);

    const updatedUser = await knex("users")
      .select()
      .where("id", "=", params.id);

    return updatedUser[0];
  }

  throw { message: "Pogresna sifra" };
};

export const changePassword = async (params) => {
  const [{ password }] = await knex("users")
    .select("password")
    .where("id", "=", params.userId);

  console.log(password);

  console.log(params.values.currentPassword);

  const isPasswordCorrect = bcrypt.compareSync(
    params.values.currentPassword,
    password
  );

  if (isPasswordCorrect) {
    const newPassword = bcrypt.hashSync(params.values.newPassword, 10);
    const result = await knex("users")
      .where("id", "=", params.userId)
      .update({ password: newPassword });

    return result;
  } else {
    throw { message: "Unijeli ste pogresnu trenutnu sifru!" };
  }
};
