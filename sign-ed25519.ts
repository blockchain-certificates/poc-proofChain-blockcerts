import credential from './certs/unsigned/cert-no-did.json';
import currentTime from './helpers/currentTime';
import signer from './helpers/signEd25519';
import writeFile from './helpers/writeFile';

async function signEd25519 () {
  credential.issuanceDate = currentTime();
  const signedCredential = await signer(credential);
  await writeFile(signedCredential, 'cert-ed25519.json', 'certs/issuer-signed/');
}

signEd25519();
