<template>
  <ul class="tree-editor">
    <node-item :item="tree" :remove-self-button-show="false" />
  </ul>
</template>

<script>
import NodeItem from "@/components/NodeItem";

export default {
  components: { NodeItem },

  data() {
    return {
      tree: {
        text: "Root Node",
        children: []
      }
    };
  }
};
</script>

<style lang="scss"></style>