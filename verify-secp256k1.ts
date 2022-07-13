const jsigs = require('jsonld-signatures');
const {purposes: {AssertionProofPurpose}} = jsigs;
const didKeySecp256k1 = require('@transmute/did-key-secp256k1');
const { EcdsaSecp256k1VerificationKey2019 } = require('@bloomprotocol/ecdsa-secp256k1-verification-key-2019');
const { EcdsaSecp256k1Signature2019 } = require('@bloomprotocol/ecdsa-secp256k1-signature-2019');
import loadFileData from "./helpers/loadFileData";
import generateDocumentLoader from "./helpers/generateDocumentLoader";
import currentTime from "./helpers/currentTime";

async function verifyCredential () {
  const credential: any = loadFileData('certs/issuer-signed/cert-secp256k1.json');
  const { didDocument } = await didKeySecp256k1.resolve(credential.issuer);
  if (!didDocument) {
    throw new Error('Only did:key issuers are supported at this moment');
  }

  console.log('did document', didDocument);

  const verificationMethod = didDocument.verificationMethod
    .find(verificationMethod => verificationMethod.id === credential.proof.verificationMethod);

  console.log('verification method', verificationMethod);

  if (!verificationMethod) {
    throw new Error('The verification method of the document does not match the provided issuer.');
  }

  const verificationKey = await EcdsaSecp256k1VerificationKey2019.from({
    ...verificationMethod
  });

  console.log('verification key', verificationKey);

  if (verificationKey.revoked) {
    throw new Error('The verification key has been revoked');
  }

  const suite = new EcdsaSecp256k1Signature2019({ key: verificationKey });
  suite.date = currentTime();

  const verificationStatus = await jsigs.verify(credential, {
    suite,
    purpose: new AssertionProofPurpose(),
    documentLoader: generateDocumentLoader()
  });

  if (!verificationStatus.verified) {
    console.log(JSON.stringify(verificationStatus, null, 2));
    throw new Error('Error validating the revocation list credential proof');
  } else {
    console.log('Credential successfully verified');
  }
}

verifyCredential();
