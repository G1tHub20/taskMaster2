<template>
  <main>
    <form @submit.prevent="addItem">
      <p>
        <input type="text" v-model="state.newItem" placeholder="タスクを追加" autofocus> <!-- state.newItem に直接バインディング -->
      </p>
      <p>
        <button type="submit" class="addItem">タスクを追加</button>
      </p>
    </form>
    <h2>タスク</h2>
    <ul>
      <li v-for="(task) in incompleteTasks" :key="task.id" class="task-item"> <!-- v-forを使うときは各要素に一意なキーを付与すべき -->
    <div class="task-content">
      <label>
        <input type="checkbox" v-model="task.isDone">
        <span>{{ task.item }}</span>
      </label>
      <p v-if="task.deadLine" class="due">
        期限: {{ new Date(task.deadLine).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }) }}
      </p>
    </div>
    <button @click="openModal(task)" class="edit">編集</button>
      </li>
    </ul>

    <!-- モーダル -->
    <VueFinalModal v-model="isModalVisible" :click-to-close="false" content-class="modal-content">
      <button class="close-button" @click="isModalVisible = false">×</button>
      <div>
        <h2>タスクを編集</h2>
        <p><input type="text" v-model="editItem"></p>
        <p>期限: <input type="date" v-model="editDeadLine"></p>
        <div>
          <button @click="updateTask">更新</button>
          <button @click="deleteItem(editTask)">削除</button>
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
  </main>
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

  // const closeModal = () => {
  //   console.log("closeModal");
  //   this.isModalVisible.value = false;
  // }

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
    console.log('Deleting task:', taskToDelete.id);  // 削除されるタスクの情報を確認
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

</style>