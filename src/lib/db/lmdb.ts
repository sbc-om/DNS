import { open, Database } from 'lmdb';
import path from 'path';

// Database instance
let db: Database | null = null;

export function getDatabase(): Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'lmdb');
    
    db = open({
      path: dbPath,
      compression: true,
      // Configure database settings
      encoding: 'msgpack', // MessagePack for efficient binary storage
    });
  }
  
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('exit', closeDatabase);
  process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
  });
}
