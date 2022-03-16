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
      karfa (id)
    VALUES ($1)
    RETURNING *
  `;

  const uuid = uuidv4();

  try {
    const result = await query(q, [uuid]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki búið til körfu')
  }
}

export async function getCartByID(uuid) {
  const q = `SELECT * FROM linurkorfu WHERE idkarfa = $1`;

  try {
    const result = await query(q, [uuid]);
    return result;
  } catch (e) {
    console.error('Gat ekki fundið línur í körfu');
  }
}

export async function getCartTotalPrice(uuid) {
  const q = 'SELECT idvara FROM linurkorfu WHERE idkarfa = $1 ORDER BY idvara ASC';

  try {
    const vorur = await query(q, [uuid]);
    const q2 = 'SELECT fjoldivara FROM linurkorfu WHERE idkarfa = $1 ORDER BY idvara ASC';
    try {
      const fjoldi_vara = await query(q2, [uuid]);
      let total_price = 0;
      for (let i = 0; i < vorur.rowCount; i++) {
        let voruID = vorur.rows[i];
        let fjoldi_voru = fjoldi_vara[i];
        const q3 = 'SELECT price FROM vorur WHERE id = $1'
        try {
          let price = await query(q3, [voruID])
          total_price += fjoldi_voru * price.rows[0];
        } catch (e) {
          console.error('Gat ekki fundið verð á vöru');
        }
      }
    } catch (e) {
      console.error('Gat ekki fundið fjölda vara');
    }
  } catch (e) {
    console.error('Gat ekki fundið auðkenni vara í körfu');
  }
}

