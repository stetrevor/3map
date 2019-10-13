<template>
  <div
    class="resize-handle"
    :class="`resize-handle--${direction}`"
    @mousedown="startResize"
  ></div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      required: true
    }
  },

  methods: {
    startResize() {
      this.resizing = true;
    },

    stopResize() {
      this.resizing = false;
    },

    resize(event) {
      if (!this.resizing) return true;

      const { movementX, movementY } = event;
      let deltaX = 0;
      let deltaY = 0;
      switch (this.direction) {
        case "x":
          deltaX = movementX;
          break;
        case "y":
          deltaY = movementY;
          break;
        case "xy":
          deltaX = movementX;
          deltaY = movementY;
          break;
        default:
          break;
      }
      this.$emit("resizing", { deltaX, deltaY });
    }
  },

  mounted() {
    document.documentElement.addEventListener("mouseup", this.stopResize);
    document.documentElement.addEventListener("mouseleave", this.stopResize);
    document.documentElement.addEventListener("mousemove", this.resize);
  },

  beforeDestroy() {
    document.documentElement.removeEventListener("mouseup", this.stopResize);
    document.documentElement.removeEventListener("mouseleave", this.stopResize);
    document.documentElement.removeEventListener("mousemove", this.resize);
  },

  data() {
    return {
      resizing: false
    };
  }
};
</script>

<style lang="scss">
.resize-handle {
  border: 1px solid deepskyblue;
  width: 4px;
  height: 4px;
  background-color: #fff;

  &--x {
    cursor: ew-resize;
  }
  &--y {
    cursor: ns-resize;
  }
  &--xy {
    cursor: nwse-resize;
  }
}
</style>
