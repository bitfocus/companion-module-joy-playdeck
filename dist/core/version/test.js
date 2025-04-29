"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Versions {
    static list = [
        { id: '4.1b3', label: '4.1b3' },
        { id: '3.8b13', label: '3.8b13' },
        { id: '3.8b8', label: '3.8b8' },
        { id: '3.8b4', label: '3.8b4' },
        { id: '3.7b11', label: '3.7b11' },
        { id: '3.7b4', label: '3.7b4' },
        { id: '3.6b18', label: '3.6b18' },
        { id: '3.5b12', label: '3.5b12 ONLY TCP' },
        { id: '3.5b3', label: '3.5b3 ONLY TCP' },
        { id: '3.4b8', label: '3.4b8 ONLY TCP COMMANDS' },
        { id: '3.2b12', label: '3.2b12 ONLY TCP COMMANDS' },
        { id: '3.2b11', label: '3.2b11 ONLY TCP COMMANDS' },
        { id: '3.2b8', label: '3.2b8 ONLY TCP COMMANDS' },
        { id: '3.2b2', label: '3.2b2 ONLY TCP COMMANDS' },
    ];
}
// Usage examples
const version1 = '3.8b13'; // valid
const version2 = Versions.list[2].id; // valid
// const version3: VersionId = 'invalid'; // error
//# sourceMappingURL=test.js.map