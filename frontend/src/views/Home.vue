<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/services/api";

// Definindo uma interface simples para o TypeScript não reclamar
interface User {
  _id: string; // O MongoDB usa _id por padrão
  name: string;
  email: string;
}

const users = ref<User[]>([]);
const loading = ref(true);
const name = ref("");

const handleSignout = async () => {
  try {
    // 1. Avisa o backend para limpar o Cookie
    await api.post("/auth/signout");
  } catch (error: any) {
    console.error("Erro ao deslogar no servidor:", error.message);
  } finally {
    // 2. Limpa o LocalStorage independentemente de erro no servidor
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // 3. Redireciona para o login (o window.location limpa o estado do Vue da memória)
    window.location.href = "/signin";
  }
};

async function fetchUsers() {
  try {
    const response = await api.get("/auth/users");
    users.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
    // O seu interceptor no api.ts já deve cuidar do redirecionamento se for 401
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const savedName = localStorage.getItem("username");
  if (savedName) {
    // Pega o primeiro nome e capitaliza
    const firstName = savedName.split(" ")[0];
    name.value = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  } else {
    name.value = "Visitante";
  }
  fetchUsers();
});
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-indigo-400">Dashboard</h1>
          <h2 class="text-lg text-gray-300">Olá, {{ name }}!</h2>
        </div>

        <button
          @click="handleSignout"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Sair do Sistema
        </button>
      </header>

      <section>
        <h3 class="text-xl mb-4 font-semibold text-gray-100">
          Usuários Cadastrados
        </h3>

        <div v-if="loading" class="animate-pulse text-indigo-400">
          Carregando dados...
        </div>

        <div v-else-if="users.length === 0" class="text-gray-500">
          Nenhum usuário encontrado.
        </div>

        <div v-else class="space-y-4">
          <ul
            class="bg-gray-800 rounded-xl overflow-hidden shadow-xl border border-gray-700 divide-y divide-gray-700"
          >
            <li
              v-for="user in users"
              :key="user._id"
              class="p-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
            >
              <span class="font-medium">{{ user.name }}</span>
              <span class="text-gray-400 text-sm italic">{{ user.email }}</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>
