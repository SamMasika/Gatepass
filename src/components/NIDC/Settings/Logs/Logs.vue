<template>
  <v-card>
    <v-card-title>System Logs</v-card-title>

    <v-data-table
      :headers="headers"
      :items="logs"
      class="elevation-0"
    />
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "SystemLogs",
  data() {
    return {
      logs: [],
      headers: [
        { text: "User", value: "user" },
        { text: "Action", value: "action" },
        { text: "Module", value: "module" },
        { text: "Status", value: "status" },
        { text: "Date", value: "created_at" },
      ],
    };
  },
  mounted() {
    this.fetchLogs();
  },
  methods: {
    async fetchLogs() {
      const res = await axios.get("/api/system-logs");
      this.logs = res.data;
    },
  },
};
</script>