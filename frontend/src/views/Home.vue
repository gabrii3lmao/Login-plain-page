<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

const users = ref([]);
const loading = ref(true);

async function fetchUsers() {
  try {
    const response = await api.get("/auth/users");
    users.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <h1 class="text-2xl font-bold mb-6">
      Sistema de Login - Lista de Usuários Cadastrados
    </h1>

    <div v-if="loading" class="animate-pulse text-indigo-400">
      Carregando usuários...
    </div>

    <div v-else class="space-y-4">
      <ul class="bg-gray-800 rounded-lg p-4 divide-y divide-gray-700">
        <li
          v-for="user in users"
          :key="user.id"
          class="py-2 flex justify-between"
        >
          <span>{{ user.name || user.email }}</span>
          <span class="text-gray-400 text-sm">{{ user.email }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
