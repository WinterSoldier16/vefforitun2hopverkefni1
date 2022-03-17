import pg from 'pg';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(q, values = []) {
  const client = await pool.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    console.error('Villa í query', err);
    throw err;
  } finally {
    client.release();
  }

  return result;
}

export async function createCart() {
  const q = `
    INSERT INTO
    karfa (id, price)
    VALUES ($1, $2)
    RETURNING *
  `;

  const uuid = uuidv4();
  console.log(uuid);

  try {
    const result = await query(q, [uuid, 0]);
    console.log(result.rows[0]);
    return result.rows[0]['id'];
  } catch (e) {
    console.error('Gat ekki búið til körfu')
  }
}

export async function getCartByID(uuid) {
  const q = `SELECT linurkorfu.idvara, vorur.title, linurkorfu.fjoldivara, karfa.price
            FROM linurkorfu WHERE idkarfa = $1
            INNER JOIN vorur ON vorur.id = linurkorfu.idvara
            INNER JOIN karfa ON karfa.id = linurkorfu.idvara`;

  try {
    const result = await query(q, [uuid]);
    return result;
  } catch (e) {
    console.error('Gat ekki fundið línur í körfu');
  }
}

// DO NOT TOUCH!
export async function getCartTotalPrice(uuid) {
  const q = 'SELECT idvara FROM linurkorfu WHERE idkarfa = $1 ORDER BY idvara ASC';

  try {
    const vorur = await query(q, [uuid]);
    const q2 = 'SELECT fjoldivara FROM linurkorfu WHERE idkarfa = $1 ORDER BY idvara ASC';
    try {
      const fjoldiVara = await query(q2, [uuid]);
      let totalPrice = 0;
      for (let i = 0; i < vorur.rowCount; i++) {
        const voruID = vorur.rows[i]['idvara'];
        const fjoldiVoru = parseInt(fjoldiVara.rows[i]['fjoldivara']);
        const q3 = 'SELECT price FROM vorur WHERE id = $1';
        try {
          const price = await query(q3, [parseInt(voruID)])
          totalPrice += fjoldiVoru * parseInt(price.rows[0]['price']);
        } catch (e) {
          console.error('Gat ekki fundið verð á vöru');
        }
      }
      return totalPrice;
    } catch (e) {
      console.error('Gat ekki fundið fjölda vara');
    }
  } catch (e) {
    console.error('Gat ekki fundið auðkenni vara í körfu');
  }
}

// DO NOT TOUCH!
export async function addToCart(idvara, cartid, fjoldivara) {
  const q = `
  INSERT INTO 
    linurkorfu (idvara, idkarfa, fjoldivara)
  VALUES ($1, $2, $3)
  RETURNING *
  `;

  const q2 = `UPDATE karfa
              SET price = $1
              WHERE id = $2
              RETURNING *`;

  try {
    const result = await query(q, [idvara, cartid, fjoldivara]);
    const price = await getCartTotalPrice(cartid);
    const result2 = await query(q2, [price, cartid]);
    return result2.rows[0]['id'];
  } catch (e) {
    console.error('Gat ekki sett vöru í körfu');
  }
}

export async function deleteCart(idKorfu) {
  const q = `DELETE FROM linurkorfu WHERE idkarfa = $1`;
  const q2 = 'DELETE FROM karfa WHERE id = $1'

  try {
    const deleteLine = await query(q, [idKorfu]);
  } catch (e) {
    console.error('Gat ekki eytt körfu úr linurkorfu');
  }

  try {
    const deleteCart = await query(q, [idKorfu]);
    return deleteCart;
  } catch (e) {
    console.error('Gat ekki eytt körfu úr karfa');
  }
}