import knex from "../../db.js";

export const getAllArticles = async (params) => {
  const result = await knex("artikli")
    .select(
      "artikli.id",
      "artikli.naziv",
      "artikli.kategorija_id",
      "artikli.photo",
      "artikli.cijena",
      "artikli.akcijska_cijena",
      "artikli.kolicina as max_kolicina"
    )
    .innerJoin("kategorije as k", "artikli.kategorija_id", "k.id")
    .modify((QueryBuilder) => {
      if (params.searchValue)
        QueryBuilder.andWhereRaw("LOWER(artikli.naziv) like ?", [
          `%${params.searchValue}%`,
        ]);
      if (params.kategorija_id)
        QueryBuilder.andWhere("k.id", "=", params.kategorija_id);
      if (params.discount) QueryBuilder.whereNotNull("akcijska_cijena");
      if (params.popular) QueryBuilder.orderBy("broj_prodanih", "desc");
    })
    .limit(params.limit);
  return result;
};
