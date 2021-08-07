import { BaseElement } from '../dom/BaseElement';
import { FolderElement } from '../dom/folder';

const TRUN = '└';
const LINE = '|';

function TestRender(root: FolderElement) {
  const renderText: string[] = [];
  const stack: BaseElement[] = [root];
  let point: BaseElement = null;
  let prefix = ' ';
  while (true) {
    point = stack.pop();
    if (point.key !== root.key && !point.after) {
      prefix = `${prefix.substring(0, prefix.length - 2)}${TRUN} `;
      renderText.push(`${prefix}${point.attribute.icon} ${point.filename}`);
      prefix = `${prefix.substring(0, prefix.length - 2)}  `;
    } else if (point.key === root.key) {
      renderText.push(`${prefix}${point.attribute.icon} ${point.filename}`);
    } else {
      renderText.push(`${prefix}${point.attribute.icon} ${point.filename}`);
      stack.push(point.after);
    }
    if (
      point instanceof FolderElement &&
      point.unfold === true &&
      point.firstChild
    ) {
      prefix = `${prefix}${LINE} `;
      stack.push(point.firstChild);
    }
    if (point.key !== root.key && !point.after) {
      prefix = prefix.substring(0, prefix.length - 2);
    }
    if (stack.length === 0) {
      break;
    }
  }
  for (let item of renderText) {
    console.log(item);
  }
}

(async () => {
  const f1 = new FolderElement('src', '/home/ph/.local/share/nvim/site/pack/packer/start/node-tree.nvim');
  await f1.generateChildren();
  // await (f1.lastChild.before as FolderElement).generateChildren();
  // await ((f1.lastChild.before as FolderElement)
  //   .firstChild as FolderElement).generateChildren();
  // await (f1.lastChild as FolderElement).generateChildren();
  TestRender(f1);
})();
