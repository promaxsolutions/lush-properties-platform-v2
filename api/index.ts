import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Import your Express app
  const app = require('../server/index.ts');
  return app(req, res);
}