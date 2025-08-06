<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc
} from 'firebase/firestore'

const todos = ref([])
const newTodo = ref('')
const newDeadline = ref('')

const today = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
})

const todosCollection = collection(db, 'todos')
const todosQuery = query(todosCollection)

onMounted(() => {
  onSnapshot(todosQuery, (querySnapshot) => {
    const fbTodos = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      fbTodos.push({
        id: doc.id,
        text: data.text,
        createdAt: data.createdAt,
        deadline: data.deadline ? data.deadline.toDate() : null,
        status: data.status || 'To Do'
      })
    })
    todos.value = fbTodos.sort((a, b) => {
      if (a.status === b.status) {
        return a.createdAt.seconds - b.createdAt.seconds
      }
      return a.status === 'To Do' ? -1 : 1
    })
  })
})

const addTodo = async () => {
  if (newTodo.value.trim() === '') return
  await addDoc(todosCollection, {
    text: newTodo.value,
    createdAt: new Date(),
    deadline: newDeadline.value ? new Date(newDeadline.value) : null,
    status: 'To Do'
  })
  newTodo.value = ''
  newDeadline.value = ''
}

const toggleStatus = async (todo) => {
  const newStatus = todo.status === 'To Do' ? 'Done' : 'To Do'
  const todoRef = doc(db, 'todos', todo.id)
  await updateDoc(todoRef, { status: newStatus })
}

const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const isOverdue = (todo) => {
  if (todo.status === 'Done' || !todo.deadline) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return todo.deadline < today
}

const randomizeDeadline = () => {
  const todayDate = new Date()
  const randomDays = Math.floor(Math.random() * 10) // Random days between 1 and 30
  todayDate.setDate(todayDate.getDate() + randomDays)

  const year = todayDate.getFullYear()
  const month = (todayDate.getMonth() + 1).toString().padStart(2, '0')
  const day = todayDate.getDate().toString().padStart(2, '0')
  newDeadline.value = `${year}-${month}-${day}`
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <main class="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg">
      <h1 class="text-4xl font-extrabold mb-6 text-center text-gray-800">
        My To-Do List
      </h1>
      <form
        @submit.prevent="addTodo"
        class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input
          v-model="newTodo"
          placeholder="e.g. learn vue"
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
        <button
          class="md:col-span-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition font-semibold">
          Add
        </button>
      </form>
      <ul class="space-y-3">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-center p-0 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <!-- Status bar (left side) -->
          <div
            @click="toggleStatus(todo)"
            class="flex items-center justify-center p-2 text-white text-xs font-bold writing-mode-vertical h-full max-h-[70px] cursor-pointer transition-colors duration-300 ease-in-out"
            :class="{
              'bg-yellow-500': todo.status === 'To Do',
              'bg-green-500': todo.status === 'Done'
            }"
            style="writing-mode: vertical-rl; text-orientation: mixed">
            {{ todo.status }}
          </div>

          <!-- Task content -->
          <div class="flex justify-between items-center flex-1 p-4">
            <span
              :class="{ 'line-through text-gray-400': todo.status === 'Done' }"
              class="text-gray-700 transition-all duration-500 ease-in-out">
              {{ todo.text }}
            </span>

            <div class="flex items-center gap-3">
              <span
                v-if="todo.deadline"
                class="text-sm px-2 py-1 rounded-full"
                :class="{
                  'bg-red-200 text-red-500': isOverdue(todo),
                  'bg-gray-200 text-gray-500': !isOverdue(todo)
                }">
                {{ formatDate(todo.deadline) }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped></style>
