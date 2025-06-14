import moment from "moment";
import knex from "../../db.js";
import {
  uploadFile,
  saveBase64Image,
  deleteImage,
} from "../../utils/fileUpload.js";
import path from "path";

export const getAllTransactions = async (params) => {
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
  return result;
};

export const changeArticleVisibility = async (params) => {
  const result = await knex("artikli")
    .update({ visibility: !params.visibility })
    .where("id", "=", params.id);

  return result;
};

export const deleteArticle = async (id) => {
  await knex("artikli").del().where("id", "=", id);
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
  console.log(params);
  try {
    const updateData = {
      naziv: params.articleName,
      cijena: params.articlePrice,
      max_kolicina: params.articleQuantity,
      description: params.articleDescription,
      kategorija_id: params.articleCategory,
    };

    // If there's a new photo in base64 format
    if (params.articlePhoto && params.articlePhoto.startsWith("data:image")) {
      const filename = `articlePhoto-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.png`;
      const photoPath = await saveBase64Image(params.articlePhoto, filename);
      updateData.photo = photoPath;
    } else if (!params.articlePhoto) {
      const [image] = await knex("artikli")
        .select("photo")
        .where("id", "=", params.id);
      if (image.photo) {
        await deleteImage(image.photo);
        await knex("artikli")
          .update({ photo: null })
          .where("id", "=", params.id);
      }
    }

    const result = await knex("artikli")
      .update(updateData)
      .where("id", "=", params.id);

    return result;
  } catch (error) {
    throw error;
  }
};

export const addNewCategory = async (params) => {
  console.log(params);
  if (
    params.categoryPicture &&
    params.categoryPicture.startsWith("data:image")
  ) {
    const filename = `categoryPhoto-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;
    const photoPath = await saveBase64Image(params.categoryPicture, filename);
    params.categoryPicture = photoPath;
  }
  const result = await knex("kategorije").insert({
    naziv: params.categoryName,
    photo: params.categoryPicture,
  });

  return result;
};

export const updateCategory = async (params) => {
  console.log("asd", params);
  if (
    params.categoryPicture &&
    params.categoryPicture.startsWith("data:image")
  ) {
    const filename = `categoryPhoto-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.png`;
    const photoPath = await saveBase64Image(params.categoryPicture, filename);
    params.categoryPicture = photoPath;
  } else if (!params.categoryPicture) {
    const [image] = await knex("kategorije")
      .select("photo")
      .where("id", "=", params.id);
    if (image.photo) {
      await deleteImage(image.photo);
      await knex("kategorije")
        .update({ photo: null })
        .where("id", "=", params.id);
    }
  }
  const result = await knex("kategorije")
    .update({
      naziv: params.categoryName,
      photo: params.categoryPicture,
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

export const getUserDetails = async (id) => {
  const [user] = await knex("users").select().where("id", "=", id);
  const [ordersNumber] = await knex("narudzbe")
    .count("*")
    .where("user_id", "=", id);

  return { ...user, ordersNumber: ordersNumber.count };
};

export const getStatistic = async () => {
  const currentDate = moment().startOf("month").format("YYYY-MM-DD");

  const [totalEarnings] = await knex("narudzbe").sum("ukupna_cijena");
  const [totalNumberOfUsers] = await knex("users").count("*");
  const [totalNumberOfTransactions] = await knex("narudzbe").count("*");

  const [thisMonthEarnings] = await knex("narudzbe")
    .sum("ukupna_cijena")
    .where("datum_narudzbe", ">=", currentDate);

  const [thisMonthNewUsers] = await knex("users")
    .count("*")
    .where("createdat", ">=", currentDate);
  const [thisMonthNumberOfTransactions] = await knex("narudzbe")
    .count("*")
    .where("datum_narudzbe", ">=", currentDate);

  const lastMonth = moment()
    .subtract(1, "months")
    .startOf("month")
    .format("YYYY-MM-DD");

  const [lastMonthEarnings] = await knex("narudzbe")
    .sum("ukupna_cijena")
    .whereBetween("datum_narudzbe", [lastMonth, currentDate]);
  const [lastMonthNewUsers] = await knex("users")
    .count("*")
    .whereBetween("createdat", [lastMonth, currentDate]);
  const [lastMonthNumberOfTransactions] = await knex("narudzbe")
    .count("*")
    .whereBetween("datum_narudzbe", [lastMonth, currentDate]);

  let lastMonthEarningsPercentage = 0;
  let lastMonthNewUsersPercentage = 0;
  let lastMonthNumberOfTransactionsPercentage = 0;

  // Only calculate percentages if there was activity last month
  if (lastMonthEarnings.sum > 0) {
    lastMonthEarningsPercentage =
      ((thisMonthEarnings.sum - lastMonthEarnings.sum) /
        lastMonthEarnings.sum) *
      100;
  }

  if (lastMonthNewUsers.count > 0) {
    lastMonthNewUsersPercentage =
      ((thisMonthNewUsers.count - lastMonthNewUsers.count) /
        lastMonthNewUsers.count) *
      100;
  }

  if (lastMonthNumberOfTransactions.count > 0) {
    lastMonthNumberOfTransactionsPercentage =
      ((thisMonthNumberOfTransactions.count -
        lastMonthNumberOfTransactions.count) /
        lastMonthNumberOfTransactions.count) *
      100;
  }

  return {
    totalEarnings: totalEarnings.sum || 0,
    numberOfUsers: totalNumberOfUsers.count || 0,
    numberOfTransactions: totalNumberOfTransactions.count || 0,
    lastMonthEarningsPercentage: lastMonthEarningsPercentage.toFixed(2),
    lastMonthNewUsersPercentage: lastMonthNewUsersPercentage.toFixed(2),
    lastMonthNumberOfTransactionsPercentage:
      lastMonthNumberOfTransactionsPercentage.toFixed(2),
  };
};

export const addArticle = async (params) => {
  await knex("artikli").insert({
    naziv: params.articleName,
    kategorija_id: params.articleCategory,
    photo: params.articlePhoto,
    cijena: params.articlePrice,
    max_kolicina: params.articleQuantity,
    description: params.articleDescription,
  });
};
