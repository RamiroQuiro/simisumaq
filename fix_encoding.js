const fs = require('fs');
const path = require('path');

const directoryPath = 'e:\\ramaCode\\simisumaq\\src';

const replacements = {
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í', 
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã±': 'ñ',
  'Ã ': 'Á',
  'Ã‰': 'É',
  'Ã': 'Í',
  'Ã“': 'Ó',
  'Ãš': 'Ú',
  'Ã‘': 'Ñ',
  'Ã¼': 'ü',
  'Ã\x9C': 'Ü',
};

function walkSync(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    let filepath = path.resolve(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

let files = walkSync(directoryPath);
let changedFiles = 0;

files.forEach(file => {
  if (!/\.(astro|ts|tsx|js|jsx|json|md|html)$/.test(file)) return;
  
  let originalFormat = fs.readFileSync(file, 'utf8');
  let newFormat = originalFormat;
  
  // also try decoding double-encoded utf8 to be safe 
  // sometimes this works better than string replace if there are edge cases
  let bufferFormat = Buffer.from(originalFormat, 'latin1').toString('utf8');
  if (bufferFormat.includes('á') || bufferFormat.includes('é') || bufferFormat.includes('ñ')) {
      newFormat = bufferFormat;
  } else {
      // Let's just do manual mapping first to be safe
      for (const [bad, good] of Object.entries(replacements)) {
        newFormat = newFormat.split(bad).join(good);
      }
  }

  if (originalFormat !== newFormat && newFormat.indexOf('Ã') === -1) {
    fs.writeFileSync(file, newFormat, 'utf8');
    console.log(`Fixed encoding in: ${file}`);
    changedFiles++;
  } else if (originalFormat !== newFormat) {
    fs.writeFileSync(file, newFormat, 'utf8');
    console.log(`Fixed partial encoding in: ${file}`);
    changedFiles++;
  }
});

console.log(`Fixed ${changedFiles} files total.`);
