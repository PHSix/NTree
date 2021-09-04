"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logmsg = void 0;
const fs_1 = require("fs");
function logmsg(msg) {
    (0, fs_1.appendFileSync)(__dirname + '/node.log', msg);
}
exports.logmsg = logmsg;
