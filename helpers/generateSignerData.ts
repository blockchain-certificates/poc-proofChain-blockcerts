const { Ed25519VerificationKey2020 } = require('@digitalbazaar/ed25519-verification-key-2020');
const { EcdsaSecp256k1VerificationKey2019 } = require('@bloomprotocol/ecdsa-secp256k1-verification-key-2019');
const didKeyDriver = require('@digitalbazaar/did-method-key').driver();
const didKeySecp256k1 = require('@transmute/did-key-secp256k1');
import crypto from 'crypto';
import writeFile from './writeFile';

export enum SupportedSuites {
  ed25519 = 'ed25519',
  secp256k1 = 'secp256k1'
}

const VerificationKeyMap = {
  [SupportedSuites.ed25519]: Ed25519VerificationKey2020,
  [SupportedSuites.secp256k1]: EcdsaSecp256k1VerificationKey2019
};

export default async function generateSignerData (type: SupportedSuites) {
  let keyPair;
  let didKey;
  let didDocument;
  if (type === SupportedSuites.ed25519) {
    keyPair = await Ed25519VerificationKey2020.generate({})
    didKey = await didKeyDriver.publicKeyToDidDoc({publicKeyDescription: keyPair});
    didDocument = didKey.didDocument;
    keyPair.controller = didDocument.id;
    keyPair.id = keyPair.controller + '#' + keyPair.publicKeyMultibase;
  }

  if (type === SupportedSuites.secp256k1) {
    const seed = crypto.randomBytes(32);
    keyPair = await EcdsaSecp256k1VerificationKey2019.generate({
      seed
    })
    didKey = await didKeySecp256k1.generate({
      secureRandom: () => seed
    });
    didDocument = didKey.didDocument;
    keyPair.controller = didDocument.id;
    keyPair.id = didDocument.verificationMethod[0].id;
  }

  await writeFile(keyPair, `keyPair-${type}.json`, 'identity/');
  console.log('key pair generated:', keyPair);
  await writeFile(didDocument, `did-${type}.json`, 'identity/');
  console.log('did document generated:', didDocument);
  return { keyPair, didDocument };
}
