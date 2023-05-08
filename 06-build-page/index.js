const { mkdir } = require('fs/promises');
const { join } = require('path');

mkdir(join(__dirname, 'project-dist'), { recursive: true });