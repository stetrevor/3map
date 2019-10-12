<template>
  <div class="pg-node-item">
    <div class="pg-node-item__self" :style="getStyleObject(node)">
      {{ node.id }}
    </div>

    <node-item v-for="child in node.children" :key="child.id" :node="child" />
  </div>
</template>

<script>
export default {
  name: "node-item",

  props: {
    node: {
      type: Object,
      required: true
    }
  },

  methods: {
    getStyleObject(node) {
      const { x, y, width, height } = node;
      return {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`
      };
    },

    connectionStyle(node, child) {
      return {
        left: `${child.x + child.width / 2}px`,
        top: `${node.y + node.height}px`,
        width: `${Math.abs(
          node.x + node.width / 2 - (child.x + child.width / 2)
        )}px`,
        height: `${child.y - (node.y + node.height)}px`
      };
    }
  }
};
</script>

<style lang="scss">
.pg-node-item {
  &__self {
    position: absolute;
    background-color: lightgray;
    box-shadow: inset 0 0 0 1px black;
    font-size: 4px;
    padding-left: 2px;
  }
}
</style>
