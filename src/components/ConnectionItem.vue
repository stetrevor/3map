<template>
  <g class="connection-item">
    <template v-for="child in node.children">
      <path :key="`connection-${child.id}`" :d="getPath(node, child)" />
      <connection-item :key="child.id" :node="child" />
    </template>
  </g>
</template>

<script>
export default {
  name: "connection-item",

  props: {
    node: {
      type: Object,
      required: true
    }
  },

  methods: {
    getPath(node, child) {
      const x1 = node.x + node.width / 2;
      const y1 = node.y + node.height;
      const x2 = child.x + child.width / 2;
      const y2 = child.y;

      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
  }
};
</script>

<style lang="scss">
.connection-item {
  stroke-width: 1px;
  stroke: black;
}
</style>
