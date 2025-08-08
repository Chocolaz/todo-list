<script setup>
const props = defineProps({
  todos: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  },
  isOverdue: {
    type: Function,
    required: true
  },
  formatDate: {
    type: Function,
    required: true
  },
  restoreTodo: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['switch-to-active'])
</script>

<template>
  <div
    class="h-[370px] overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-1">
    <div
      v-if="props.loading"
      class="flex justify-center items-center h-40">
      <img
        src="/pic/tobiload.png"
        alt="Loading..."
        class="w-16 h-16 animate-spin" />
    </div>
    <ul
      v-else-if="props.todos.length > 0"
      class="space-y-4 py-2 pr-2">
      <li
        v-for="todo in props.todos"
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
          class="flex items-center justify-center p-3 text-white text-xs font-bold writing-mode-vertical h-[80px] w-16 rounded-l-2xl backdrop-blur-md shadow-lg"
          :class="{
            'bg-gradient-to-b from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600': true
          }"
          style="writing-mode: vertical-rl; text-orientation: mixed">
          🗑️ Dump
        </div>

        <!-- Task content -->
        <div class="flex justify-between items-center flex-1 py-2 pl-2 pr-1">
          <!-- Task text -->
          <span
            :class="{
              'line-through text-gray-400': true
            }"
            class="transition-all duration-500 ease-in-out font-medium text-sm whitespace-normal break-words max-w-[calc(100%-100px)]">
            {{ todo.text }}
          </span>

          <!-- Priority stars -->
          <div class="flex items-center gap-3 pointer-events-none opacity-50">
            <div class="flex items-center">
              <template
                v-for="star in 3"
                :key="star">
                <img
                  src="/pic/tobikod.png"
                  alt="Priority"
                  class="w-8 h-8"
                  :class="{
                    'opacity-100 drop-shadow-lg ': star <= todo.priority,
                    'opacity-40': star > todo.priority
                  }" />
              </template>
            </div>
          </div>
        </div>

        <!-- Deadline overlay -->
        <div
          v-if="todo.deadline"
          class="absolute -top-3 -right-3 text-[9px] px-3 py-1.5 rounded-full z-10 flex items-center gap-1 backdrop-blur-md border-2 font-bold shadow-lg"
          :class="{
            'bg-gray-400 text-white border-gray-300': true
          }">
          <span class="material-icons text-[14px]">schedule</span>
          <span>{{ props.formatDate(todo.deadline) }}</span>
        </div>

        <!-- Restore button -->
        <div
          @click="props.restoreTodo(todo)"
          class="absolute -bottom-3 -right-3 text-[9px] px-2 py-1 rounded-full z-10 flex items-center gap-1 backdrop-blur-md border-2 font-bold shadow-lg bg-green-200 text-green-600 border-green-300 cursor-pointer hover:bg-green-500 hover:text-white hover:border-green-600 transition-all duration-300 ease-in-out">
          <span class="material-icons text-[14px]">restore</span>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="flex flex-col items-center justify-center h-40 text-gray-400">
      <span class="material-icons text-6xl mb-2">delete_sweep</span>
      <p class="text-lg font-semibold">No deleted tasks!</p>
      <button
        @click="emit('switch-to-active')"
        class="mt-4 px-4 py-2 cursor-pointer bg-pink-400 text-white rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-300 ease-in-out flex items-center gap-2">
        <span class="material-icons">task_alt</span>
        Go to Active Tasks
      </button>
    </div>
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

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>
