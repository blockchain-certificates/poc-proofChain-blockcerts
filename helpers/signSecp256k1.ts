import writeFile from "./writeFile";

const { EcdsaSecp256k1Signature2019 } = require('@bloomprotocol/ecdsa-secp256k1-signature-2019');
const jsigs = require('jsonld-signatures');
const {purposes: {AssertionProofPurpose}} = jsigs;
import generateSignerData, {SupportedSuites} from './generateSignerData';
import currentTime from './currentTime';
import generateDocumentLoader from './generateDocumentLoader';
import issuerProfile from '../identity/issuer-blockcerts.json';

export default async function signSecp256k1 (credential, keyPair = null, didDocument = null, documentLoader = generateDocumentLoader()) {
  if (!keyPair) {
    console.log('no keyPair provided, generating a new one');
    const signerData = await generateSignerData(SupportedSuites.secp256k1);
    keyPair = signerData.keyPair;
    console.log('before sign', keyPair);
    didDocument = signerData.didDocument;
    credential.issuer = issuerProfile.id;
    const keyId = 'secp256k1-verification-public-key'
    keyPair.id = `${issuerProfile.id}#${keyId}`;
    keyPair.controller = issuerProfile.id;
    const verificationMethod = JSON.parse(JSON.stringify(didDocument.verificationMethod[0]))
    verificationMethod.id = keyId;
    verificationMethod.controller = issuerProfile.id;
    issuerProfile.verificationMethod.push(verificationMethod);

    await writeFile(issuerProfile, 'issuer-blockcerts.json', 'identity/');
  }
  const suite = new EcdsaSecp256k1Signature2019({ key: keyPair });
  suite.date = currentTime();

  const signedCredential = await jsigs.sign(credential, {
    suite,
    purpose: new AssertionProofPurpose({ controller: issuerProfile }),
    documentLoader
  });
  console.log('credential signed', signedCredential.proof);
  return signedCredential;
}
