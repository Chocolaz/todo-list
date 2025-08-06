<script setup>
import { ref, computed } from 'vue'
import { useTodos } from '@/composables/useTodos'
import { useUtils } from '@/composables/useUtils'

const { todos, addTodo, toggleStatus, setPriority } = useTodos()
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
    class="min-h-screen bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-200 flex items-center justify-center p-4">
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
      <h1
        class="text-2xl font-extrabold mb-4 text-center bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-lg">
        ✨ TobiDo TodoBi ✨
      </h1>

      <form
        @submit.prevent="addTodoHandler"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          v-model="newTodo"
          placeholder="✨ Add a task..."
          class="md:col-span-2 p-4 backdrop-blur-md bg-pink-50/80 border-2 border-pink-300 rounded-2xl text-pink-800 placeholder-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-500 transition-all duration-300 shadow-lg shadow-pink-200/50" />

        <div class="flex items-center gap-2">
          <input
            v-model="newDeadline"
            type="date"
            :min="today"
            class="flex-grow p-4 backdrop-blur-md bg-purple-50/80 border-2 border-purple-300 rounded-2xl text-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-500 transition-all duration-300 shadow-lg shadow-purple-200/50" />
          <button
            type="button"
            @click="randomizeDeadline"
            class="p-4 backdrop-blur-md bg-gradient-to-r from-pink-200 to-fuchsia-200 border-2 border-pink-300 rounded-2xl hover:from-pink-300 hover:to-fuchsia-300 transition-all duration-300 group shadow-lg shadow-pink-200/50">
            <span
              class="material-icons text-pink-600 group-hover:rotate-180 group-hover:text-fuchsia-600 transition-all duration-300"
              >casino</span
            >
          </button>
        </div>

        <div class="flex items-center gap-2 md:col-span-3">
          <span class="text-pink-600 mr-3 font-bold">💖 Priority:</span>
          <template
            v-for="star in 3"
            :key="star">
            <span
              @click="newPriority = star"
              class="material-icons cursor-pointer transition-all duration-300 hover:scale-125 text-xl"
              :class="{
                'text-pink-500 drop-shadow-lg animate-pulse':
                  star <= newPriority,
                'text-pink-200 hover:text-pink-400': star > newPriority
              }">
              star
            </span>
          </template>
        </div>

        <button
          :disabled="isAddButtonDisabled"
          class="md:col-span-3 backdrop-blur-md px-6 py-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400/50 transition-all duration-300 font-bold text-lg border-2 shadow-xl"
          :class="{
            'bg-gradient-to-r from-pink-400 to-fuchsia-400 hover:from-pink-500 hover:to-fuchsia-500 border-pink-400 text-white transform hover:scale-105 shadow-pink-400/40':
              !isAddButtonDisabled,
            'bg-gray-200 cursor-not-allowed border-gray-300 text-gray-400':
              isAddButtonDisabled
          }">
          ✨ Add Task ✨
        </button>
      </form>

      <div
        class="max-h-[450px] overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-1">
        <ul class="space-y-4 py-2 pr-2">
          <li
            v-for="todo in todos"
            :key="todo.id"
            class="relative z-0 flex items-center rounded-2xl backdrop-blur-md border-2 transition-all duration-500 ease-in-out hover:scale-102 hover:shadow-xl group shadow-lg"
            :class="{
              'bg-pink-50/90 border-pink-200 hover:bg-pink-100/90 shadow-pink-200/50':
                todo.status === 'To Do',
              'bg-green-50/90 border-green-200 hover:bg-green-100/90 shadow-green-200/50':
                todo.status === 'Done'
            }">
            <!-- Status bar (left side) -->
            <div
              @click="toggleStatus(todo)"
              class="flex items-center justify-center p-3 text-white text-xs font-bold writing-mode-vertical h-full max-h-[80px] cursor-pointer transition-all duration-300 ease-in-out rounded-l-2xl backdrop-blur-md shadow-lg"
              :class="{
                'bg-gradient-to-b from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500':
                  todo.status === 'To Do',
                'bg-gradient-to-b from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500':
                  todo.status === 'Done'
              }"
              style="writing-mode: vertical-rl; text-orientation: mixed">
              {{ todo.status === 'To Do' ? '💖 To Do' : '✨ Done' }}
            </div>

            <!-- Task content -->
            <div class="flex justify-between items-center flex-1 p-5">
              <!-- Task text -->
              <span
                :class="{
                  'line-through text-gray-400': todo.status === 'Done',
                  'text-pink-800': todo.status === 'To Do'
                }"
                class="transition-all duration-500 ease-in-out font-medium text-sm">
                {{ todo.text }}
              </span>

              <!-- Priority stars -->
              <div class="flex items-center gap-3">
                <div class="flex items-center">
                  <template
                    v-for="star in 3"
                    :key="star">
                    <span
                      @click="setPriority(todo, star)"
                      class="material-icons text-[16px] cursor-pointer transition-all duration-300 hover:scale-125"
                      :class="{
                        'text-pink-500 drop-shadow-lg animate-pulse':
                          star <= todo.priority,
                        'text-pink-200 hover:text-pink-400':
                          star > todo.priority
                      }">
                      star
                    </span>
                  </template>
                </div>
              </div>
            </div>

            <!-- Deadline overlay -->
            <div
              v-if="todo.deadline"
              class="absolute -top-3 -right-3 text-[9px] px-3 py-1.5 rounded-full z-10 flex items-center gap-1 backdrop-blur-md border-2 font-bold shadow-lg"
              :class="{
                'bg-red-400 text-white border-red-300': isOverdue(todo),
                'bg-purple-200 text-purple-800 border-purple-300':
                  !isOverdue(todo)
              }">
              <span class="material-icons text-[14px]">schedule</span>
              <span>{{ formatDate(todo.deadline) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 182, 193, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 105, 180, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 105, 180, 0.3);
}

/* Custom date input styling for kawaii theme */
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

.hover\:scale-102:hover {
  transform: scale(1.02);
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
