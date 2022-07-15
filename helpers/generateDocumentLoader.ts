import { securityLoader } from '@digitalbazaar/security-document-loader';
import blockcertsContext from '../contexts/blockcerts-v3.json';

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
  documentLoader.addStatic('https://w3id.org/blockcerts/v3', blockcertsContext);
  return documentLoader.build();
}
