/**
 * copied straight from the main SnailyCAD repo
 * All licenses apply.
 */

import { Editor, Element as SlateElement, Descendant } from "slate";

export function slateDataToString(data: Descendant[] | null) {
  const string: string[] = [];
  if (!data) return null;

  for (const item of data) {
    if (Editor.isEditor(item)) continue;

    if (SlateElement.isElement(item) && (item as any).type === "bulleted-list") {
      const children = item.children?.flatMap((c) => (c as any).children).map((v) => v?.text) ?? [];

      string.push(children.join(" "));
      continue;
    }

    if (SlateElement.isElement(item)) {
      item.children?.forEach((child) => {
        string.push((child as any).text.trim());
      });
    }
  }

  return string.join(" ");
}
