const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const svgDir = path.join(__dirname, '../assets/svg/');
const pngDir = path.join(__dirname, '../assets/72x72/');

fs.readdir(svgDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.endsWith('.svg')) {
      const svgPath = path.join(svgDir, file);
      const pngPath = path.join(pngDir, file.replace('.svg', '.png'));

      sharp(svgPath)
        .resize(72, 72)
        .toFormat('png')
        .toFile(pngPath)
        .then(() => console.log(`Converted ${file} to PNG`))
        .catch(err => console.error(`Error converting ${file}: ${err}`));
    }
  });
});