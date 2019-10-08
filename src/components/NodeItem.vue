<template>
  <li class="node-item">
    <div class="node-item__self">
      <input
        v-if="editing"
        type="text"
        v-model="item.text"
        @keyup.enter="editing = false"
        @keyup.esc="editing = false"
      />
      <div class="node-item__text" v-else @dblclick="editing = true">
        {{ item.text }}

        <button
          class="node-item__remove-self"
          v-if="removeSelfButtonShow"
          @click="item.children.length ? (dialogShow = true) : removeSelf()"
        >
          Remove node
        </button>
      </div>
    </div>

    <ul>
      <node-item
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        @remove-node="removeNode($event, child, index)"
      />
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
    removeSelfButtonShow: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    addChild() {
      this.item.children.push({
        text: `${this.item.text}::New Child`,
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
    }
  },

  data() {
    return {
      editing: false,
      removeOption: "reparent-children",
      dialogShow: false
    };
  }
};
</script>

<style lang="scss"></style>
