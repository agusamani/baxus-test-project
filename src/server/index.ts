import express from 'express';
import http from 'http';
import forge from 'node-forge';
import * as temporalClient from '../client';
import dotenv from 'dotenv';

const PORT = process.env.ENV || 3000;

dotenv.config();

const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

async function run() {
  const app = express();
  app.use(express.json());

  app.post('/', async (req, res) => {
    const { message, id } = req.body;

    if (!message || !id) return res.status(400).json({ error: 'Missing message or id' });

    try {
      await temporalClient.startSigningMessage(message, id, privateKey);
      return res.json({ ok: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  });

  app.get('/:referenceId', async (req, res) => {
    const { referenceId } = req.params;

    try {
      const result = await temporalClient.checkSigningMessageStatus(referenceId);
      res.send(result);
    } catch (error) {
      console.log('err', error);
      res.status(404).send({ status: 'In Progress or Not Found' });
    }
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.listen(PORT, resolve);
    server.once('error', reject);
  });

  console.log(`Listening on port ${PORT}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
