<template>
  <h2>タスク</h2>
  <form @submit.prevent="addItem">
    <input type="text" v-model="state.newItem"> <!-- state.newItem に直接バインディング -->
    <button type="submit">タスクの追加</button>
  </form>
  <ul>
    <li v-for="(task) in incompleteTasks" :key="task.id"> <!-- v-forを使うときは各要素に一意なキーを付与すべき -->
      <label>
        <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
        <span>{{ task.item }}</span>
      </label>
      <!-- <input type="date" v-model="task.deadLine"> -->
      <!-- <button @click="deleteItem(task.id)">削除</button> -->
    </li>
  </ul>

  <h2>完了済み</h2>
  <ul>
    <li v-for="(task) in completeTasks" :key="task.id">
      <label>
        <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
        <span :class="{ done: task.isDone }">{{ task.item }}</span> <!-- 付与するCSSクラス名: 条件 -->
      </label>
      <!-- <input type="date" v-model="task.deadLine"> -->
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

  /* #app {
    max-width: 600px;
    margin: 0 auto;
  }
  #app h2 {
    text-align: center;
  } */
  #app ul {
    list-style: none;
  }
  /* #app ul:nth-of-type(1) {
    height: 250px;
  } */
  #app li label > span.done {
    text-decoration: line-through; /* 取り消し線 */
  }
  #app input[type=checkbox] {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0;
    outline: none;
    appearance: none;
  }

  #app input[type=checkbox] {
    content: "";
    /* display: inline-block; */
    position: relative;
    top: 0.3em;
    margin: 0 5px 0 0;
    background-image: none, url("src/assets/icon_incomp.svg");
    background-size: 70% auto, 100%;
    background-position: top 55% left 50%, 0 0;
    background-repeat: no-repeat, no-repeat;
    width: 25px;
    height: 25px;
  }
  #app input[type="checkbox"]:checked {
    background-image: none, url("src/assets/icon_comp.svg");
  }
</style>