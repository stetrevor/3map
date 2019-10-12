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
import {
  BoundingBox,
  Layout,
  Tree,
  layout
} from "non-layered-tidy-tree-layout";
import NodeItem from "@/components/Playground/NodeItem";
import ConnectionItem from "@/components/Playground/ConnectionItem";

export default {
  components: { NodeItem, ConnectionItem },

  created() {
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

    const l1 = new Layout(new BoundingBox(0, 0));
    this.boxes = l1.layoutTreeData(boxes);

    const bb = new BoundingBox(10, 20);
    const l2 = new Layout(bb);
    this.treeData = l2.layoutTreeData(treeData);
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
