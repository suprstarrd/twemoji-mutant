const path = require('path');
const fs = require('fs');

const svgDir = path.join(__dirname, '../assets/svg/');

fs.readdir(svgDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    var regularPath = path.join(svgDir, file);
    var fe0fPath = path.join(svgDir, file.replace('.svg', '-fe0f.svg'));
    var fe0fFile = path.join(svgDir, file.replace('-fe0f-', ''));
    if (file.endsWith('.svg')) {
        if (fs.existsSync(fe0fPath)) {
            var regularMutant = fs.readFileSync(regularPath, 'utf-8').includes('Mutant Standard');
            var fe0fMutant = fs.readFileSync(fe0fPath, 'utf-8').includes('Mutant Standard')

            if (regularMutant && !fe0fMutant) fs.copyFileSync(regularPath, fe0fPath);
            if (fe0fMutant && !regularMutant) fs.copyFileSync(fe0fPath, regularPath);
            console.log('Fixed ' + file + ' and ' + file.replace('.svg', '-fe0f.svg'))
        }
        if (file.includes('-fe0f-') && fs.existsSync(fe0fFile)) {
            var regularMutant = fs.readFileSync(regularPath, 'utf-8').includes('Mutant Standard');
            var fe0flessMutant = fs.readFileSync(fe0fFile, 'utf-8').includes('Mutant Standard');

            if (regularMutant && !fe0flessMutant) fs.copyFileSync(regularPath, fe0fFile);
            if (fe0flessMutant && !regularMutant) fs.copyFileSync(fe0fFile, regularPath);
            console.log('Fixed ' + file + ' and ' + file.replace('-fe0f-', ''));
        }
    }
  });
});