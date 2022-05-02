import { securityLoader } from '@digitalbazaar/security-document-loader';
import blockcertsContext from '../contexts/blockcerts-v3.json';

export default function generateDocumentLoader () {
  const documentLoader = securityLoader();
  documentLoader.addStatic('https://w3id.org/blockcerts/v3', blockcertsContext);
  return documentLoader.build();
}
