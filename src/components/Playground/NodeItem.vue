<template>
  <div class="pg-node-item">
    <div class="pg-node-item__self" :style="getStyleObject(node)">
      {{ node.id }}
    </div>

    <div
      class="pg-node-item__bb"
      v-if="boundingBox"
      :style="bbStyleObject(node)"
    ></div>

    <node-item
      v-for="child in node.children"
      :key="child.id"
      :node="child"
      :boundingBox="boundingBox"
    />
  </div>
</template>

<script>
export default {
  name: "node-item",

  props: {
    node: {
      type: Object,
      required: true
    },
    boundingBox: {
      type: Object,
      default: null
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

    bbStyleObject(node) {
      const { x, y, width, height } = node;
      const { gap, bottomPadding } = this.boundingBox;
      return {
        left: `${x - gap / 2}px`,
        top: `${y}px`,
        width: `${width + gap}px`,
        height: `${height + bottomPadding}px`
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
    font-size: 16px;
    text-align: center;
  }

  &__bb {
    position: absolute;
    box-sizing: border-box;
    border: 1px dashed red;
  }
}
</style>
