import { exec } from 'child_process';

export function getVNodeGitStatus(path: string, filename: string) {
  return new Promise<string>((resolve) => {
    exec(`git status -s ${path}/${filename}`, { cwd: path }, (err, stdout) => {
      if (stdout.length === 0 || err !== null) {
        resolve('');
      } else if (stdout.slice(0, 2) === '??') {
        resolve('[ A]');
      } else if (stdout.slice(0, 2) === ' M') {
        resolve('[ M]');
      } else if (stdout.slice(0, 2) === ' D') {
        resolve('[ D]');
      } else {
        resolve('');
      }
    });
  });
}
