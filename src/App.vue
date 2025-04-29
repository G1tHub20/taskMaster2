<script>
import { reactive, toRefs, watch, computed, onMounted } from 'vue'

export default {
  setup() {
    // データオブジェクトの管理
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
    const completeTasks = computed(() => state.tasks.filter(task => task.isDone))

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

    // コンポーネント作成時にlocalStorageからタスクを取得
    onMounted(() => {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        state.tasks = JSON.parse(storedTasks)
      }
    })

    return {
      ...toRefs(state), // これで newItem と tasks を個別に返せる
      incompleteTasks,
      completeTasks,
      addItem,
      deleteItem
    }
  }
}
</script>

<template>
  <h2>タスク</h2>
  <form @submit.prevent="addItem">
    <input type="text" v-model="newItem">
    <button type="submit">New Task</button>
  </form>
  <ul>
    <li v-for="(task, index) in incompleteTasks" :key="task.id">
      <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
      <span v-bind:class="{ done: task.isDone }">{{ task.item }}</span> <!-- 付与するCSSクラス名: 条件-->
      <input type="date" v-model="task.deadLine">
      <button @click="deleteItem(index)">削除</button>
    </li>
  </ul>

  <h2>完了済み</h2>
  <ul>
    <li v-for="(task) in completeTasks" :key="task.id">
      <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
      <span v-bind:class="{ done: task.isDone }">{{ task.item }}</span> <!-- 付与するCSSクラス名: 条件-->
      <input type="date" v-model="task.deadLine">
    </li>
  </ul>

  <!-- デバッグ用 -->
  <pre>{{ tasks }}</pre>
</template>

<style>
  #app ul {
    list-style: none;
  }

  #app li > span.done {
    text-decoration: line-through; /* 取り消し線 */
  }
</style>