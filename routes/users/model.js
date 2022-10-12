import knex from "../../db.js";

export const listaNarudzbi = async (params) => {
  const result = await knex("narudzbe")
    .select()
    .where("user_id", "=", params.user_id);

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
  const result = await knex("narudzbe")
    .insert({ user_id: params.user_id, ukupna_cijena: params.ukupna })
    .returning("id");

  // Povezivanje narudzbe_id sa artiklima
  for (let i = 0; i < params.artikli.length; i++) {
    params.artikli[i].narudzba_id = result[0].id;
  }

  const addArtikli = await knex("artikli_narudzbe").insert(params.artikli);

  const staraPotrosnja = await knex("users")
    .select("potrosen_novac")
    .where("id", "=", params.user_id);

  const updateUser = await knex("users")
    .update({
      potrosen_novac: staraPotrosnja[0].potrosen_novac + params.ukupna,
    })
    .where("id", "=", params.user_id);

  return updateUser;
};
