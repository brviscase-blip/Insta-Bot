const fs = require('fs');
const path = require('path');
const uiDir = path.join(process.cwd(), 'src/components/ui');
const files = fs.readdirSync(uiDir);

files.forEach(f => {
  if (f.endsWith('-ui.tsx')) {
    fs.renameSync(path.join(uiDir, f), path.join(uiDir, f.replace('-ui.tsx', '.tsx')));
  }
  if (f === 'avatar-component.tsx') {
    fs.renameSync(path.join(uiDir, f), path.join(uiDir, 'avatar.tsx'));
  }
});
