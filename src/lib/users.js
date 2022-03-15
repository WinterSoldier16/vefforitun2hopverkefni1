import bcrypt from 'bcrypt';
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

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

export async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await query(q, [username]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir notendnafni');
    return null;
  }

  return false;
}

export async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error('Gat ekki fundið notanda eftir id');
  }

  return null;
}

export async function createUser(name, username, password, admin) {
    // Geymum hashað password!
    const hashedPassword = await bcrypt.hash(password, 11);
  
    const q = `
      INSERT INTO
        users (name, username, password, admin)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
  
    try {
      const result = await query(q, [name, username, hashedPassword, admin]);
      return result.rows[0];
    } catch (e) {
      console.error('Gat ekki búið til notanda');
    }
  
    return null;
  }

export async function findAllUsers() {
    const q = 'SELECT * FROM USERS';

    try {
        const result = await query(q);

        return result.rows;
    } catch (e) {
        console.error('Gat ekki fundið alla notendur');
    }
}

export async function updatePassword(id, password) {
  const hashedPassword = await bcrypt.hash(password, 11);
  const q = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    `

  try {
    const result = await query(q, [hashedPassword, id]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki breytt lykilorði');
  }
}

export async function updateUsername(id, username) {
  const q = `
  UPDATE users
  SET username = $1
  WHERE id = $2
  `

  try {
    const result = await query(q, [username, id]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki breytt notandanafni');
  }
}

export async function updateAdmin(id) {
  const q = `
  UPDATE users
  SET admin = NOT admin
  WHERE id = $1
  `

  try {
    const result = await query(q, [id]);
    return result.rows[0];
  } catch (e) {
    console.error('Gat ekki uppfært admin réttindi');
  }
}