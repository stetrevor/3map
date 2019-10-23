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

      <div>
        <h4>Display all maps from cloud</h4>
        <button @click="nextPage" :disabled="pagination.done">
          List maps
        </button>
        <ul>
          <li v-for="file in mapFileList" :key="file.fullPath">
            <span>{{ file.filename }}</span> - <span>{{ file.updated }}</span>
          </li>
        </ul>
      </div>

      <div>
        <h4>Rename Map "{{ renameFrom }}" to <input v-model="renameTo" /></h4>
        <button
          @click="renameMapFile({ refPath: last.refPath, filename: renameTo })"
        >
          Rename
        </button>
      </div>

      <div>
        <h4>Add Resource</h4>
        <input
          type="file"
          accept="image/*"
          @change="addResource({ file: $event.target.files[0] })"
        />
        <div v-for="res in resources" :key="res.refPath">
          <img
            :src="resourceStatus(res).downloadURL"
            width="400"
            height="300"
          />
          <div>{{ resourceStatus(res).refPath }}</div>
          <progress max="1" :value="resourceStatus(res).progress || 0" />
        </div>
      </div>

      <div>
        <h4>Download a map resource</h4>
        <input v-model="resRefPath" placeholder="resource refPath" />
        <button @click="download">
          Download
        </button>
        <img :src="resURL" />
      </div>

      <button>Delete a map resource</button>
      <button>Rename a map resource</button>
      <button>List map resources</button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "cloud-api",

  computed: {
    ...mapState({
      resources: state => state.editor.resources
    }),

    ...mapGetters(["progress", "pagination", "mapFileList", "resourceStatus"]),

    uploadProgress() {
      return this.progress(this.mapFile.refPath);
    },

    last() {
      return this.mapFileList[this.mapFileList.length - 1];
    },

    renameFrom() {
      return this.last ? this.last.filename : "";
    }
  },

  methods: {
    ...mapActions([
      "new3MapFile",
      "uploadFiles",
      "getNextPageMapFiles",
      "renameMapFile",
      "addResource"
    ]),

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
    },

    nextPage() {
      this.getNextPageMapFiles(this.pagination);
    },

    async download() {
      this.resURL = await api.cloud.getDownloadURL({
        refPath: this.resRefPath
      });
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
      mapContent: "",
      allMapFiles: [],
      renameTo: "",
      resRefPath: "",
      resURL: ""
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
