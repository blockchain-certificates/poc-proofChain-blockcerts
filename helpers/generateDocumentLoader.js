import { securityLoader } from '@digitalbazaar/security-document-loader';

export default function generateDocumentLoader () {
  const documentLoader = securityLoader();
  // example add context
  // documentLoader.addStatic('https://w3id.org/vc-revocation-list-2020/v1', revocationList2020Context);
  return documentLoader.build();
}
