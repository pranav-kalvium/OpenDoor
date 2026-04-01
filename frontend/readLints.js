const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./eslint_output.json', 'utf16le'));
data.filter(r => r.messages.length > 0).forEach(r => {
  console.log('--- ' + r.filePath);
  r.messages.forEach(m => console.log(`[${m.ruleId}] Line ${m.line}: ${m.message}`));
});
