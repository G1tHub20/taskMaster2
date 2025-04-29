<template>
  <h2>タスク</h2>
  <form @submit.prevent="addItem">
    <input type="text" v-model="state.newItem"> <!-- state.newItem に直接バインディング -->
    <button type="submit">New Task</button>
  </form>
  <ul>
    <li v-for="(task) in incompleteTasks" :key="task.id"> <!-- v-forを使うときは各要素に一意なキーを付与すべき -->
      <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
      <span>{{ task.item }}</span>
      <input type="date" v-model="task.deadLine">
      <button @click="deleteItem(task.id)">削除</button>
    </li>
  </ul>

  <h2>完了済み</h2>
  <ul>
    <li v-for="(task) in completeTasks" :key="task.id">
      <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
      <span :class="{ done: task.isDone }">{{ task.item }}</span> <!-- 付与するCSSクラス名: 条件 -->
      <input type="date" v-model="task.deadLine">
    </li>
  </ul>

  <!-- デバッグ用 -->
  <pre>{{ state.tasks }}</pre>
</template>


<script setup>
  import { reactive, watch, computed, onMounted } from 'vue'

  // リアクティブな状態管理を行う
  const state = reactive({
    newItem: '',
    tasks: []
  })

  // tasksの変更を監視してlocalStorageに保存
  watch(() => state.tasks, (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }, { deep: true })

  // 算出プロパティ
  const incompleteTasks = computed(() => state.tasks.filter(task => !task.isDone))
  const completeTasks   = computed(() => state.tasks.filter(task => task.isDone))

  // タスクの追加
  const addItem = () => {
    if (state.newItem === '') return
    const task = {
      id: Date.now(),
      item: state.newItem,
      isDone: false,
      deadLine: ''
    }
    state.tasks.push(task)
    state.newItem = ''
  }

  // タスクの削除
  const deleteItem = (index) => {
    state.tasks.splice(index, 1)
  }

  // コンポーネント作成時（レンダリング後）にlocalStorageからタスクを取得
  onMounted(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      state.tasks = JSON.parse(storedTasks)
    }
  })
</script>


<style>
  #app ul {
    list-style: none;
  }

  #app li > span.done {
    text-decoration: line-through; /* 取り消し線 */
  }
</style>