import credential from './certs/unsigned/cert-no-did.json';
import currentTime from './helpers/currentTime';
import signCredential from './helpers/signCredential';
import writeFile from './helpers/writeFile';

async function signByIssuer () {
  credential.issuanceDate = currentTime();
  const signedCredential = await signCredential(credential);
  await writeFile(signedCredential, 'cert-no-did.json', 'certs/issuer-signed/');
}

signByIssuer();
