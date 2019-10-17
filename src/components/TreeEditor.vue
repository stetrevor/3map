<template>
  <div class="tree-editor">
    <div class="tree-editor__saving-status">{{ savingStatus }}</div>
    <div class="tree-editor__content" :style="bb" v-if="ready">
      <svg
        class="tree-editor__connections"
        xmlns="http://www.w3.org/2000/svg"
        :style="bb"
      >
        <connection-item :node="tree" />
      </svg>

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
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NodeItem from "@/components/NodeItem";
import ConnectionItem from "@/components/ConnectionItem";

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
  name: "tree-editor",
  components: { NodeItem, ConnectionItem },

  beforeRouteEnter(to, from, next) {
    next(vm => vm.setup());
  },

  beforeRouteUpdate(to, from, next) {
    this.setup();
    next();
  },

  computed: {
    ...mapState({
      tree: state => state.editor.treeData,
      treeBB: state => state.editor.treeBoundingBox,
      savingStatus: state => {
        const status = state.editor.savingStatus;
        if (typeof status === "number") {
          return `Last updated ${new Date(status).toLocaleString()}`;
        } else {
          return status;
        }
      }
    }),

    bb() {
      const { left, right, top, bottom } = this.treeBB;
      return {
        width: `${right - left}px`,
        height: `${bottom - top}px`
      };
    }
  },

  methods: {
    ...mapActions(["moveNode", "addChild", "getMap"]),

    async setup() {
      await this.getMap({ id: parseInt(this.$route.params.id) });
      this.moveNodeTool = new MoveNodeTool(this.tree, this.moveNode);
      this.selectTool = new SelectTool();
      this.selectTool.select(this.tree);
      this.ready = true;
    }
  },

  data() {
    return {
      moveNodeTool: null,
      selectTool: null,
      ready: false
    };
  }
};
</script>

<style lang="scss">
.tree-editor {
  display: flex;
  justify-content: center;

  &__content {
    position: relative;
    margin-top: 48px;
  }

  &__connections {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
