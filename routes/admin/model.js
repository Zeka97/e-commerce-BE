import knex from "../../db.js";

export const getAllTransactions = async (params) => {
  console.log("params", params);
  const result = await knex("narudzbe")
    .select(
      "narudzbe.id as id",
      "user_id",
      "datum_narudzbe",
      "ukupna_cijena",
      "u.email",
      "u.adresa",
      "u.telefon",
      "u.grad",
      knex.raw("concat(u.ime,' ',u.prezime) as ime_i_prezime")
    )
    .innerJoin("users as u", "u.id", "narudzbe.user_id")
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
  console.log(result);
  return result;
};

export const changeArticleVisibility = async (params) => {
  const result = await knex("artikli")
    .update({ visibility: !params.visibility })
    .where("id", "=", params.id);

  return result;
};

export const setArticleOutOfStock = async (params) => {
  const result = await knex("artikli")
    .update({ max_kolicina: 0 })
    .where("id", "=", params.id);

  return result;
};
