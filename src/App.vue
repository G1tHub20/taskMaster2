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
        <span v-if="task.deadLine">DUE:{{ new Date(task.deadLine).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }) }}</span>
      </label>
      <!-- <button @click="deleteItem(task.id)">削除</button> -->
      <button @click="openModal(task)">編集</button>
    </li>
  </ul>

  <!-- モーダル -->
  <VueFinalModal v-model="isModalVisible" :click-to-close="false" content-class="modal-center">
    <div>
      <h2>タスクを編集</h2>
      <input v-model="editItem">
      DUE:<input type="date" v-model="editDeadLine">
      <div>
        <button @click="isModalVisible = false">キャンセル</button>
        <button @click="updateTask">更新</button>
        <button @click="deleteItem(editTask.value)">削除</button>
      </div>
    </div>
  </VueFinalModal>

  <h2>完了済み</h2>
  <ul>
    <li v-for="(task) in completeTasks" :key="task.id">
      <label>
        <input type="checkbox" v-model="task.isDone"> <!-- checkboxなのでboolean-->
        <span :class="{ done: task.isDone }">{{ task.item }}</span> <!-- 付与するCSSクラス名: 条件 -->
      </label>
    </li>
  </ul>

  <!-- デバッグ用 -->
  <pre>{{ state.tasks }}</pre>
  <pre>isModalVisible：{{ isModalVisible }}</pre>
  <pre>editTask：{{ editTask }}</pre>
  <pre>editItem：{{ editItem }}</pre>
  <pre>editDeadLine：{{ editDeadLine }}</pre>
</template>


<script setup>
  import { reactive, ref, watch, computed, onMounted } from 'vue'
  import { VueFinalModal } from 'vue-final-modal'

  // リアクティブな状態管理を行う
  const state = reactive({
    newItem: '',
    tasks: []
  })

  // モーダル制御用
  const isModalVisible = ref(false) // 単純なプリミティブ値のためrefを使用
  const editTask = ref(null)
  const editItem = ref('')
  const editDeadLine = ref('')

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

  // 編集モーダルを開く
  const openModal = (task) => {
    console.log('Opening modal for task:', task); // タスクが渡されているか確認
    editTask.value = task
    console.log('editTask.value in openModal:', editTask.value);
    editItem.value = task.item
    editDeadLine.value = task.deadLine
    isModalVisible.value = true
  }

  // 編集を保存
  const updateTask = () => {
    if (editTask.value) {
      editTask.value.item = editItem.value
      editTask.value.deadLine = editDeadLine.value
    }
    isModalVisible.value = false
  }
      
  // タスクの削除
  const deleteItem = (taskToDelete) => {
    console.log('Deleting task:', taskToDelete);  // 削除されるタスクの情報を確認
    // if (!taskToDelete) {
    //   console.log('No task to delete');
    // }
    if (!taskToDelete || !taskToDelete.id) {
      console.log('No task to delete or invalid task');
      return;
    }
    const index = state.tasks.findIndex(task => task.id === taskToDelete.id)
    if (index !== -1) {
      state.tasks.splice(index, 1)
      isModalVisible.value = false  // モーダルを閉じる
      editTask.value = null         // 編集状態のリセット
    }
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

  .modal-center {
    position: fixed;
    top: 25%;
    left: 75%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 1.5em;
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-width: 90%;
    width: 300px;
  }

</style>