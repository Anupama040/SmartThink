const fs = require('fs');
const path = require('path');

const directoryPath = 'e:\\Users\\anupa\\Downloads\\SmartThink\\frontend\\src';

const replacements = [
    { regex: /bg-neutral-950/g, replacement: 'bg-background' },
    { regex: /bg-\[\#0a0a0a\]/g, replacement: 'bg-background' },
    { regex: /bg-\[\#111\]/g, replacement: 'bg-card' },
    { regex: /bg-\[\#111111\]/g, replacement: 'bg-card' },
    { regex: /bg-\[\#161616\]/g, replacement: 'bg-surface' },
    { regex: /bg-\[\#1a1a1a\]/g, replacement: 'bg-surface-hover' },
    { regex: /bg-neutral-900/g, replacement: 'bg-surface' },
    { regex: /bg-neutral-800/g, replacement: 'bg-surface-elevated' },
    
    { regex: /hover:bg-\[\#1a1a1a\]/g, replacement: 'hover:bg-surface-hover' },
    { regex: /hover:bg-\[\#222222\]/g, replacement: 'hover:bg-surface-elevated' },
    { regex: /hover:bg-neutral-900/g, replacement: 'hover:bg-surface' },
    { regex: /hover:bg-neutral-800/g, replacement: 'hover:bg-surface-elevated' },

    { regex: /text-white/g, replacement: 'text-primary' },
    { regex: /text-neutral-300/g, replacement: 'text-primary-muted' },
    { regex: /text-neutral-400/g, replacement: 'text-secondary' },
    { regex: /text-neutral-500/g, replacement: 'text-muted' },
    
    { regex: /border-neutral-800/g, replacement: 'border-border' },
    { regex: /border-neutral-700/g, replacement: 'border-border-strong' },
    
    { regex: /divide-neutral-800/g, replacement: 'divide-border' },
    { regex: /divide-neutral-700/g, replacement: 'divide-border-strong' },
];

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            replacements.forEach(({ regex, replacement }) => {
                content = content.replace(regex, replacement);
            });
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

processDirectory(directoryPath);
console.log('Refactoring complete!');
