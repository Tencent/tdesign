const fs = require('fs-extra')
const { execSync } = require('child_process');

console.log('--- 正在同步 style ---')
const command = 'lessc ./src/styles/main.less ./lib/styles/style.css';
execSync(command, { cwd: process.cwd(), encoding: 'utf-8' });

fs.copyFileSync('./src/styles/prism-theme.less', './lib/styles/prism-theme.less');
fs.copyFileSync('./src/styles/prism-theme-dark.less', './lib/styles/prism-theme-dark.less');
console.log('--- 同步 style 完成 ---')

console.log('--- 正在同步 font ---')
fs.copySync('./src/font', './lib/font');
console.log('--- 同步 font 完成 ---')

console.log('--- 正在同步 images ---')
fs.copySync('./src/images', './lib/images');
console.log('--- 同步 images 完成 ---')
