<template>
  <li class="node-item">
    <input
      v-if="editing"
      type="text"
      v-model="item.text"
      @keyup.enter="editing = false"
      @keyup.esc="editing = false"
    />
    <div class="node-item__self" v-else>
      <div class="node-item__text" @dblclick="editing = true">
        {{ item.text }}
      </div>
    </div>

    <ul>
      <node-item
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
      />
    </ul>

    <button class="node-item__add-child" @click="addChild">
      Add child node
    </button>
  </li>
</template>

<script>
export default {
  name: "node-item",

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  methods: {
    addChild() {
      this.item.children.push({
        text: `${this.item.text}::New Child`,
        children: []
      });
    }
  },

  data() {
    return {
      editing: false
    };
  }
};
</script>

<style lang="scss"></style>
