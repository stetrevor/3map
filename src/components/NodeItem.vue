<template>
  <div class="node-item">
    <div
      class="node-item__self"
      :class="{ 'node-item__self--active': active }"
      @click="selectTool.select(item)"
      :style="styleObject"
    >
      <textarea
        class="node-item__edit"
        v-if="editing && active"
        v-focus
        :placeholder="text"
        v-model="text"
      />
      <div class="node-item__text" v-else @dblclick="editing = true">
        {{ item.text }}
      </div>

      <button
        class="node-item__move-to"
        v-if="moveNodeTool.availableParents.includes(item)"
        @click="$emit('set-move-to', item)"
      >
        Set As Parent
      </button>

      <button
        class="node-item__edit-text node-item__tool"
        v-if="
          active &&
            !editing &&
            !reorderingChildren &&
            moveNodeTool.from === null
        "
        @click="editing = true"
      >
        Edit Content
      </button>
      <button class="node-item__save-text" v-if="editing" @click="doneEdit">
        Save
      </button>
      <button v-if="editing" @click="cancelEdit">
        Cancel
      </button>

      <template v-if="active">
        <resize-handle
          class="node-item__resize-handle"
          :class="`node-item__resize-handle--${direction}`"
          v-for="direction in ['x', 'y', 'xy']"
          :key="direction"
          :direction="direction"
          @resizing="resize($event)"
          @resize-stop="doneResize"
        />
      </template>
    </div>

    <div class="node-item__tools">
      <button
        class="node-item__add-child node-item__tool"
        v-if="active && !reorderingChildren"
        @click="addChild({ parent: item })"
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
import ResizeHandle from "@/components/ResizeHandle";

export default {
  name: "node-item",

  components: { BaseDialog, ResizeHandle },

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
    ...mapActions([
      "addChild",
      "removeChild",
      "reorderNodes",
      "resizeNode",
      "updateText",
      "doneResize"
    ]),

    removeSelf() {
      this.$emit("remove-node", this.removeOption);
    },

    removeNode(option, child, index) {
      const reparent = option === "remove-all" ? false : true;
      this.removeChild({ parent: this.item, index, reparent, child });
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
    },

    doneEdit() {
      this.editing = false;

      // Because the way keyup.esc works, it will also trigger `blur` event.
      const { item, text } = this;
      this.updateText({ item, text });
    },

    cancelEdit() {
      this.editing = false;

      this.text = this.item.text;
    },

    resize(delta) {
      this.resizeNode({ node: this.item, delta });
    }
  },

  data() {
    return {
      editing: false,
      removeOption: "reparent-children",
      dialogShow: false,
      reorderingChildren: false,
      orders: [],
      text: this.item.text
    };
  },

  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
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

  &__edit {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    resize: none;
  }

  &__move-to {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid red;
    border-radius: 4px;
  }

  &__edit-text {
    position: absolute;
    top: calc(100% + 8px);
    left: 8px;
    border: 1px solid deepskyblue;
    border-radius: 4px;
  }
  &__save-text {
    margin-right: 8px;
  }

  &__resize-handle {
    position: absolute;
    transform: translate(-50%, -50%);

    &--x {
      left: 100%;
      top: 50%;
    }
    &--y {
      left: 50%;
      top: 100%;
    }
    &--xy {
      left: 100%;
      top: 100%;
    }
  }

  &__tools {
    position: absolute;
    left: 24px;
    bottom: calc(100% + 48px);
    width: 100vw;
    display: flex;
  }
  &__tool {
    margin-right: 8px;
  }

  &__reorder {
    position: absolute;

    input {
      width: 32px;
    }
  }
}
</style>
