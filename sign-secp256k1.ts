import credential from './certs/unsigned/cert-no-did.json';
import currentTime from './helpers/currentTime';
import signer from './helpers/signSecp256k1';
import writeFile from './helpers/writeFile';

async function signSecp256k1 () {
  credential.issuanceDate = currentTime();
  const signedCredential = await signer(credential);
  await writeFile(signedCredential, 'cert-secp256k1.json', 'certs/issuer-signed/');
}

signSecp256k1();
