<template>
  <div class="layout-algorithm">
    <h3>Layout Algorithm</h3>

    <h4>Bounding boxes</h4>
    <div class="layout-algorithm__canvas">
      <node-item :node="boxes" />
    </div>

    <h4>Nodes with connections</h4>
    <div class="layout-algorithm__canvas">
      <node-item :node="treeData" :bounding-box="bb" />
      <svg
        class="layout-algorithm__connections"
        xmlns="http://www.w3.org/2000/svg"
      >
        <connection-item :node="treeData" />
      </svg>
    </div>
  </div>
</template>

<script>
import { layout, Tree } from "non-layered-tidy-tree-layout";
import NodeItem from "@/components/Playground/NodeItem";
import ConnectionItem from "@/components/Playground/ConnectionItem";

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

class Layout {
  constructor(boundingBox) {
    this.bb = boundingBox;
  }

  /**
   * Layout treeData.
   */
  layoutTreeData(treeData) {
    const tree = this.convert(treeData);
    layout(tree);
    this.assignCoordinates(tree, treeData);

    return treeData;
  }

  /**
   * Returns Tree to layout, with bounding boxes added to each node.
   */
  convert(treeData, y = 0) {
    if (treeData === null) return null;

    const { width, height } = this.bb.addBoundingBox(
      treeData.width,
      treeData.height
    );
    let children = [];
    if (treeData.children && treeData.children.length) {
      for (let i = 0; i < treeData.children.length; i++) {
        children[i] = this.convert(treeData.children[i], y + height);
      }
    }

    return new Tree(width, height, y, children);
  }

  /**
   * Assign layout tree x, y coordinates back to treeData,
   * with bounding boxes removed.
   */
  assignCoordinates(tree, treeData) {
    const { x, y } = this.bb.removeBoundingBox(tree.x, tree.y);
    treeData.x = x;
    treeData.y = y;
    for (let i = 0; i < tree.c.length; i++) {
      this.assignCoordinates(tree.c[i], treeData.children[i]);
    }
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

/**
 * Layout treeData.
 */
function layoutTreeData(treeData) {
  const tree = convert(treeData);
  layout(tree);
  assignCoordinates(tree, treeData);

  return treeData;
}

export default {
  components: { NodeItem, ConnectionItem },

  created() {
    console.log("layout", layout, "Tree", Tree);
    const tree = new Tree(10, 5, 0, []);
    layout(tree);
    console.log(tree.x === 0, tree.y === 0);

    const boxes = {
      id: 0,
      width: 40,
      height: 40,
      children: [
        {
          id: 1,
          width: 40,
          height: 40,
          children: [{ id: 6, width: 400, height: 40 }]
        },
        { id: 2, width: 40, height: 40 },
        { id: 3, width: 40, height: 40 },
        { id: 4, width: 40, height: 40 },
        { id: 5, width: 40, height: 80 }
      ]
    };

    const treeData = {
      id: 0,
      width: 40,
      height: 40,
      children: [
        {
          id: 1,
          width: 40,
          height: 40,
          children: [{ id: 6, width: 400, height: 40 }]
        },
        { id: 2, width: 40, height: 40 },
        { id: 3, width: 40, height: 40 },
        { id: 4, width: 40, height: 40 },
        { id: 5, width: 40, height: 80 }
      ]
    };

    this.boxes = layoutTreeData(boxes);

    const bb = new BoundingBox(10, 20);
    const l = new Layout(bb);
    this.treeData = l.layoutTreeData(treeData);
    this.bb = bb;
    console.log(this.treeData);
  }
};
</script>

<style lang="scss">
.layout-algorithm {
  &__canvas {
    position: relative;
    width: 100%;
    height: 300px;
    transform-origin: 0 0;
  }

  &__connections {
    width: 100%;
    height: 100%;
  }
}
</style>
