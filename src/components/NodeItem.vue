<template>
  <div class="node-item">
    <div
      class="node-item__self"
      :class="{ 'node-item__self--active': active }"
      @click="selectTool.select(item)"
      :style="styleObject"
    >
      <input
        v-if="editing && active"
        type="text"
        v-model="item.text"
        @keyup.enter="editing = false"
        @keyup.esc="editing = false"
      />
      <div class="node-item__text" v-else @dblclick="editing = true">
        {{ item.text }}
      </div>
    </div>

    <div class="node-item__tools">
      <button
        class="node-item__add-child node-item__tool"
        v-if="active && !reorderingChildren"
        @click="addChild(item)"
      >
        Add child node
      </button>

      <button
        class="node-item__remove-self node-item__tool"
        v-if="canRemoveSelf && active"
        @click="item.children.length ? (dialogShow = true) : removeSelf()"
      >
        Remove node
      </button>

      <button
        class="node-item__tool"
        v-if="canMoveSelf && active"
        @click="$emit('set-move-node', item)"
      >
        Move
      </button>

      <button
        v-if="moveNodeTool.availableParents.includes(item)"
        @click="$emit('set-move-to', item)"
      >
        Set As Parent
      </button>

      <button
        class="node-item__reorder-children"
        @click="reorderingChildren ? reorderChildren() : startReorderChildren()"
        v-if="item.children.length > 1 && active"
      >
        {{
          reorderingChildren ? "Reorder Children" : "Start Reordering Children"
        }}
      </button>
    </div>

    <template v-for="(child, index) in item.children">
      <div
        class="node-item__reorder"
        :style="reorderStyle(child)"
        :key="`reorder-${index}`"
        v-if="reorderingChildren"
      >
        <label :for="`reorder-${index}`">Reorder</label>
        <input
          type="number"
          v-model.number="orders[index]"
          :id="`reorder-${index}`"
        />
      </div>

      <node-item
        :key="child.id"
        :item="child"
        :move-node-tool="moveNodeTool"
        :select-tool="selectTool"
        :id-func="idFunc"
        @remove-node="removeNode($event, child, index)"
        @set-move-node="
          moveNodeTool.setMoveNode(child);
          moveNodeTool.setMoveFrom(item);
        "
        @set-move-to="
          moveNodeTool.setMoveTo(child);
          moveNodeTool.move();
        "
      />
    </template>

    <base-dialog
      v-if="dialogShow"
      @on-accept="
        dialogShow = false;
        removeSelf();
      "
      @on-cancel="dialogShow = false"
    >
      <h1>What to do with the children nodes?</h1>
      <div>
        <input
          type="radio"
          id="reparent-children"
          value="reparent-children"
          v-model="removeOption"
        />
        <label for="reparent-children"
          ><strong>Reparent</strong> children to the parent and remove current
          node</label
        >
      </div>
      <div>
        <input
          type="radio"
          id="remove-all"
          value="remove-all"
          v-model="removeOption"
        />
        <label for="remove-all"
          ><strong>Remove</strong> all children and remove current node</label
        >
      </div>
    </base-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import BaseDialog from "@/components/BaseDialog";

export default {
  name: "node-item",

  components: { BaseDialog },

  props: {
    item: {
      type: Object,
      required: true
    },

    canRemoveSelf: {
      type: Boolean,
      default: true
    },

    moveNodeTool: {
      type: Object,
      required: true
    },

    canMoveSelf: {
      type: Boolean,
      default: true
    },

    idFunc: {
      type: Function,
      required: true
    },

    selectTool: {
      type: Object,
      required: true
    }
  },

  computed: {
    active() {
      return this.item.id === this.selectTool.activeNode.id;
    },

    styleObject() {
      const { x, y, width, height } = this.item;
      return {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`
      };
    }
  },

  methods: {
    ...mapActions(["addChild", "reorderNodes"]),

    removeSelf() {
      this.$emit("remove-node", this.removeOption);
    },

    removeNode(option, node, index) {
      if (option === "remove-all") {
        this.item.children.splice(index, 1);
      } else if (option === "reparent-children") {
        this.item.children.splice(index, 1, ...node.children);
      }
    },

    startReorderChildren() {
      this.orders = this.item.children.map((c, i) => i + 1);

      this.reorderingChildren = true;
    },

    reorderChildren() {
      this.reorderingChildren = false;

      this.reorderNodes({
        parent: this.item,
        orders: this.orders
      });
    },

    reorderStyle({ x, y }) {
      return {
        left: `${x}px`,
        top: `${y - 24}px`
      };
    }
  },

  data() {
    return {
      editing: false,
      removeOption: "reparent-children",
      dialogShow: false,
      reorderingChildren: false,
      orders: []
    };
  }
};
</script>

<style lang="scss">
.node-item {
  margin-bottom: 24px;

  &__self {
    position: absolute;
    border: 1px solid #2c3e50;

    &--active {
      background-color: rgba(#2c3e50, 0.2);
    }
  }

  &__tools {
    position: absolute;
    margin-top: -48px;
    display: flex;
  }

  &__reorder {
    position: absolute;

    input {
      width: 32px;
    }
  }

  &__reorder-children {
    display: block;
    border-color: red;
    border-radius: 4px;
  }
}
</style>
