import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcPath);

const replacements = [
    { regex: /dark:bg-black/g, replace: 'dark:bg-[#0B1120]' },
    { regex: /dark:bg-\[\#0a0a0a\]/g, replace: 'dark:bg-[#000000]' },
    { regex: /dark:bg-\[\#111\]/g, replace: 'dark:bg-[#000000]' },
    { regex: /dark:bg-\[\#111111\]/g, replace: 'dark:bg-[#000000]' },
    { regex: /dark:bg-\[\#050505\]/g, replace: 'dark:bg-[#0B1120]' },
    { regex: /dark:bg-slate-900/g, replace: 'dark:bg-[#000000]' },
    { regex: /dark:bg-slate-950/g, replace: 'dark:bg-[#0B1120]' }
];

let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(({ regex, replace }) => {
        content = content.replace(regex, replace);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
        console.log(`Updated: ${path.relative(__dirname, file)}`);
    }
});

console.log(`Successfully updated ${changedFiles} files with the new dark theme colors!`);
