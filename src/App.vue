<template>
  <router-view />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
const appReady = ref(false);

onMounted(async () => {
  try {
    // Initialize auth state
    await authStore.init();
  } catch (error) {
    console.error('Initialization error:', error);
  } finally {
    appReady.value = true;
  }
});
</script>
