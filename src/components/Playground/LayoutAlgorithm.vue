<template>
  <div class="layout-algorithm">
    <h3>Layout Algorithm</h3>

    <h4>Bounding boxes</h4>
    <div class="layout-algorithm__canvas">
      <node-item :node="boxes" />
    </div>

    <h4>Nodes with connections</h4>
    <div class="layout-algorithm__canvas">
      <node-item :node="treeData" />
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
      width: 20,
      height: 20,
      children: [
        {
          id: 1,
          width: 20,
          height: 20,
          children: [{ id: 6, width: 200, height: 20 }]
        },
        { id: 2, width: 20, height: 20 },
        { id: 3, width: 20, height: 20 },
        { id: 4, width: 20, height: 20 },
        { id: 5, width: 20, height: 40 }
      ]
    };

    const treeData = {
      id: 0,
      width: 10,
      height: 10,
      children: [
        {
          id: 1,
          width: 10,
          height: 10,
          children: [{ id: 6, width: 190, height: 10 }]
        },
        { id: 2, width: 10, height: 10 },
        { id: 3, width: 10, height: 10 },
        { id: 4, width: 10, height: 10 },
        { id: 5, width: 10, height: 20 }
      ]
    };

    this.boxes = layoutTreeData(boxes);
    const l = new Layout(new BoundingBox(10, 5));
    this.treeData = l.layoutTreeData(treeData);
  }
};
</script>

<style lang="scss">
.layout-algorithm {
  &__canvas {
    position: relative;
    width: 100%;
    height: 300px;
    transform: scale(2, 2);
    transform-origin: 0 0;
  }

  &__connections {
    width: 100%;
    height: 100%;
  }
}
</style>
