Object.defineProperty(exports, "__esModule", { value: true });
const folder_1 = require("../dom/folder");
const TRUN = '└';
const LINE = '|';
function TestRender(root) {
    let point;
    const renderText = [];
    const stack = [root];
    let prefix = ' ';
    while (true) {
        point = stack.pop();
        console.log(point.firstChild)
        if (point !== root && !point.after) {
            prefix = `${prefix.substring(0, prefix.length - 3)}${TRUN} `;
            renderText.push(`${prefix}${point.attribute.icon}${point.filename}`);
            // prefix = prefix.substring(0, prefix.length - 3);
        }
        else {
            renderText.push(`${prefix}${point.attribute.icon}${point.filename}`);
            stack.push(point.after);
        }
        if (point instanceof folder_1.FolderElement &&
            point.unfold === true &&
            !point.firstChild) {
            prefix = `${prefix}${LINE} `;
            stack.push(point.firstChild);
        }
        if (stack.length === 0) {
            break;
        }
    }
    console.log(renderText);
}
(async () => {
    const f1 = new folder_1.FolderElement('workspace', '/home/ph');
    await f1.generateChildren();
    const f2 = new folder_1.FolderElement('workspace', '/home/ph');
    await f2.generateChildren();
    TestRender(f1);
    const a = [{name : 'nn'}, {name: "jj"}]
    let point = a.pop()
    console.log(point.name)
})();

