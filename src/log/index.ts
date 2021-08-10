import { appendFileSync } from 'fs';

export function logmsg(msg: string) {
  appendFileSync(__dirname + '/node.log', msg);
}
