import { readFile } from 'fs/promises';
import { createSchema, dropSchema, end, query } from './lib/createdb.js';
import csvParser from 'csv-parser';
import { listImages, uploadImage } from '../utils/cloudinary.js';

const path = dirname(fileURLToPath(import.meta.url));
const imageCloudinaryUrl = new Map();


async function create() {
    const drop = await dropSchema();
  
    if (drop) {
      console.info('schema dropped');
    } else {
      console.info('schema not dropped, exiting');
      process.exit(-1);
    }
  
    const result = await createSchema();
  
    if (result) {
      console.info('schema created');
    } else {
      console.info('schema not created');
    }
  
    const data = await readFile('./sql/insert.sql');
    const insert = await query(data.toString('utf-8'));
  
    if (insert) {
      console.info('data inserted');
    } else {
      console.info('data not inserted');
    }
  
    await end();
  }
  
  create().catch((err) => {
    console.error('Error creating running setup', err);
  });