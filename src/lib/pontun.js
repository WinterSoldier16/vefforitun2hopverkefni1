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

export async function findAllPontun() {
    const q = `SELECT * FROM pontun 
    ORDER BY created ASC`
    
    try {
        const result = await query(q);

        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið allar pantanir');
    }
}

export async function createPontun(id, name) {
    const uuid = uuidv4();
    const stada = "NEW";
    const q = 'SELECT idvara FROM linurkorfu WHERE idkarfa = $1';
    const q1 = 'SELECT price FROM karfa WHERE id = $1';
    const q2 = 'SELECT fjoldivara FROM linurkorfu WHERE idvara = $1';
    const q3 = `
    INSERT INTO pontun (id, name)
    VALUES ($1, $2)
    RETURNING id
    `;
    const q4 = `
    INSERT INTO linurpontun (idvara, idpontun, fjvara)
    VALUES ($1, $2, $3)
    `;
    const q5 = `
    INSERT INTO stadapontun (idpontun, stodurpontunar)
    VALUES ($1, $2)
    `;
    const q6 = 'SELECT idpontun, stodurpontunar FROM stadapontun WHERE id = $1';
    try {
        const result = await query(q, [id]);
        const result2 = await query(q2, [q]);
        const result3 = await query(q3, [uuid, name]);
        const result4 = await query(q4, [q, uuid, q2]);
        const result5 = await query(q5, [uuid, stada]);
        const finalresult = await query(q6, [uuid]);
        return finalresult.rows[0];

      } catch (e) {
        console.error('Gat ekki búið til pöntun');
      }
    
      return null;
    
}

export async function findPontunById(id) {
    const q = `SELECT p.id, p.price, p.created, p.name, l.idvara, l.fjvara, s.stodurpontunar
     FROM pontun p, linurpontun l, stadapontun s 
     WHERE id = $1;
     `;

    try {
        const result = await query(q, [id]);
    
        if (result.rowCount === 1) {
          return result.rows[0];
        }
      } catch (e) {
        console.error('Gat ekki fundið pontun eftir id');
      }
    
      return null;
}

export async function findPontunByIdStatus(id, status) {
    const q = 'SELECT * FROM stadapontun WHERE id = $1 AND stodurpontunar = $2';

    try {
        const result = await query(q, [id, status]);
        const stodur = ["NEW", "PREPARE", "COOKING", "READY", "FINISHED"];
        if (result.rowCount === 1) {
          const stadanuna = result.rows[0][1];
          return result.rows[0];
        }
      } catch (e) {
        console.error('Gat ekki fundið pontun eftir id og stöðu');
      }
    
      return null;
}