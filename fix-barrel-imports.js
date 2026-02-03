/**
 * fix-barrel-imports.js
 * Run from your project root:   node fix-barrel-imports.js
 *
 * - Reads components/index.ts to map each exported name to its actual file
 * - Finds every .tsx/.ts inside components/ that imports from "@/components"
 * - Replaces those barrel imports with direct relative-path imports
 * - Leaves app/ (screens) untouched — screens are allowed to use the barrel
 */

const fs   = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.resolve(__dirname, 'components');

// ── 1. Parse barrel file → { Name: { relPath, isNamedExport } } ─────────────
const barrelContent = fs.readFileSync(path.join(COMPONENTS_DIR, 'index.ts'), 'utf-8');
const exportMap = {};

for (const line of barrelContent.split('\n')) {
    // export { default as Foo } from "./ui/Foo";
    const m1 = line.match(/export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*["']([^"']+)["']/);
    if (m1) { exportMap[m1[1]] = { relPath: m1[2], isNamedExport: false }; continue; }

    // export type { Foo } from "./ui/Foo";
    const m2 = line.match(/export\s+type\s*\{\s*(\w+)\s*\}\s*from\s*["']([^"']+)["']/);
    if (m2) { exportMap[m2[1]] = { relPath: m2[2], isNamedExport: true };  continue; }
}
console.log(`Barrel: ${Object.keys(exportMap).length} exports mapped.\n`);

// ── 2. Walk components/ recursively, skip index.ts ──────────────────────────
function walkDir(dir) {
    let out = [];
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory())                          out = out.concat(walkDir(full));
        else if (/\.(tsx|ts)$/.test(e.name) && e.name !== 'index.ts') out.push(full);
    }
    return out;
}

// ── 3. Process ───────────────────────────────────────────────────────────────
let changedCount = 0;

for (const filePath of walkDir(COMPONENTS_DIR)) {
    let src = fs.readFileSync(filePath, 'utf-8');
    if (!src.includes('@/components')) continue;

    const displayName = path.relative(process.cwd(), filePath);

    // Matches:
    //   import { A, B, type C } from "@/components";
    //   import type { A, B }    from "@/components";
    const RE = /import\s+(type\s+)?\{\s*([^}]+)\}\s+from\s+["']@\/components["'];?/g;

    const newSrc = src.replace(RE, (_full, typeKw, namesRaw) => {
        const wholeImportIsType = !!typeKw;                          // "import type { … }"
        const names = namesRaw.split(',').map(s => s.trim()).filter(Boolean);
        const lines   = [];
        const missing = [];

        for (const raw of names) {
            let inlineType = false;
            let name       = raw;
            if (name.startsWith('type ')) { inlineType = true; name = name.slice(5).trim(); }

            const info = exportMap[name];
            if (!info) { missing.push(name); continue; }

            // Relative path from this file to the target module
            const targetAbs = path.resolve(COMPONENTS_DIR, info.relPath);
            let   rel       = path.relative(path.dirname(filePath), targetAbs).replace(/\\/g, '/');
            if (!rel.startsWith('.')) rel = './' + rel;

            const needsType = wholeImportIsType || inlineType || info.isNamedExport;

            if (info.isNamedExport) {
                // Was a named export (e.g. export type { FilterOptions }) → keep braces
                lines.push(`import type { ${name} } from "${rel}";`);
            } else if (needsType) {
                // Default export but used as a type → import type Name from "…"
                lines.push(`import type ${name} from "${rel}";`);
            } else {
                // Normal default import
                lines.push(`import ${name} from "${rel}";`);
            }
        }

        if (missing.length) console.log(`  ⚠️  ${displayName} — not in barrel: ${missing.join(', ')}`);
        return lines.join('\n');
    });

    if (newSrc !== src) {
        fs.writeFileSync(filePath, newSrc, 'utf-8');
        console.log(`  ✅ ${displayName}`);
        changedCount++;
    }
}

console.log(`\nDone — ${changedCount} file(s) rewritten.`);