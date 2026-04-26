const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const files = walkSync('src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Add .tsx extension to all @/components/ui imports
  let updated = content.replace(/@\/components\/ui\/([a-zA-Z0-9-]+)("|\')/g, (match, p1, p2) => {
    return "@/components/ui/" + p1 + ".tsx" + p2;
  });
  
  if (content !== updated) {
    console.log('Updated ' + f);
    fs.writeFileSync(f, updated);
  }
});
