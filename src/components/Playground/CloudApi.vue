<template>
  <div class="cloud-api">
    <h3>Cloud API</h3>
    <div class="cloud-api__demos">
      <div>
        <h4>Generate File Id: {{ fileId }}</h4>
        <button @click="getFileId">Generate</button>
      </div>
      <div>
        <h4>1. Create a map file</h4>
        <button @click="createMap">Create file</button>
        <div>
          Name: <span>{{ mapFile.name }}</span> refPath:
          <span>{{ mapFile.refPath }}</span>
        </div>
      </div>
      <div>
        <h4>2. Upload the map file</h4>
        <button @click="uploadMap">Upload a map</button>

        <template v-if="uploadProgress">
          <progress max="1" :value="uploadProgress.progress" />
          <a :href="uploadProgress.downloadURL">{{
            uploadProgress.downloadURL
          }}</a>
        </template>
      </div>

      <div>
        <h4>3. Display map content</h4>
        <button @click="getMapContent">Display</button>
        <textarea v-model="mapContent" v-if="uploadProgress" />
      </div>
      <button>List maps</button>
      <button>Rename a map</button>
      <button>Upload a map resource</button>
      <button>Download a map resource</button>
      <button>Delete a map resource</button>
      <button>Rename a map resource</button>
      <button>List map resources</button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "cloud-api",

  computed: {
    ...mapGetters(["progress"]),
    uploadProgress() {
      return this.progress(this.mapFile.refPath);
    }
  },

  methods: {
    ...mapActions(["new3MapFile", "uploadFiles"]),

    getFileId() {
      this.fileId = api.generateFileId();
    },

    async createMap() {
      this.mapFile = await this.new3MapFile();
    },

    uploadMap() {
      this.uploadFiles([
        {
          refPath: this.mapFile.refPath,
          metadata: { customMetadata: { filename: this.mapFile.name } },
          string: JSON.stringify(this.map)
        }
      ]);
    },

    async getMapContent() {
      const resp = await fetch(this.uploadProgress.downloadURL);
      const content = await resp.json();
      this.mapContent = JSON.stringify(content);
    }
  },

  data() {
    return {
      map: {
        id: 0,
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        text: "Hello World",
        children: []
      },
      fileId: null,
      mapFile: { name: "", refPath: "" },
      mapContent: ""
    };
  }
};
</script>

<style lang="scss">
.cloud-api {
  &__demos {
    display: flex;
    flex-direction: column;
  }
}
</style>
