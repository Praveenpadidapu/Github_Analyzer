import { Pool } from 'pg';

// Avoid creating multiple connection pools in development
// when Next.js fast refreshes
const globalForPg = global as unknown as {
  pgPool: Pool | undefined;
};

const pool = globalForPg.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

export default pool;
