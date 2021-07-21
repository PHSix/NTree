import { Option } from './Option';
import { UpdateRender } from './Render';
import { InquireNode, Store } from './Store';
export async function HiddenAction() {
  Option.hidden_file = !Option.hidden_file;
  UpdateRender();
}

export async function EditAction(pos: number) {
  // Log(`${InquireNode(pos)}, ${pos}`);
  const [vnode, status] = await InquireNode(pos);
  if (status === 1) {
    Store.nvim.setWindow(Store.window);
    Store.nvim.command(`:e ${vnode.path}/${vnode.filename}`);
  } else {
    UpdateRender();
  }
}

export async function ToggleAction() {}
