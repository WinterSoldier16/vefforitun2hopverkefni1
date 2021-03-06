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
    const q = `SELECT * FROM VORUR
    ORDER BY created ASC`

    try {
        const result = await query(q);

        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið allar vörur');
    }
}

export async function findVoruById(id) {
    const q = 'SELECT * FROM VORUR WHERE id = $1';
  
    try {
      const result = await query(q, [id]);
  
      if (result.rowCount === 1) {
        return result.rows[0];
      }
    } catch (e) {
      console.error('Gat ekki fundið voru eftir id');
    }
  
    return null;
}

export async function findVoruByCategory(category) {
    console.log(category);
    const q = `SELECT * FROM vorur WHERE flokkar = $1`;
  
    try {
      const result = await query(q, [category]);

      return result.rows;
    } catch (e) {
      console.error('Gat ekki fundið voru eftir flokki');
    } 
    return null;
}

export async function findVoruByQuery(search) {
    const q = `SELECT * FROM VORUR WHERE title LIKE $1 
    OR description LIKE $1
    `
    try {
      const result = await query(q, [search]);
  
      return result.rows;
    } catch (e) {
      console.error('Gat ekki fundið voru eftir leit');
    } 
    return null;
}

export async function findVoruByCatQue(category, search) {
    const q = `SELECT * FROM VORUR WHERE flokkar = $1
     AND (title LIKE $2 OR description LIKE $2)
    `
    try {
      const result = await query(q, [category, search]);
  
      
      return result.rows;
      
    } catch (e) {
      console.error('Gat ekki fundið voru eftir leit');
    } 
    return null;
}

export async function findAllVorurCat() {
    const q = `SELECT * FROM FLOKKUR`

    try {
        const result = await query(q);

        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið alla flokka');
    }
}

export async function findCatById(id) {
    const q = 'SELECT * FROM flokkur WHERE id = $1';
  
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

export async function createVoru(title, price, description, flokkar) {
    const q = `
      INSERT INTO
        vorur (title, price, description, flokkar)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
  
    try {
      const result = await query(q, [title, price, description, flokkar]);
      return result.rows[0];
    } catch (e) {
      console.error('Gat ekki búið til voru');
    }
  
    return null;
}

export async function updateVoru(id, title, price, description, flokkar) {
    const q = `
    UPDATE vorur 
    SET title = $2,
    price = $3,
    description = $4,
    flokkar = $6
    WHERE id = $1
    `
  
    try {
      const result = await query(q, [id, title, price, description, image, flokkar]);
      return result.rows[0];
    } catch (e) {
      console.error('Gat ekki breytt voru');
    }
}

export async function createCat(title) {
    const q = `
      INSERT INTO
        flokkur (title)
      VALUES ($1)
      RETURNING *
    `;
  
    try {
      const result = await query(q, [title]);
      return result.rows[0];
    } catch (e) {
      console.error('Gat ekki búið til flokk');
    }
  
    return null;
}

export async function updateCat(id, title) {
   
    const q2 = `
    UPDATE flokkur 
    SET title = $2
    WHERE id = $1
    `;
  
    try {
      const result2 = await query(q2, [id, title]);
      return result2.rows[0];
    } catch (e) {
      console.error('Gat ekki breytt flokk');
    }
}

export async function removeVoru(id) {
    const q = 'DELETE FROM vorur WHERE id = $1';
    try {
        const result = await query(q, [id]);
        return result.rows[0];
      } catch (e) {
        console.error('Gat ekki eytt vöru');
      }
}

export async function removeCat(id) {
  const q = 'DELETE FROM flokkur WHERE id = $1';
  try {
      const result = await query(q, [id]);
      return result.rows[0];
    } catch (e) {
      console.error('Gat ekki eytt vöru');
    }
}
