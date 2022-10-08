const bcrypt = require("bcrypt");

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  max: 3,
  min: 0,
  idle: 10000,
});

exports.userQueries = {
  getAllUsers: (req, res, next) => {
    pool.query("select * from users", (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      req.users = result.rows;
      next();
    });
  },
  getOneUser: (req, res, next) => {
    pool.query(
      "select * from users where id = $1",
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        req.user = result.rows;
        next();
      }
    );
  },
  deleteUser: (req, res, next) => {
    pool.query(
      "delete from users where id = $1",
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        next();
      }
    );
  },
  updateUser: (req, res, next) => {
    pool.query(
      "update users set ime = $1, prezime=$2, grad=$3, telefon=$4, adresa=$5 where id = $6",
      [
        req.body.ime,
        req.body.prezime,
        req.body.grad,
        req.body.telefon,
        req.body.adresa,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        next();
      }
    );
  },
};

exports.artikliQueries = {
  getAllArticles: (req, res, next) => {
    if (!req.query.searchValue) req.query.searchValue = "";
    pool.query(
      `select artikli.id as artikal_id, artikli.naziv as naziv,k.id as k_id,k.naziv as kategorija_naziv,artikli.photo,ad.cijena,sum(ad.kolicina) as max_kolicina from artikli
      inner join artikli_details ad on artikli.id = ad.id
      inner join kategorije k on artikli.kategorija_id = k.id
      where LOWER(artikli.naziv) like '%${req.query.searchValue.toLowerCase()}%'
  group by  ad.id, artikli.id, ad.cijena, k.id, artikli.photo, k.naziv, artikli.naziv;`,
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        req.artikli = result.rows;
        next();
      }
    );
  },
  getOneArticle: (req, res, next) => {
    pool.query("select * from artikli where id=$1", (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      req.artikal = result.rows;
      next();
    });
  },
  getOneCategoryArticles: (req, res, next) => {
    console.log(req);
    pool.query(
      `select artikli.id as artikal_id, artikli.naziv as naziv,k.id as k_id,k.naziv as kategorija_naziv,artikli.photo,ad.cijena,sum(ad.kolicina) as max_kolicina from artikli
      inner join artikli_details ad on artikli.id = ad.id
      inner join kategorije k on artikli.kategorija_id = k.id
      where LOWER(artikli.naziv) like '%${req.query.searchValue.toLowerCase()}% AND k.id = $1'
  group by  ad.id, artikli.id, ad.cijena, k.id, artikli.photo, k.naziv, artikli.naziv;`,
      [req.params.id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        req.artikli = result.rows;
        next();
      }
    );
  },
};

exports.kategorijeQueries = {
  getAllCategories: (req, res, next) => {
    pool.query("select * from kategorije", (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      req.kategorije = result.rows;
      next();
    });
  },
};

exports.AuthentificateQueries = {
  userLogin: (req, res, next) => {
    pool.query(
      "select * from users where username = $1",
      [req.body.username],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        if (!result.rows.length) {
          req.user = null;
        } else {
          if (bcrypt.compareSync(req.body.password, result.rows[0].password)) {
            req.user = result.rows[0];
          } else {
            req.user = null;
          }
        }
        next();
      }
    );
  },
  adminLogin: (req, res, next) => {
    pool.query(
      "select * from admin where username = $1 and password = $2",
      [req.body.username, req.body.password],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        if (!result.rows.length) {
          req.admin = null;
        } else req.admin = result.rows[0];
        next();
      }
    );
  },
  checkUsernameAndEmail: (req, res, next) => {
    pool.query(
      "select * from users where username = $1 or email = $2",
      [req.body.username, req.body.email],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }
        if (result.rows.length) {
          return res.json({
            message: "Postoji user sa tom sifrom ili email-om",
          });
        }
        next();
      }
    );
  },
  registrujUsera: (req, res, next) => {
    let hash = bcrypt.hashSync(req.body.password, 10);
    pool.query(
      "insert into users(ime, prezime, email, username, password, grad, telefon, adresa) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        req.body.ime,
        req.body.prezime,
        req.body.email,
        req.body.username,
        hash,
        req.body.grad,
        req.body.brojtelefona,
        req.body.adresa,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        next();
      }
    );
  },
};

exports.narudzbeQueries = {
  kreirajNarudzbu: (req, res, next) => {
    pool.query(
      "insert into narudzbe(user_id,ukupna_cijena) values ($1,$2) RETURNING id",
      [req.body.user, req.body.ukupna],
      (err, result) => {
        if (err) {
          return res.json(err);
        }
        req.narudzba_id = result.rows[0].id;
        next();
      }
    );
  },
  dodajArtikleUNarudzbu: (req, res, next) => {
    let query = `insert into artikli_narudzbe(naziv,kolicina,cijena,narudzba_id) values`;

    for (let i = 0; i < req.body.artikli.length - 1; i++) {
      query +=
        "(" +
        `'${req.body.artikli[i].naziv}'` +
        "," +
        req.body.artikli[i].kolicina +
        "," +
        req.body.artikli[i].cijena +
        "," +
        req.narudzba_id +
        "),";
    }
    query +=
      "(" +
      `'${req.body.artikli[req.body.artikli.length - 1].naziv}'` +
      "," +
      req.body.artikli[req.body.artikli.length - 1].kolicina +
      "," +
      req.body.artikli[req.body.artikli.length - 1].cijena +
      "," +
      req.narudzba_id +
      ")";
    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      pool.query(
        "update users set ukupna_potrosnja = $1::decimal where id = $2",
        [req.body.ukupna, req.body.user],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          next();
        }
      );
    });
  },
  getNarudzbe: (req, res, next) => {
    pool.query(
      "select * from narudzbe where user_id = $1",
      [req.query.user],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        req.narudzbe = result.rows;
        next();
      }
    );
  },
  getArtikliNarudzbe: async (req, res, next) => {
    const client = await pool.connect();

    try {
      client.query("BEGIN");
      const query = "select * from artikli_narudzbe where narudzba_id = $1";
      for (let i = 0; i < req.narudzbe.length; i++) {
        const res = await client.query(query, [req.narudzbe[i].id]);
        req.narudzbe[i].artikli = res.rows;
      }
    } catch (e) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
    next();
  },
};
