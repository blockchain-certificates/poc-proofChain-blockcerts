import { securityLoader } from '@digitalbazaar/security-document-loader';
import blockcertsContextV3 from '../contexts/blockcerts-v3.json';
import blockcertsContextV31 from '../contexts/blockcerts-v3.1.json';
import merkleProof2019Context from '../contexts/merkle-proof-2019.json';
import chainedProof2021Context from '../contexts/chained-proof-2021.json';

interface DocumentsToPreloadMap {
  [url: string]: any; // any being a context document or did document
}

export default function generateDocumentLoader (documentsToPreload: DocumentsToPreloadMap[] = []) {
  const documentLoader = securityLoader();
  documentsToPreload.forEach(document => {
    const key = Object.keys(document)[0];
    console.log('adding to document loader', key, document[key]);
    documentLoader.addStatic(key, document[key]);
  });
  documentLoader.addStatic('https://w3id.org/blockcerts/v3', blockcertsContextV3);
  documentLoader.addStatic('https://w3id.org/security/suites/merkle-2019/v1', merkleProof2019Context);
  documentLoader.addStatic('https://w3id.org/security/suites/chained-2021/v1', chainedProof2021Context);
  documentLoader.addStatic('https://w3id.org/blockcerts/v3.1', blockcertsContextV31);
  return documentLoader.build();
}
