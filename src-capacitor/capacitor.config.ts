import { defineCapacitorConfig } from '@quasar/app-vite/capacitor';

export default defineCapacitorConfig({
  appId: "ee.zowi.pkstatus",
  appName: "PKStatus",
  plugins: {
    EdgeToEdge: {
      backgroundColor: "#1976d2"
    }
  }
})
