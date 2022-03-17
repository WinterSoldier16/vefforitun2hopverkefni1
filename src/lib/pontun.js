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
    INSERT INTO pontun (id, price, name)
    VALUES ($1, $2, $3)
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
    const q6 = 'SELECT idpontun, stodurpontunar FROM stadapontun WHERE idpontun = $1';
    try {
        const result = await query(q, [id]);
        const result1 = await query(q1, [id]);
        const result2 = await query(q2, [result.rows[0]['idvara']]);
        const result3 = await query(q3, [uuid,result1.rows[0]['price'], name]);
        const result4 = await query(q4, [result.rows[0]['idvara'], uuid, result2.rows[0]['fjoldivara']]);
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
     WHERE p.id = $1 AND l.idpontun = $1 AND s.idpontun = $1
     `;

    try {
        const result = await query(q, [id]);
    
        return result.rows[0];
        
      } catch (e) {

        console.error('Gat ekki fundið pontun eftir id');
      }
    
      return null;
}

export async function findPontunByIdStatus(uuid) {
    const q = 'SELECT * FROM stadapontun WHERE idpontun = $1';

    try {
        const result = await query(q, [uuid]);
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

export async function updatePontunIdStatus(uuid) {
    const q = 'SELECT stodurpontunar FROM stadapontun WHERE idpontun = $1';
    const q2 = 'UPDATE stadapontun SET stodurpontunar = $2 WHERE idpontun = $1';
    const stodur = ["NEW", "PREPARE", "COOKING", "READY", "FINISHED"];
    try {
        const result = await query(q, [uuid]);
        const stada = result.rows[0]['stodurpontunar'];
        let nystada; 
        for(let i = 0; i < 5; i++) {
            if(stada === stodur[i]) {
                nystada = stodur[i+1];
            }
        }
        const result2 = await query(q2, [uuid, nystada]);
        console.log(result2.rows[0]);
        return "Staða pöntunar hefur verið uppfærð";
    } catch (e) {
        console.error('Gat ekki uppfært stöðu pontunar');
    }
}