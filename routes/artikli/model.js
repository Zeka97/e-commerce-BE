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
      "artikli.max_kolicina"
    )
    .innerJoin("kategorije as k", "artikli.kategorija_id", "k.id")
    .modify((QueryBuilder) => {
      if (params.searchValue)
        QueryBuilder.andWhereRaw("LOWER(artikli.naziv) like ?", [
          `%${params.searchValue}%`,
        ]);
      if (params.kategorija_id)
        QueryBuilder.andWhere("k.id", "=", params.kategorija_id);
      if (params.discount) QueryBuilder.andWhereNot("akcijska_cijena", null);
      if (params.popular)
        QueryBuilder.orderBy("broj_prodanih", "desc").where(
          "broj_prodanih",
          ">",
          0
        );
      if (params.priceRange)
        QueryBuilder.andWhereRaw(
          "(cijena >= ? and cijena <= ? or akcijska_cijena >= ? and akcijska_cijena <= ?)",
          [
            params.priceRange[0],
            params.priceRange[1],
            params.priceRange[0],
            params.priceRange[1],
          ]
        );
    })
    .limit(params.limit);
  return result;
};

export const getArticle = async (params) => {
  const result = await knex("artikli")
    .select(
      "artikli.id as id",
      "artikli.naziv as naziv",
      "artikli.photo as photo",
      "cijena",
      "max_kolicina",
      "akcijska_cijena",
      "k.naziv as kategorija_naziv",
      "artikli.visibility as visibility"
    )
    .innerJoin("kategorije as k", "artikli.kategorija_id", "k.id")
    .where("artikli.id", "=", params.id);

  return result;
};
