// The ordering contract for the long page: a pre-order flatten of the registry
// tree into the exact sequence of anchored blocks StoryView renders. Group nodes
// become headings (with their depth, for the l0/l1 styling split); leaves become
// entry blocks. A node with an entry is a leaf by the registry's construction
// (buildTree attaches entries to final title segments only) — pageRows relies on
// that and does not recurse below an entry.

import type { Entry, TreeNode } from './registry';

export type PageRow =
  | { kind: 'group'; slug: string; name: string; level: number }
  | { kind: 'entry'; slug: string; entry: Entry };

/** Pre-order the tree into a flat list of group headings + entries, so the whole
 * system renders on one page in tree order with anchorable ids. */
export function pageRows(tree: TreeNode[], level = 0, out: PageRow[] = []): PageRow[] {
  for (const node of tree) {
    if (node.entry) {
      out.push({ kind: 'entry', slug: node.slug, entry: node.entry });
    } else {
      out.push({ kind: 'group', slug: node.slug, name: node.name, level });
      if (node.children) pageRows(node.children, level + 1, out);
    }
  }
  return out;
}
