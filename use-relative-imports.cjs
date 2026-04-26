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

  // Replace alias imports with relative paths and explicit .tsx extensions
  const fileDir = path.dirname(f);
  
  let updated = content.replace(/@\/(components\/ui\/[a-zA-Z0-9-]+)(\.tsx)?/g, (match, p1) => {
    const targetPath = path.resolve('src', p1);
    let relativePath = path.relative(fileDir, targetPath);
    if (!relativePath.startsWith('.')) {
      relativePath = './' + relativePath;
    }
    // ensure forward slashes
    relativePath = relativePath.replace(/\\/g, '/');
    return relativePath + '.tsx';
  });
  
  if (content !== updated) {
    console.log('Updated ' + f);
    fs.writeFileSync(f, updated);
  }
});
