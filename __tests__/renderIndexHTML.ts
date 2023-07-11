import fs from 'fs';
import path from 'path';

export default function renderIndexHTML() {
  const htmlDocPath = path.join(process.cwd(), 'todos/index.html');
  const htmlDocContent = fs.readFileSync(htmlDocPath).toString();
  return htmlDocContent;
}
