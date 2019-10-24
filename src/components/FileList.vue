<template>
  <div class="file-list">
    <button class="file-list__new-file" @click="editNewFile">
      Create New Map
    </button>

    <div class="file-list__list">
      <file-item
        :item="item"
        v-for="item in mapFileList"
        :key="item.id"
        @file-open="edit(item)"
      />
    </div>
    <button v-if="!pagination.done" @click="getNextPageMapFiles(pagination)">
      Load More
    </button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import FileItem from "@/components/FileItem";

export default {
  name: "file-list",

  components: { FileItem },

  beforeRouteEnter(to, from, next) {
    next(vm => vm.getNextPageMapFiles({ nextPageToken: "" }));
  },

  computed: mapGetters(["mapFileList", "pagination"]),

  methods: {
    ...mapActions(["getNextPageMapFiles", "editNewFile"]),

    editNewFile() {
      this.$router.push({
        name: "editor",
        params: { id: "new" }
      });
    },

    edit(file) {
      this.$router.push({ name: "editor", params: { id: file.id } });
    }
  }
};
</script>

<style lang="scss">
.file-list {
  &__list {
    margin: 12px 0;
  }
}
</style>
