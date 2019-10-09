<template>
  <div class="tree-editor">
    <node-item
      :item="tree"
      :can-remove-self="false"
      :move-node-tool="moveNodeTool"
      :select-tool="selectTool"
      :can-move-self="false"
      :id-func="generateId"
      @set-move-to="
        moveNodeTool.setMoveTo(tree);
        moveNodeTool.move();
      "
    />
  </div>
</template>

<script>
import NodeItem from "@/components/NodeItem";

class MoveNodeTool {
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

    if (this.from.id !== this.to.id) {
      const index = this.from.children.indexOf(this.moveNode);
      this.from.children.splice(index, 1);
      this.to.children.push(this.moveNode);
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
    this.moveNodeTool = new MoveNodeTool(this.tree);
    this.selectTool = new SelectTool();
    this.selectTool.select(this.tree);
  },

  data() {
    return {
      tree: {
        id: 0,
        text: "Root Node",
        size: [200, 50],
        children: []
      },

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
