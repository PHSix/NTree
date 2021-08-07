import { BaseElement } from './BaseElement';
import { FolderElement } from './folder';

const f1 = new BaseElement('nvim', '/home/ph/.config', null);

const f = new FolderElement('nvim', '/home/ph/.config');

console.log(
  f.fullpath,
  f.unfold,
  f.attribute.hlGroup,
  f.attribute.icon
);

task(f);

task(null);

function task(b: BaseElement) {
  if (b instanceof FolderElement) {
    console.log('yes', b.attribute.hlGroup);
  } else {
    console.log('error');
  }
}
