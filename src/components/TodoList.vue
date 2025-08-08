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
  toggleStatus: {
    type: Function,
    required: true
  },
  setPriority: {
    type: Function,
    required: true
  },
  isOverdue: {
    type: Function,
    required: true
  },
  formatDate: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div
    class="max-h-[370px] overflow-y-auto overflow-x-hidden custom-scrollbar py-4 px-1">
    <div
      v-if="props.loading"
      class="flex justify-center items-center h-40">
      <img
        src="/pic/tobiload.png"
        alt="Loading..."
        class="w-16 h-16 animate-spin" />
    </div>
    <ul
      v-else
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
          @click="props.toggleStatus(todo)"
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
          <div
            class="flex items-center gap-3"
            :class="{
              'pointer-events-none opacity-50': todo.status === 'Done'
            }">
            <div class="flex items-center">
              <template
                v-for="star in 3"
                :key="star">
                <img
                  src="/pic/tobikod.png"
                  alt="Priority"
                  @click="props.setPriority(todo, star)"
                  class="w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-125"
                  :class="{
                    'opacity-100 drop-shadow-lg ': star <= todo.priority,
                    'opacity-40 hover:opacity-75': star > todo.priority
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
            'bg-red-400 text-white border-red-300': props.isOverdue(todo),
            'bg-purple-200 text-purple-800 border-purple-300':
              !props.isOverdue(todo)
          }">
          <span class="material-icons text-[14px]">schedule</span>
          <span>{{ props.formatDate(todo.deadline) }}</span>
        </div>
      </li>
    </ul>
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
