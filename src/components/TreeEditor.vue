<template>
  <ul class="tree-editor">
    <node-item
      :item="tree"
      :remove-self-button-show="false"
      :move-node="moveNode"
      :can-move-self="false"
      :id-func="generateId"
    />
  </ul>
</template>

<script>
import NodeItem from "@/components/NodeItem";

class MoveNode {
  constructor(rootNode) {
    this.tree = rootNode;
    this.availableParents = [];
    this.from = null;
    this.to = null;
    this.moveNode = null;
  }

  setMoveNode(item) {
    this.moveNode = item;
    this.availableParents = [...this.getAvailableParents()];
  }

  setMoveFrom(item) {
    this.from = item;
  }

  setMoveTo(item) {
    this.to = item;
  }

  move() {
    if (!this.readyToMove()) return;

    const index = this.from.children.indexOf(this.moveNode);
    this.from.children.splice(index, 1);
    this.to.children.push(this.moveNode);

    this.reset();
  }

  reset() {
    this.from = this.to = this.moveNode = null;
    this.availableParents = [];
  }

  readyToMove() {
    return this.from && this.to && this.moveNode;
  }

  *getAvailableParents(node = this.tree) {
    yield node;
    for (let child of node.children) {
      if (child.id !== this.moveNode.id) {
        yield* this.getAvailableParents(child);
      }
    }
  }
}

export default {
  components: { NodeItem },

  methods: {
    generateId: (() => {
      let count = 0;

      function id() {
        count += 1;
        return count;
      }

      return id;
    })()
  },

  created() {
    this.moveNode = new MoveNode(this.tree);
  },

  data() {
    return {
      tree: {
        id: 0,
        text: "Root Node",
        children: []
      },

      moveNode: null
    };
  }
};
</script>

<style lang="scss"></style>
