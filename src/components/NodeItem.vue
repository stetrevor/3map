<template>
  <li class="node-item">
    <div
      class="node-item__self"
      :class="{ 'node-item__self--active': active }"
      @click="selectTool.select(item)"
    >
      <input
        v-if="editing"
        type="text"
        v-model="item.text"
        @keyup.enter="editing = false"
        @keyup.esc="editing = false"
      />
      <span class="node-item__text" v-else @dblclick="editing = true">
        {{ item.text }}
      </span>
      <button
        class="node-item__remove-self"
        v-if="canRemoveSelf"
        @click="item.children.length ? (dialogShow = true) : removeSelf()"
      >
        Remove node
      </button>
      <button v-if="canMoveSelf" @click="$emit('set-move-node', item)">
        Move
      </button>
      <button
        v-if="moveNode.availableParents.includes(item)"
        @click="$emit('set-move-to', item)"
      >
        Set As Parent
      </button>
    </div>

    <button
      class="node-item__reorder-children"
      @click="reorderingChildren ? reorderChildren() : startReorderChildren()"
      v-if="item.children.length > 1"
    >
      {{
        reorderingChildren ? "Reorder Children" : "Start Reordering Children"
      }}
    </button>

    <ul>
      <div v-for="(child, index) in item.children" :key="index">
        <label :for="`reorder-${index}`" v-if="reorderingChildren"
          >Reorder</label
        >
        <input
          type="number"
          v-if="reorderingChildren"
          v-model.number="orders[index]"
          :id="`reorder-${index}`"
        />
        <node-item
          :item="child"
          :move-node="moveNode"
          :select-tool="selectTool"
          :id-func="idFunc"
          @remove-node="removeNode($event, child, index)"
          @set-move-node="
            moveNode.setMoveNode(child);
            moveNode.setMoveFrom(item);
          "
          @set-move-to="
            moveNode.setMoveTo(child);
            moveNode.move();
          "
        />
      </div>
    </ul>

    <button class="node-item__add-child" @click="addChild">
      Add child node
    </button>

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
  </li>
</template>

<script>
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

    moveNode: {
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
    }
  },

  methods: {
    addChild() {
      const id = this.idFunc();
      this.item.children.push({
        id,
        text: `${this.item.text}::${id}`,
        children: []
      });
    },

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
      console.log("reorder children");
      this.reorderingChildren = false;

      const sortedChildren = this.orders
        .map((order, i) => [order, this.item.children[i]])
        .sort((a, b) => a[0] - b[0]);
      this.item.children = sortedChildren.map(sc => sc[1]);
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
    border: 1px solid #2c3e50;

    &--active {
      background-color: rgba(#2c3e50, 0.2);
    }
  }

  &__reorder-children {
    border-color: red;
    border-radius: 4px;
  }
}
</style>
