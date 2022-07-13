import credential from './certs/unsigned/cert-no-did.json';
import currentTime from './helpers/currentTime';
import signCredential from './helpers/signCredential';
import writeFile from './helpers/writeFile';

async function signEcdsa25519 () {
  credential.issuanceDate = currentTime();
  const signedCredential = await signCredential(credential);
  await writeFile(signedCredential, 'cert-ecdsa25519.json', 'certs/issuer-signed/');
}

signEcdsa25519();
