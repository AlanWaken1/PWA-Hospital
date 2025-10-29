// fix-card-opacity.js
// Aumenta la opacidad de cards para hacerlas más visibles

const fs = require('fs');
const path = require('path');

// Archivos específicos de reportes y analíticas
const targetFiles = [
    'app/(app)/reportes/page.tsx',
    'app/(app)/reports/page.tsx',
    'app/(app)/analiticas/page.tsx',
    'app/(app)/analytics/page.tsx',
];

// Reemplazos para aumentar visibilidad
const opacityFixes = [
    // Aumentar opacidad en cards
    { from: /bg-theme-primary\/10\b/g, to: 'bg-theme-primary/30' },
    { from: /bg-theme-primary\/20\b/g, to: 'bg-theme-primary/40' },

    // También en dark mode
    { from: /dark:bg-theme-primary\/10\b/g, to: 'dark:bg-theme-primary/30' },
    { from: /dark:bg-theme-primary\/20\b/g, to: 'dark:bg-theme-primary/40' },
];

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  No encontrado: ${filePath}`);
        return false;
    }

    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        opacityFixes.forEach(({ from, to }) => {
            content = content.replace(from, to);
        });

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✓ Mejorado: ${filePath}`);
            return true;
        } else {
            console.log(`  - Sin cambios: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`  ❌ Error: ${filePath}`, error.message);
        return false;
    }
}

console.log('🎨 Aumentando opacidad de cards...\n');

let fixedCount = 0;
targetFiles.forEach(file => {
    if (fixFile(file)) {
        fixedCount++;
    }
});

console.log(`\n✅ ${fixedCount} archivos mejorados\n`);
console.log('📝 Cambios aplicados:');
console.log('   bg-theme-primary/10  →  bg-theme-primary/30');
console.log('   bg-theme-primary/20  →  bg-theme-primary/40\n');
console.log('🎯 Resultado:');
console.log('   Cards con color del tema MÁS VISIBLE\n');
console.log('🚀 Reinicia el servidor:');
console.log('   rm -rf .next && npm run dev\n');