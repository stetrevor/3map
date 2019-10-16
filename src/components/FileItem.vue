<template>
  <div class="file-item" @click="editing ? '' : $emit('file-open')">
    <div class="file-item__content">
      <input
        type="text"
        v-model="name"
        class="file-item__edit"
        v-if="editing"
      />
      <div class="file-item__name" v-else>{{ item.name }}</div>
      <div class="file-item__last-modified">
        {{ item.lastModified.toLocaleString() }}
      </div>
    </div>

    <button
      class="file-item__control"
      @click.stop="
        editing = !editing;
        rename();
      "
    >
      {{ editing ? "Done" : "Rename" }}
    </button>
    <button class="file-item__control" v-if="!editing" @click.stop="remove">
      Delete
    </button>
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

    async rename() {
      if (!this.editing) {
        await this.updateFile({ id: this.item.id, name: this.name });
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
  box-sizing: border-box;
  padding: 8px 24px;
  height: 72px;
  display: flex;

  &:hover {
    background-color: silver;
  }

  &__content {
    flex-grow: 1;
  }

  &__name {
    font-size: 1em;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__last-modified {
    font-size: 0.707em;
  }

  &__control {
    margin: auto;
    margin-left: 8px;
    display: none;
  }

  &:hover &__control {
    display: initial;
  }
}
</style>
