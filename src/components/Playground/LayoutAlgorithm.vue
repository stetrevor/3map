<template>
  <div class="layout-algorithm">
    Layout Algorithm

    <div class="layout-algorithm__canvas">
      <node-item :node="treeData" />
    </div>
  </div>
</template>

<script>
import { layout, Tree } from "non-layered-tidy-tree-layout";
import NodeItem from "@/components/Playground/NodeItem";

class BoundingBox {
  /**
   * @param {number} gap - the gap between sibling nodes
   * @param {number} bottomPadding - the height reserved for connection drawing
   */
  constructor(gap, bottomPadding) {
    this.gap = gap;
    this.bottomPadding = bottomPadding;
  }

  addBoundingBox(width, height) {
    return { width: width + this.gap, height: height + this.bottomPadding };
  }

  /**
   * Return the coordinate without the bounding box for a node
   */
  removeBoundingBox(x, y) {
    return { x: x + this.gap / 2, y };
  }
}

/**
 * Returns Tree to layout.
 */
function convert(treeData, y = 0) {
  if (treeData === null) return null;

  let children = [];
  if (treeData.children && treeData.children.length) {
    for (let i = 0; i < treeData.children.length; i++) {
      children[i] = convert(treeData.children[i], y + treeData.height);
    }
  }

  return new Tree(treeData.width, treeData.height, y, children);
}

/**
 * Assign layout tree x, y coordinates back to treeData.
 */
function assignCoordinates(tree, treeData) {
  treeData.x = tree.x;
  treeData.y = tree.y;
  for (let i = 0; i < tree.c.length; i++) {
    assignCoordinates(tree.c[i], treeData.children[i]);
  }
}

export default {
  components: { NodeItem },

  created() {
    console.log("layout", layout, "Tree", Tree);
    const tree = new Tree(10, 5, 0, []);
    layout(tree);
    console.log(tree.x === 0, tree.y === 0);

    const treeData = {
      id: 0,
      width: 10,
      height: 10,
      children: [
        {
          id: 1,
          width: 10,
          height: 10,
          children: [{ id: 6, width: 150, height: 10 }]
        },
        { id: 2, width: 10, height: 10 },
        { id: 3, width: 10, height: 10 },
        { id: 4, width: 10, height: 10 },
        { id: 5, width: 10, height: 20 }
      ]
    };

    const converted = convert(treeData);
    layout(converted);
    assignCoordinates(converted, treeData);
    console.log(converted, treeData);
    this.treeData = treeData;
  }
};
</script>

<style lang="scss">
.layout-algorithm {
  &__canvas {
    position: relative;
    width: 100%;
    height: 600px;
    transform: scale(2, 2);
    transform-origin: 0 0;
  }
}
</style>
