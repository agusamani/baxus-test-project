import forge from 'node-forge';

interface MessageRecord {
  referenceId: string;
  signedMessage: string;
}

// Simple in-memory storage
const messageStore: Record<string, MessageRecord> = {};

export async function signMessageActivity(message: string, key: string): Promise<string> {
  const privateKey = forge.pki.privateKeyFromPem(key);
  const md = forge.md.sha256.create();
  md.update(message, 'utf8');
  const signature = privateKey.sign(md);
  return forge.util.encode64(signature);
}

export async function storeSignedMessage(referenceId: string, signedMessage: string): Promise<void> {
  messageStore[referenceId] = {
    referenceId,
    signedMessage,
  };
}

export async function retrieveSignedMessage(referenceId: string): Promise<string | null> {
  const record = messageStore[referenceId];
  return record ? record.signedMessage : null;
}
