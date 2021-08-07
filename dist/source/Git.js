"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVNodeGitStatus = void 0;
const child_process_1 = require("child_process");
function getVNodeGitStatus(path, filename) {
    return new Promise((resolve) => {
        child_process_1.exec(`git status -s ${path}/${filename}`, { cwd: path }, (err, stdout) => {
            if (stdout.length === 0 || err !== null) {
                resolve('');
            }
            else if (stdout.slice(0, 2) === '??') {
                resolve('[ A]');
            }
            else if (stdout.slice(0, 2) === ' M') {
                resolve('[ M]');
            }
            else if (stdout.slice(0, 2) === ' D') {
                resolve('[ D]');
            }
            else {
                resolve('');
            }
        });
    });
}
exports.getVNodeGitStatus = getVNodeGitStatus;
