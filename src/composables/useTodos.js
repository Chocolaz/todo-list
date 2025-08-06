import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc
} from 'firebase/firestore'

export function useTodos() {
  const todos = ref([])
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
          status: data.status || 'To Do',
          priority: data.priority || 0
        })
      })
      todos.value = fbTodos.sort(
        (a, b) => b.createdAt.seconds - a.createdAt.seconds
      )
    })
  })

  const addTodo = async (newTodoText, newDeadlineValue, newPriorityValue) => {
    if (newTodoText.trim() === '') return
    await addDoc(todosCollection, {
      text: newTodoText,
      createdAt: new Date(),
      deadline: newDeadlineValue ? new Date(newDeadlineValue) : null,
      status: 'To Do',
      priority: newPriorityValue
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

  return {
    todos,
    addTodo,
    toggleStatus,
    setPriority
  }
}
