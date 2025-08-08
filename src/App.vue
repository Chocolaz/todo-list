<script setup>
import { ref, computed } from 'vue'
import { useTodos } from '@/composables/useTodos'
import { useUtils } from '@/composables/useUtils'
import TodoList from '@/components/TodoList.vue'
import Flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/themes/confetti.css'

const { todos, loading, addTodo, toggleStatus, setPriority } = useTodos()
const { newDeadline, formatDate, isOverdue, randomizeDeadline, today } =
  useUtils()
const newTodo = ref('')
const newPriority = ref(0)

const isAddButtonDisabled = computed(() => {
  return (
    newPriority.value === 0 ||
    newDeadline.value === '' ||
    newTodo.value.trim() === ''
  )
})

const addTodoHandler = async () => {
  await addTodo(newTodo.value, newDeadline.value, newPriority.value)
  newTodo.value = ''
  newDeadline.value = ''
  newPriority.value = 0
}
</script>

<template>
  <div
    class="h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-200 flex items-start justify-center p-4">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-400/40 rounded-full blur-3xl animate-pulse"></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-400/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-400/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      <!-- Sparkle effects -->
      <div
        class="absolute top-20 left-20 w-4 h-4 bg-white rounded-full animate-ping opacity-70"></div>
      <div
        class="absolute top-40 right-32 w-3 h-3 bg-pink-300 rounded-full animate-pulse delay-300"></div>
      <div
        class="absolute bottom-32 left-40 w-5 h-5 bg-fuchsia-300 rounded-full animate-bounce delay-700"></div>
      <div
        class="absolute bottom-20 right-20 w-2 h-2 bg-white rounded-full animate-ping delay-1000"></div>
    </div>

    <main
      class="relative max-w-lg w-full backdrop-blur-xl bg-white/80 border-4 border-pink-300/60 p-4 rounded-3xl shadow-2xl shadow-pink-400/20">
      <div class="flex items-center justify-center pb-2 gap-2">
        <h1
          class="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
          TobiDo
        </h1>
        <img
          src="/pic/tobiwi.png"
          alt="TobiWi"
          class="w-14 h-14 ml-1" />
        <h1
          class="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
          TodoBi
        </h1>
      </div>

      <form
        @submit.prevent="addTodoHandler"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          v-model="newTodo"
          placeholder="Add a task..."
          class="md:col-span-2 p-4 backdrop-blur-md bg-pink-50/80 border-2 border-pink-300 rounded-2xl text-pink-800 placeholder-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-500 transition-all duration-300 shadow-lg shadow-pink-200/50 h-[55px]" />

        <div class="flex items-center gap-2">
          <Flatpickr
            v-model="newDeadline"
            :config="{
              dateFormat: 'd/m/y',
              minDate: 'today'
            }"
            placeholder="dd/mm/yy"
            class="flex-grow p-4 backdrop-blur-md bg-pink-50/80 border-2 border-pink-300 rounded-2xl text-pink-800 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-500 transition-all duration-300 shadow-lg shadow-pink-200/50 h-[55px]" />
          <button
            type="button"
            @click="randomizeDeadline"
            class="p-2 backdrop-blur-md bg-gradient-to-r from-pink-200 to-fuchsia-200 border-2 border-pink-300 rounded-2xl hover:from-pink-300 hover:to-fuchsia-300 transition-all duration-300 group shadow-lg shadow-pink-200/50 h-[55px] w-[55px]">
            <span 
              class="material-icons text-pink-600 group-hover:rotate-180 group-hover:text-fuchsia-600 transition-all duration-300"
              >casino</span
            >
          </button>
        </div>

        <div class="flex items-center gap-2 md:col-span-3">
          <span class="text-pink-600 font-bold">💖 Priority:</span>
          <template
            v-for="star in 3"
            :key="star">
            <img
              src="/pic/tobikod.png"
              alt="Priority"
              @click="newPriority = star"
              class="w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-125"
              :class="{
                'opacity-100 drop-shadow-lg ': star <= newPriority,
                'opacity-40 hover:opacity-75': star > newPriority
              }" />
          </template>
          <button
            :disabled="isAddButtonDisabled"
            class="backdrop-blur-md p-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400/50 transition-all duration-300 font-bold text-lg border-2 shadow-xl w-full max-w-[100px] h-[45px] ml-auto flex items-center justify-center"
            :class="{
              'bg-gradient-to-r from-pink-400 to-fuchsia-400 hover:from-pink-500 hover:to-fuchsia-500 border-pink-400 text-white transform hover:scale-105 shadow-pink-400/40':
                !isAddButtonDisabled,
              'bg-gray-200 cursor-not-allowed border-gray-300 text-gray-400':
                isAddButtonDisabled
            }">
            <span class="material-icons">add</span>
          </button>
        </div>
      </form>

      <TodoList
        :todos="todos"
        :loading="loading"
        :toggleStatus="toggleStatus"
        :setPriority="setPriority"
        :isOverdue="isOverdue"
        :formatDate="formatDate" />
    </main>
  </div>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  filter: hue-rotate(300deg) brightness(1.2);
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

input[type='date']::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Custom animations */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Glass effect enhancement */
.backdrop-blur-xl {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
</style>
