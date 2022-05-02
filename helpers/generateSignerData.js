const { Ed25519VerificationKey2020 } = require('@digitalbazaar/ed25519-verification-key-2020');
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();
import writeFile from './writeFile';

const DEFAULT_KEY_PAIR_FILE_NAME = 'keyPair.json';

export default async function generateSignerData () {
  const keyPair = await Ed25519VerificationKey2020.generate();
  const {didDocument} = await didKeyDriver.publicKeyToDidDoc({publicKeyDescription: keyPair});
  keyPair.controller = didDocument.id;
  keyPair.id = keyPair.controller + '#' + keyPair.publicKeyMultibase;
  await writeFile(keyPair, DEFAULT_KEY_PAIR_FILE_NAME, 'identity/');
  console.log('key pair generated:', keyPair);
  await writeFile(didDocument, 'did.json');
  console.log('did document generated:', didDocument);
  return { keyPair, didDocument };
}
