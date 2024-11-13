<template>
  <div class="conatiner">
    <Header />
    <main>
      <div class="box-wrap">
        <!-- 父类的池子 -->
        <section class="pb-[20px]">

          <p class="project-name">项目名称：特朗普</p>
          <p class="time">最后一次修改时间：2024.11.8 12:00</p>
          <p class="time">创建于2024.11.8</p>
        </section>

        <!-- 排序、收藏、统计 -->
        <section class="sort-wrap">
          <section class="sort-child"
            v-for="item in sortList">
            <span> {{ item.name }}</span>
            <el-image style="width: 15px; height:15px"
              :src="item.url"
              fit="cover" />
          </section>
        </section>

        <div class="darg-wrap"
          ref="parentNodeRef"
          :style="{
            gridTemplateColumns: `repeat(3, minmax(50px,1fr))`,
            gridRowGap: `5px`,
            gridColumnGap: `5px`,
          }">
          <div v-for="item in parentList"
            :key="item.brand"
            class="child-wrap mover">
            <el-image style="width: 100%; height:100%"
              :src="item.brandUrl"
              fit="cover" />
          </div>
        </div>
      </div>
      <section class="my-[20px] create-btn-wrap"
        @click="addChildClass">
        <el-image style="width: 22px; height:22px"
          :src="add"
          fit="cover" />
        <span class="px-[10px] cursor-pointer">创建组间</span>
      </section>
      <template v-if="childrenList.length">
        <!-- 子类的池子 -->
        <div class="box-wrap"
          v-for="item in childrenList">
          <h5> 全新归类标题：{{ item.classTitle }}</h5>
          <el-button type="success"
            class="my-[10px]"
            @click="createClassHandler(item)">创建组内</el-button>

          <Child :data="item.list"
            :key="item.id"
            @update="updateList" />
          <div class="children-list-wrap"
            v-if="Array.isArray(item.children) && item.children.length">
            <div class="box-wrap w-90"
              v-for="item in item.children"
              :key="item.id">
              <h5> 当前子类标题：{{ item.classTitle }}</h5>
              <div class="panel-wrap">

                <div class="text-[#000]">
                  总价： {{ hanlderTotalPrice(item.list).toFixed(2) }}
                </div>
              </div>
              <Child :data="item.list"
                :key="item.id"
                @update="updateList" />
            </div>

          </div>
        </div>

      </template>
    </main>

    <Create v-model:show="show"
      @closeDialog=" show = false"
      @confirmData="createConfirmData">
      <template #message>
        <span>确定要创建创建全新归类吗？</span>
      </template>
    </Create>

    <Create title="子类标题"
      v-model:show="classShow"
      @closeDialog=" show = false"
      @confirmData="createClassConfirmData">
      <template #message>
        <span>确定要创建子类吗？</span>
      </template>
    </Create>


    <Create title="全新归类标题"
      v-model:show="createShow"
      @closeDialog="closeDialogShow"
      @confirmData="confirmData">
      <template #message>
        <el-input v-model="classTitle"
          placeholder="请输入全新归类标题" />
      </template>
    </Create>

    <Create title="子类标题"
      v-model:show="createClassShow"
      @closeDialog="closeClassDialogShow"
      @confirmData="confirmClassData">
      <template #message>
        <el-input v-model="classTitle"
          placeholder="请输入子类标题" />
      </template>
    </Create>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect,onMounted } from 'vue'
import Header from '@/components/Header/index.vue'
import { useDraggable } from 'vue-draggable-plus'
import Create from '@/components/Create/index.vue'
import { List } from './data'
import { ElMessage } from 'element-plus'
import Child from './components/Child.vue'
import { useRouter } from 'vue-router'
import { md5 } from 'js-md5';
import sort from '@/assets/img/home/sort.png'
import star from '@/assets/img/home/star.png'
import total from '@/assets/img/home/total.png'
import add from '@/assets/img/home/add.png'
import { getProject } from '@/api/modules/index'

const sortList = ref([
  {
    url: sort,
    name: '排序'
  },
  {
    url: star,
    name: '凸显'
  },
  {
    url: total,
    name: '统计'
  }
])

const parentList = ref(List)
const createShow = ref(false)
const show = ref(false)
const classTitle = ref('') //子类标题
const childrenList = ref([]) // 子类集合
const router = useRouter()
const classShow = ref(false)
const createClassShow = ref(false)
const createClassObj = ref({}) // 创建的当前子类信息

const parentNodeRef = ref(null) // 父类的池子


// 获取商品列表
async function getProjectList() {
  try {
    const params = {
      projectId: '1856535649746681856'
    }
    const { data } = await getProject(params)
    console.log(data)
  }
  catch (error) {
  console.log(error)
}
}


onMounted(()=>{
  getProjectList()
})

// 价格统计
const totalPrice = computed(() => {
  return parentList.value.reduce((ele, next) => {
    ele += Number(next.brandPrice || 0)
    return ele
  }, 0)
})


// 所有的名字集合
const nameList = computed(() => {
  return childrenList.value.reduce((cur, next) => {
    cur.push(next.classTitle)
    if (Array.isArray(next.children) && next.children.length) {
      cur.push(...next.children.map((res) => res.classTitle))
    }
    return cur
  }, [])
})


// 主分类的面板集合
const hanlderTotalPrice = (list) => {
  return list.reduce((ele, next) => {
    ele += Number(next.brandPrice || 0)
    return ele
  }, 0)
}

// 更新子类的信息
const updateList = (list) => {
  console.log(list.data)
}

watchEffect(() => {
  if (parentNodeRef.value) {
    useDraggable(parentNodeRef.value, parentList.value, {
      animation: 150,
      ghostClass: 'ghost',
      group: 'people',
      onUpdate: () => {
        console.log('update list1', parentList.value)
      },
      onAdd: () => {
        console.log('add list1', parentList.value)
      },
      remove: () => {
        console.log('remove list1', parentList.value)
      }
    })
  }

})

// 生成UUID
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 创建当前子类
const createClassHandler = (res) => {
  createClassObj.value = res
  classShow.value = true
}


// 关闭创建子类标题弹框，清空输入框
const closeDialogShow = () => {
  createShow.value = false
  classTitle.value = ''
}


const closeClassDialogShow = () => {
  createClassShow.value = false
  classTitle.value = ''
}



// 添加子类,打开弹框
const addChildClass = () => {
  show.value = true
}

// 打开输入子类标题的弹框
const createConfirmData = () => {
  show.value = false
  createShow.value = true
}

const createClassConfirmData = () => {
  classShow.value = false
  createClassShow.value = true
}

// 添加大类标题
const confirmData = () => {
  if (!classTitle.value) {
    ElMessage.error('名字不能为空')
    return
  }

  if (nameList.value.includes(classTitle.value)) {
    ElMessage.error('名字已存在')
    return
  }
  if (classTitle.value) {
    childrenList.value.push({
      classTitle: classTitle.value,
      list: [],
      id: guid(),
      ref: md5(classTitle.value)
    })
    ElMessage.success('创建成功')
    closeDialogShow()
  }
}


// 添加子类信息
const confirmClassData = () => {
  if (!classTitle.value) {
    ElMessage.error('名字不能为空')
    return
  }
  if (nameList.value.includes(classTitle.value)) {
    ElMessage.error('名字已存在')
    return
  }
  const result = childrenList.value.find((ele) => {
    return ele.id === createClassObj.value.id
  })

  childrenList.value = childrenList.value.map((res) => {
    if (res.id === result.id) {
      if (Array.isArray(res.children)) {
        res.children.push({
          classTitle: classTitle.value,
          list: [],
          id: guid(),
          ref: md5(classTitle.value)
        })
      } else {
        res.children = []
        res.children.push({
          classTitle: classTitle.value,
          list: [],
          id: guid(),
          ref: md5(classTitle.value)
        })
      }

    }
    return res
  })
  ElMessage.success('创建成功')
  closeClassDialogShow()
}

</script>

<style lang="scss">
main {
  display: flex;
  padding-top: 56px;
}

.create-btn-wrap {
  width: 330px;
  height: 62px;
  background: #FFFFFF;
  border-radius: 10px 10px 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.project-name {
  font-size: 16px;
  color: #333333;
  padding-bottom: 30px;
  font-weight: 900;
}

.time {
  font-size: 12px;
  color: #999999;
  line-height: 28px;
}

.darg-wrap {
  display: grid;
}

.conatiner {
  display: flex;
  justify-content: flex;
  overflow-y: hidden;

  .box-wrap {
    margin: 20px;
    padding: 20px;
    width: 330px;
    border-radius: 4px;
    border: 2px solid #ffffff;
    max-height: 90vh;
    overflow-y: scroll;
    background: #ffffff;

    h5 {
      font-size: 20px;
      font-weight: 900;
      color: red;
      padding-top: 20px;
    }
  }


  .child-wrap {
    cursor: pointer;
    margin: 10px;
    border: 1px solid #e6e6ff;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 4px;

    span {
      font-size: 14px;
      font-weight: 900;
      color: rgb(0, 0, 0);
      padding: 5px 0;
    }

    p {
      font-size: 12px;
      font-weight: 900;
      color: rgb(0, 0, 0);
    }
  }

  .graggable {
    min-width: 300px;
  }

  .footer {
    padding-top: 30px;
    padding-bottom: 30px;
  }
}

.w-90 {
  width: 90% !important;
}

.sort-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .sort-child {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    padding-right: 6px;
    background: #F5F5F5;
    border-radius: 16px 16px 16px 16px;
    padding: 6px 12px;
    flex: 0 0 32%;
    justify-content: center;
    cursor: pointer;
    transition: all .3s linear;

    span {
      padding-right: 8px
    }

    &:hover {
      color: red;
    }
  }
}
</style>
