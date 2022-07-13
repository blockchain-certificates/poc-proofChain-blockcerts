const { Ed25519Signature2020 } = require('@digitalbazaar/ed25519-signature-2020');
const jsigs = require('jsonld-signatures');
const {purposes: {AssertionProofPurpose}} = jsigs;
import generateSignerData from './generateSignerData';
import currentTime from './currentTime';
import generateDocumentLoader from './generateDocumentLoader';

export default async function signEd25519 (credential, keyPair = null, didDocument = null, documentLoader = generateDocumentLoader()) {
  if (!keyPair) {
    console.log('no keyPair provided, generating a new one');
    const signerData = await generateSignerData();
    keyPair = signerData.keyPair;
    didDocument = signerData.didDocument;
    credential.issuer = didDocument.id;
  }
  const suite = new Ed25519Signature2020({ key: keyPair });
  suite.date = currentTime();

  const signedCredential = await jsigs.sign(credential, {
    suite,
    purpose: new AssertionProofPurpose({ controller: didDocument }),
    documentLoader
  });
  console.log('credential signed', signedCredential.proof);
  return signedCredential;
}
