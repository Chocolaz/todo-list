import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc
} from 'firebase/firestore'

export function useTodos() {
  const todos = ref([])
  const deletedTodos = ref([])
  const loading = ref(true)
  const todosCollection = collection(db, 'todos')
  const activeTodosQuery = query(todosCollection, where('deleted', '==', false))
  const deletedTodosQuery = query(todosCollection, where('deleted', '==', true))

  onMounted(() => {
    onSnapshot(activeTodosQuery, (querySnapshot) => {
      const fbTodos = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fbTodos.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt,
          deadline: data.deadline ? data.deadline.toDate() : null,
          status: data.status || 'To Do',
          priority: data.priority || 0,
          deleted: data.deleted || false
        })
      })
      todos.value = fbTodos.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      )
      loading.value = false
    })

    onSnapshot(deletedTodosQuery, (querySnapshot) => {
      const fbDeletedTodos = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        fbDeletedTodos.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt,
          deadline: data.deadline ? data.deadline.toDate() : null,
          status: data.status || 'To Do',
          priority: data.priority || 0,
          deleted: data.deleted || false
        })
      })
      deletedTodos.value = fbDeletedTodos.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      )
    })
  })

  const addTodo = async (newTodoText, newDeadlineValue, newPriorityValue) => {
    if (newTodoText.trim() === '') return
    const [day, month, year] = newDeadlineValue.split('/')
    const formattedDeadline = `20${year}-${month}-${day}`
    await addDoc(todosCollection, {
      text: newTodoText,
      createdAt: new Date(),
      deadline: newDeadlineValue ? new Date(formattedDeadline) : null,
      status: 'To Do',
      priority: newPriorityValue,
      deleted: false
    })
  }

  const toggleStatus = async (todo) => {
    const newStatus = todo.status === 'To Do' ? 'Done' : 'To Do'
    const todoRef = doc(db, 'todos', todo.id)
    await updateDoc(todoRef, { status: newStatus })
  }

  const setPriority = async (todo, priority) => {
    const todoRef = doc(db, 'todos', todo.id)
    await updateDoc(todoRef, { priority: priority })
  }

  const deleteTodo = async (todo) => {
    const todoRef = doc(db, 'todos', todo.id)
    await updateDoc(todoRef, { deleted: true })
  }

  const restoreTodo = async (todo) => {
    const todoRef = doc(db, 'todos', todo.id)
    await updateDoc(todoRef, { deleted: false })
  }

  return {
    todos,
    deletedTodos,
    loading,
    addTodo,
    toggleStatus,
    setPriority,
    deleteTodo,
    restoreTodo
  }
}
