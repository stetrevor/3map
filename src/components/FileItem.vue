<template>
  <div class="file-item">
    <input type="text" v-model="name" class="file-item__edit" v-if="editing" />
    <div class="file-item__name" v-else>{{ item.name }}</div>
    <div class="file-item__last-modified">
      {{ item.lastModified.toLocaleString() }}
    </div>

    <div class="file-item__controls">
      <button
        class="file-item__control"
        @click="
          editing = !editing;
          rename();
        "
      >
        {{ editing ? "Done" : "Rename" }}
      </button>
      <button class="file-item__control" v-if="!editing" @click="remove">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },

  methods: {
    ...mapActions(["updateFile", "deleteFile"]),

    rename() {
      if (!this.editing) {
        this.updateFile({ id: this.item.id, name: this.name });
      }
    },

    remove() {
      this.deleteFile({ id: this.item.id });
    }
  },

  data() {
    return {
      editing: false,
      name: this.item.name
    };
  }
};
</script>

<style lang="scss">
.file-item {
  position: relative;
  box-sizing: border-box;
  padding: 8px 24px;
  height: 72px;

  &:hover {
    background-color: silver;
  }

  &__name {
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__last-modified {
    font-size: 0.707em;
  }

  &__controls {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 16px;
    display: none;
  }

  &:hover &__controls {
    display: initial;
  }
}
</style>
