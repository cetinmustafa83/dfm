import { Level } from 'level';
import { join } from 'path';

// Specify key type (string) and value type (any, as values are JSON objects)
const dbPath = join(process.cwd(), 'data', 'dfmsolutions-db');
const db = new Level<string, any>(dbPath, { valueEncoding: 'json' });

export default db;