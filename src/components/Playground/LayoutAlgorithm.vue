<template>
  <div class="layout-algorithm">
    Layout Algorithm
  </div>
</template>

<script>
import { layout, Tree } from "non-layered-tidy-tree-layout";

export default {
  created() {
    console.log("layout", layout, "Tree", Tree);
    const tree = new Tree(10, 5, 0, []);
    layout(tree);
    console.log(tree.x === 0, tree.y === 0);
  }
};
</script>
