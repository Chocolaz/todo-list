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
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <main class="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg">
      <h1 class="text-4xl font-extrabold mb-6 text-center text-gray-800">
        TobiDo TodoBi
      </h1>
      <form
        @submit.prevent="addTodoHandler"
        class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          v-model="newTodo"
          placeholder="e.g. pet Tobi"
          class="md:col-span-2 p-3 border-2 border-gray-300 rounded-lg" />
        <div class="flex items-center gap-2">
          <input
            v-model="newDeadline"
            type="date"
            :min="today"
            class="flex-grow p-3 border-2 border-gray-300 rounded-lg" />
          <button
            type="button"
            @click="randomizeDeadline"
            class="p-3 bg-gray-200 rounded-lg hover:bg-gray-300">
            <span class="material-icons text-black">casino</span>
          </button>
        </div>
        <div class="flex items-center gap-1 md:col-span-3">
          <span class="text-gray-700 mr-2">Priority:</span>
          <template
            v-for="star in 3"
            :key="star">
            <span
              @click="newPriority = star"
              class="material-icons cursor-pointer"
              :class="{
                'text-yellow-400': star <= newPriority,
                'text-gray-400': star > newPriority
              }">
              star
            </span>
          </template>
        </div>
        <button
          :disabled="isAddButtonDisabled"
          class="md:col-span-3 bg-blue-600 text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition font-semibold"
          :class="{
            'bg-blue-600 hover:bg-blue-700': !isAddButtonDisabled,
            'bg-gray-400 cursor-not-allowed': isAddButtonDisabled
          }">
          Add
        </button>
      </form>
      <ul class="space-y-3">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="relative z-0 flex items-center p-0 rounded-xl shadow-sm border border-gray-200 transition-colors duration-300 ease-in-out"
          :class="{
            'bg-white': todo.status === 'To Do',
            'bg-green-100': todo.status === 'Done'
          }">
          <!-- Status bar (left side) -->
          <div
            @click="toggleStatus(todo)"
            class="flex items-center justify-center p-2 text-white text-xs font-bold writing-mode-vertical h-full max-h-[70px] cursor-pointer transition-colors duration-300 ease-in-out rounded-l-xl"
            :class="{
              'bg-red-500': todo.status === 'To Do',
              'bg-green-500': todo.status === 'Done'
            }"
            style="writing-mode: vertical-rl; text-orientation: mixed">
            {{ todo.status }}
          </div>

          <!-- Task content -->
          <div class="flex justify-between items-center flex-1 p-4">
            <!-- Task text -->
            <span
              :class="{
                'line-through text-gray-400 ': todo.status === 'Done'
              }"
              class="text-gray-700 transition-all duration-500 ease-in-out">
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
                    class="material-icons text-sm cursor-pointer"
                    :class="{
                      'text-yellow-400': star <= todo.priority,
                      'text-gray-400': star > todo.priority
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
            class="absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded-full z-10 flex items-center gap-1"
            :class="{
              'bg-red-200 text-red-600': isOverdue(todo),
              'bg-gray-200 text-gray-600': !isOverdue(todo)
            }">
            <span class="material-icons text-[16px]">schedule</span>
            <span>{{ formatDate(todo.deadline) }}</span>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped></style>
