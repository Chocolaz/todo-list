import { ref, computed } from 'vue'

export function useUtils() {
  const newDeadline = ref('')

  const today = computed(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  })

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

  return {
    newDeadline,
    today,
    formatDate,
    isOverdue,
    randomizeDeadline
  }
}