<template>
  <div class="tree-editor">
    <node-item
      :item="tree"
      :can-remove-self="false"
      :move-node-tool="moveNodeTool"
      :select-tool="selectTool"
      :can-move-self="false"
      @set-move-to="
        moveNodeTool.setMoveTo(tree);
        moveNodeTool.move();
      "
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NodeItem from "@/components/NodeItem";

class MoveNodeTool {
  constructor(rootNode, moveNodeFunc) {
    this.tree = rootNode;
    this.moveNodeFunc = moveNodeFunc;
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

    if (this.from.id !== this.to.id) {
      const { from, to, moveNode } = this;
      this.moveNodeFunc({ from, to, node: moveNode });
    }

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

class SelectTool {
  constructor() {
    this.activeNode = null;
  }

  select(nodeItem) {
    this.activeNode = nodeItem;
  }
}

export default {
  components: { NodeItem },

  computed: mapState({
    tree: state => state.treeData
  }),

  methods: mapActions(["moveNode"]),

  created() {
    this.moveNodeTool = new MoveNodeTool(this.tree, this.moveNode);
    this.selectTool = new SelectTool();
    this.selectTool.select(this.tree);
  },

  data() {
    return {
      moveNodeTool: null,

      selectTool: null
    };
  }
};
</script>

<style lang="scss">
.tree-editor {
  position: relative;
}
</style>
