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
      if (params.customer) {
        const customer = params.customer.split(" ");
        if (customer[0]) {
          QueryBuilder.andWhereRaw("upper(u.ime) LIKE ?", [
            `%${customer[0].toUpperCase()}%`,
          ]);
        }
        if (customer[1]) {
          QueryBuilder.andWhereRaw("upper(u.prezime) LIKE ?", [
            `%${customer[1].toUpperCase()}`,
          ]);
        }
      }
      if (params.city) {
        QueryBuilder.andWhereRaw("upper(u.grad) LIKE ?", [
          `%${params.city.toUpperCase()}%`,
        ]);
      }
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

export const updateArticleDiscountPrice = async (params) => {
  const result = await knex("artikli")
    .update({ akcijska_cijena: params.discount })
    .where("id", "=", params.id);

  return result;
};

export const removeArticleDiscountPrice = async (params) => {
  const result = await knex("artikli")
    .update({ akcijska_cijena: null })
    .where("id", "=", params.id);

  return result;
};

export const editArticle = async (params) => {
  const result = await knex("artikli")
    .update({
      naziv: params.values.articleName,
      cijena: params.values.articlePrice,
      max_kolicina: params.values.articleQuantity,
      description: params.values.articleDescription,
    })
    .where("id", "=", params.id);

  return result;
};

export const addNewCategory = async (params) => {
  const result = await knex("kategorije").insert({
    naziv: params.categoryName,
    photo: params.categoryPicture,
  });

  return result;
};

export const updateCategory = async (params) => {
  const result = await knex("kategorije")
    .update({
      naziv: params.values.categoryName,
      photo: params.values.categoryPicture,
    })
    .where("id", "=", params.id);

  return result;
};

export const getAllUsers = async (params) => {
  const result = await knex("users")
    .select(
      "id",
      "email",
      "username",
      "potrosen_novac",
      "block_timestamp",
      "blocked_forever",
      "createdat",
      "slika",
      "grad",
      "telefon",
      "adresa",
      knex.raw("CONCAT(ime,' ',prezime) as ime_i_prezime")
    )
    .offset(params.offset)
    .limit(params.limit);
  return result;
};
