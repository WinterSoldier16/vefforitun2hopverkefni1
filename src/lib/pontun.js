import pg from 'pg';
import dotenv from 'dotenv';

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

export async function findAllVorur() {
    const q = `SELECT * FROM pontun 
    ORDER BY created ASC`
    
    try {
        const result = await query(q);

        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið allar pantanir');
    }
}

export async function createPontun(id) {
    const uuid 
    const q = `SELECT idvara FROM linurkorfu WHERE idkarfa = $1`
    const d = 'SELECT '
    
}

export async function findPontunById(id) {
    const q = 'SELECT * FROM pontun WHERE id = $1';

    try {
        const result = await query(q, [id]);
    
        if (result.rowCount === 1) {
          return result.rows[0];
        }
      } catch (e) {
        console.error('Gat ekki fundið flokk eftir id');
      }
    
      return null;
}

// export async function findPontunByIdStatus(id, status) {
//     const q = 'SELECT * FROM '
// }