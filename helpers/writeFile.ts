const fs = require('fs');
import getDefaultFilePath from './getDefaultFilePath';
import prettyFormat from './prettyFormat';


export default async function writeFile (fileContent, fileName, directory) {
  const outputPath = getDefaultFilePath(directory + fileName);
  await fs.writeFile(outputPath, prettyFormat(fileContent), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`file saved to file ${outputPath}`);
  });
}
