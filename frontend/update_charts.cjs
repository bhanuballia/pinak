const fs = require('fs');
const file = 'src/components/InteractiveWorksheet.jsx';
let content = fs.readFileSync(file, 'utf8');

const chartsToUpdate = [
  'data.charts?.houses',
  'data.vargas?.d2?.houses',
  'data.vargas?.d3?.houses',
  'data.vargas?.d4?.houses',
  'data.vargas?.d5?.houses',
  'data.vargas?.d6?.houses',
  'data.vargas?.d7?.houses',
  'data.vargas?.d8?.houses',
  'data.vargas?.d9?.houses',
  'data.vargas?.d10?.houses',
  'data.vargas?.d12?.houses',
  'data.vargas?.d16?.houses',
  'data.vargas?.d20?.houses',
  'data.vargas?.d24?.houses',
  'data.vargas?.d27?.houses',
  'data.vargas?.d30?.houses',
  'data.vargas?.d40?.houses',
  'data.vargas?.d45?.houses',
  'data.vargas?.d60?.houses'
];

chartsToUpdate.forEach(house => {
  const housePattern = house.replace(/\?/g, '\\\\?');
  const regex = new RegExp(`(<ZodiacChart [^>]*houses={${housePattern}}[^>]*)variant="legacy"`, 'g');
  content = content.replace(regex, '$1variant="legacy" defaultRect={true}');
});

fs.writeFileSync(file, content);
console.log('Update complete.');
