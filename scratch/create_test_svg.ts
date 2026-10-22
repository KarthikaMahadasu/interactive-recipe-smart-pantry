import fs from 'fs';

// Create test potato SVG and PNG
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <rect width="200" height="200" fill="#f5f0eb"/>
  <ellipse cx="100" cy="100" rx="72" ry="52" fill="#c49a6c"/>
  <circle cx="75" cy="85" r="4" fill="#8c6239"/>
  <circle cx="125" cy="115" r="5" fill="#8c6239"/>
  <circle cx="110" cy="80" r="3" fill="#8c6239"/>
</svg>`;

fs.writeFileSync('public/test_potato.svg', svg);
console.log('Created public/test_potato.svg');
