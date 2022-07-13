const { EcdsaSecp256k1Signature2019 } = require('@bloomprotocol/ecdsa-secp256k1-signature-2019');
const jsigs = require('jsonld-signatures');
const {purposes: {AssertionProofPurpose}} = jsigs;
import generateSignerData, {SupportedSuites} from './generateSignerData';
import currentTime from './currentTime';
import generateDocumentLoader from './generateDocumentLoader';

export default async function signSecp256k1 (credential, keyPair = null, didDocument = null, documentLoader = generateDocumentLoader()) {
  if (!keyPair) {
    console.log('no keyPair provided, generating a new one');
    const signerData = await generateSignerData(SupportedSuites.secp256k1);
    keyPair = signerData.keyPair;
    console.log('before sign', keyPair);
    didDocument = signerData.didDocument;
    credential.issuer = didDocument.id;
  }
  const suite = new EcdsaSecp256k1Signature2019({ key: keyPair });
  suite.date = currentTime();

  const signedCredential = await jsigs.sign(credential, {
    suite,
    purpose: new AssertionProofPurpose({ controller: didDocument }),
    documentLoader
  });
  console.log('credential signed', signedCredential.proof);
  return signedCredential;
}
