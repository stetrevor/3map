<template>
  <div class="firebase-cloud">
    <input type="file" multiple @change="uploadFiles($event.target.files)" />

    <h3>Uploading {{ ongoingUploads }} files</h3>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "firebase-cloud",

  computed: mapState({ ongoingUploads: state => state.sync.ongoingUploads }),

  methods: mapActions(["uploadFiles"])
};
</script>

<style lang="scss"></style>
