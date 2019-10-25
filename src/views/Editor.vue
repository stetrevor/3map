<template>
  <div class="editor">
    <div class="editor__save-status">{{ saveStatus }}</div>

    <tree-editor :tree="tree" :bounding-box="boundingBox" v-if="ready" />
    <div v-else>Loading...</div>
  </div>
</template>

<script>
import TreeEditor from "@/components/TreeEditor";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "editor",

  components: { TreeEditor },

  computed: {
    ...mapState({
      saveStatus: state => {
        const status = state.editor.saveStatus;

        if (typeof status === "number") {
          return `Last updated ${new Date(status).toLocaleString()}`;
        } else {
          return status;
        }
      }
    }),

    ...mapGetters(["tree", "boundingBox"])
  },

  methods: {
    ...mapActions(["getMapContent", "uploadMapFile"]),

    async setup() {
      this.ready = false;
      await this.getMapContent(this.$route.params);
      this.ready = true;
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => vm.setup());
  },

  beforeRouteUpdate(to, from, next) {
    this.setup();
    next();
  },

  beforeRouteLeave(to, from, next) {
    this.uploadMapFile(from.params);
    next();
  },

  data() {
    return {
      ready: false
    };
  }
};
</script>

<style lang="scss"></style>
