<template>
  <div class="conatiner">
    <Header />
    <main>
      <div class="box-wrap">
        <!-- 父类的池子 -->
        <section class="p-[20px] relative">
          <p class="project-name">
            项目名称：{{ parentProName }}
          </p>
          <p class="time">
            最后一次修改时间：{{ productDetail.updateTime }}
          </p>
          <p class="time">
            创建于{{ productDetail.createTime }}
          </p>
          <section class="absolute top-[20px] right-[20px] w-[16px] cursor-pointer"
            @click="changeProjectName">
            <svg aria-hidden="true"
              class="icon">
              <use xlink:href="#gt-line-edit" />
            </svg>
          </section>
        </section>

        <!-- 排序、收藏、统计 -->
        <section class="sort-wrap">
          <section v-for="item in sortList"
            class="sort-child">
            <span> {{ item.name }}</span>
            <el-image style="width: 15px; height: 15px"
              :src="item.url"
              fit="cover" />
          </section>
        </section>
        <!-- 父级池子的商品列表 -->
        <div ref="parentNodeRef"
          class="darg-wrap"
          :style="{
            gridTemplateColumns: `repeat(3, minmax(50px,1fr))`,
            gridRowGap: `5px`,
            gridColumnGap: `5px`,
          }">
          <div v-for="item in parentList"
            :key="item.goodsId"
            class="child-wrap mover">
            <el-image style="width: 100%; height: 100%"
              :src="item.goodsImage"
              fit="cover" />
          </div>
        </div>
      </div>

      <template v-if="childrenList.length">
      
        <!-- 子类的池子 -->
        <div v-for="item in childrenList"
          :key="item.id"
          class="box-wrap">
            <!-- 最大组内面板数据 -->
          <section class="panel-wrap flex justify-center" v-if="item.statisticalIndicatorInfo">
            <section v-for="ele in bigPanelData"
              :key="ele.label" class="text-[12px] text-[#000] flex flex-col text-center">
              <section>{{ ele.label }}</section>
              <span class="text-[#FF9900] font-bold">{{ item.statisticalIndicatorInfo[ele.label] || 0}}</span>
            </section>
          </section>
          <h5>组间标题：{{ item.groupName }}</h5>
          <!-- <section class="absolute top-[6px] right-0 w-[16px] cursor-pointer"
            @click="changeChildProjectName(item)">
            <svg aria-hidden="true"
              class="icon">
              <use xlink:href="#gt-line-edit" />
            </svg>
          </section> -->
          <Child :key="item.groupId"
            v-model="item.goodsList"
            :groupId="item.groupId"
            @update="updateList" />
          <div v-if="Array.isArray(item.childrenList) && item.childrenList.length"
            class="children-list-wrap">
            <div v-for="item in item.childrenList"
              :key="item.groupId"
              class="box-wrap w-90">
              <h5>当前子类标题：{{ item.groupName }}</h5>
              <div class="panel-wrap"
                v-if="item.statisticalIndicatorInfo">
                <div class="text-[#000] flex flex-col text-center"
                  v-for="ele in Object.keys(item.statisticalIndicatorInfo)">
                  <div>{{ ele }}</div>
                  <div class="text-[#FF9900] font-bold">{{ item.statisticalIndicatorInfo[ele] }}</div>
                </div>
              </div>
              <Child :key="item.groupId"
                :groupId="item.groupId"
                v-model="item.goodsList"
                @update="updateList" />
            </div>
          </div>
          <!-- 创建组间的分类 -->
          <section class="my-[20px] create-btn-wrap w-[90%] bg-[#e1e1e1] m-auto"
            @click="createClassHandler(item)">
            <el-image style="width: 22px; height: 22px"
              :src="add"
              fit="cover" />
            <span class="px-[10px] cursor-pointer">创建组内</span>
          </section>
        </div>
      </template>
      <!-- 创建组间的分类 -->
      <section class="my-[20px] create-btn-wrap"
        @click="addChildClass">
        <el-image style="width: 22px; height: 22px"
          :src="add"
          fit="cover" />
        <span class="px-[10px] cursor-pointer">创建组间</span>
      </section>
    </main>

    <Create v-model:show="show"
      title="创建组间"
      @close-dialog="show = false"
      @confirm-data="createConfirmData">
      <template #message>
        <span>确定要创建组间大类吗？</span>
      </template>
    </Create>

    <!-- 更改项目名字 -->
    <Create v-model:show="editShow"
      title="更改项目名称"
      @close-dialog="closeEditModal"
      @confirm-data="confirmNameData">
      <template #message>
        <el-input v-model="editParentProName"
          placeholder="请输入项目名称" />
      </template>
    </Create>

    <!-- 更改分组项目的名字 -->
    <Create v-model:show="editChildShow"
      title="编辑名称"
      @close-dialog="closeEditModal"
      @confirm-data="confirmChildNameData">
      <template #message>
        <el-input v-model="editParentProName"
          placeholder="请输入名称" />
      </template>
    </Create>

    <Create v-model:show="classShow"
      title="创建组内"
      @close-dialog="classShow = false"
      @confirm-data="createClassConfirmData">
      <template #message>
        <span>确定要创建组内吗？</span>
      </template>
    </Create>

    <Create v-model:show="createShow"
      title="添加组间标题"
      @close-dialog="closeDialogShow"
      @confirm-data="confirmData">
      <template #message>
        <el-input v-model="classTitle"
          placeholder="请输入组间标题" />
      </template>
    </Create>

    <Create v-model:show="createClassShow"
      title="组内标题"
      @close-dialog="closeClassDialogShow"
      @confirm-data="confirmClassData">
      <template #message>
        <el-input v-model="classTitle"
          placeholder="请输入组内标题" />
      </template>
    </Create>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useDraggable } from 'vue-draggable-plus'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import Child from './components/Child.vue'
import Create from '@/components/Create/index.vue'
import Header from '@/components/Header/index.vue'
import { useProductStore } from '@/stores/produce'
import sort from '@/assets/img/home/sort.png'
import star from '@/assets/img/home/star.png'
import total from '@/assets/img/home/total.png'
import add from '@/assets/img/home/add.png'
import {
  createGoodsGroup,
  createGroup,
  editProjectName,
  getGoodsGroupList,
  getProductList,
} from '@/api/modules/index'

// 大组的数据面板
const bigPanelData = ref([{
  label: '总ASIN',
  value: '',
}, {
  label: '销售额',
  value: '',
}, {
  label: '平均价格',
  value: '',
}, {
  label: '品牌数',
  value: '',
}, {
  label: '前三销售额',
  value: '',
}])

const sortList = ref([
  {
    url: sort,
    name: '排序',
  },
  {
    url: star,
    name: '凸显',
  },
  {
    url: total,
    name: '统计',
  },
])

const parentList = ref([]) // 最大的池子

const createShow = ref(false)
const show = ref(false)
const editChildShow = ref(false)
const classTitle = ref('') // 子类标题
const childrenList = ref([]) // 子类集合
const router = useRouter()
const classShow = ref(false)
const createClassShow = ref(false)
const createClassObj = ref({}) // 创建的当前子类信息
const { productDetail } = storeToRefs(useProductStore())
const parentNodeRef = ref(null) // 父类的池子
const editShow = ref(false)
const route = useRoute()
const parentProName = ref(productDetail.value.projectName) // 父级池子的名字
const editParentProName = ref('')
const editChildInfo = ref({})

// 获取商品列表
async function getProduct() {
  try {
    const params = {
      projectId: route.params.id,
    }
    const { data } = await getProductList(params)
    if (Array.isArray(data?.data)) {
      parentList.value = data.data
    }
    else {
      parentList.value = []
    }
  }
  catch (error) {
    console.log(error)
  } finally {
    console.log(parentList.value)
  }
}

// 获取项目分组信息
async function getGoodsGroupListHandler() {
  try {
    const params = {
      projectId: route.params.id,
    }
    const { data } = await getGoodsGroupList(params)
    if (Array.isArray(data?.data)) {
      childrenList.value = data.data
    }
    else {
      childrenList.value = []
    }
  }
  catch (error) {
    console.log(error)
  }
}

// 创建分组和编辑子类名字
async function createProductGroup(parentId) {
  try {
    const { data } = await createGroup({
      projectId: route.params.id,
      groupName: classTitle.value,
      parentId
    })
    if (data.code === 200) {
      ElMessage.success('创建成功')
      return data.data
    }
  }
  catch (error) {
    console.log(error)
  }
}

// 添加大类标题
async function confirmData() {
  if (!classTitle.value) {
    ElMessage.error('名字不能为空')
    return
  }

  if (nameList.value.includes(classTitle.value)) {
    ElMessage.error('名字已存在')
    return
  }
  if (classTitle.value) {
    const data = await createProductGroup()
    childrenList.value.push(data)
    closeDialogShow()
  }
}

// 创建商品分组 createGoodsGroupHandler
async function createGoodsGroupHandler(groupId, goodsId) {
  try {
    const { data } = await createGoodsGroup({
      groupId,
      goodsId,
    })
    if (data.code === 200) {
      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success',
      })
    }
  }
  catch (error) {
    console.log(error)
  }
}

// 关闭更改项目名字的弹框
function closeEditModal() {
  editShow.value = false
  editChildShow.value = false
  editParentProName.value = ''
}

//更改子项目的名字的弹框 
function changeChildProjectName(projectName) {
  editShow.value = true
  editParentProName.value = projectName.groupName
  editChildInfo.value = projectName
}
// 更改用户名
function changeProjectName() {
  editChildShow.value = true
  editParentProName.value = productDetail.value.projectName
}

// 确定更改用户名
async function confirmNameData() {
  try {
    const { data } = await editProjectName({
      projectId: route.params.id,
      projectName: parentProName.value,
    })
    if (data.code === 200) {
      closeEditModal()
      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success',
      })
      parentProName.value = editParentProName.value
    }
    else {
      ElMessage({
        showClose: true,
        message: '操作失败',
        type: 'error',
      })
    }
  }
  catch (error) {
    console.log(error)
  }
}


// 更改子类的用户名称 
async function confirmChildNameData() {
  try {
    const { data } = await createGroup({
      groupId: editChildInfo.value.groupId,
      groupName: editParentProName.value,
    })
    if (data.code === 200) {
      editChildInfo.value.groupName = editParentProName.value
      ElMessage.success('修改成功')
    }
  }
  catch (error) {
    console.log(error)
  }
}
// 所有的名字集合
const nameList = computed(() => {
  return childrenList.value.reduce((cur, next) => {
    cur.push(next.groupName)
    if (Array.isArray(next.childrenList) && next.childrenList.length) {
      cur.push(...next.childrenList.map(res => res.groupName))
    }
    return cur
  }, [])
})

// 更新子类的信息
function updateList({ data, groupId }) {
  const { goodsId = '' } = data.data
  createGoodsGroupHandler(groupId, goodsId)
}

watchEffect(async () => {
  await getProduct()
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
      },
    })
  }
})

// 创建当前子类
function createClassHandler(res) {
  createClassObj.value = res
  classShow.value = true
}

// 关闭创建子类标题弹框，清空输入框
function closeDialogShow() {
  createShow.value = false
  classTitle.value = ''
}

function closeClassDialogShow() {
  createClassShow.value = false
  classTitle.value = ''
}

// 添加子类,打开弹框
function addChildClass() {
  show.value = true
}

// 打开输入子类标题的弹框
function createConfirmData() {
  show.value = false
  createShow.value = true
}

function createClassConfirmData() {
  classShow.value = false
  createClassShow.value = true
}

// 添加子类信息
async function confirmClassData() {
  if (!classTitle.value) {
    ElMessage.error('名字不能为空')
    return
  }
  if (nameList.value.includes(classTitle.value)) {
    ElMessage.error('名字已存在')
    return
  }
  const result = childrenList.value.find((ele) => {
    return ele.groupId === createClassObj.value.groupId
  })
  const data = await createProductGroup(createClassObj.value.groupId)
  childrenList.value = childrenList.value.map((res) => {
    if (res.groupId === result.groupId) {
      if (Array.isArray(res.childrenList)) {
        if (Array.isArray(data.goodsList)) {
          res.childrenList.push(data)
        } else {
          data.goodsList = []
          res.childrenList.push(data)
        }

      }
    }
    return res
  })
  ElMessage.success('创建成功')
  closeClassDialogShow()
}

onMounted(() => {
  getGoodsGroupListHandler()
})
</script>

<style lang="scss">
main {
  display: flex;
  padding-top: 56px;
}

.create-btn-wrap {
  width: 330px;
  height: 62px;
  background: #ffffff;
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
  padding-bottom: 10px;
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
    margin-top: 20px;
    margin-right: 20px;
    width: 440px;
    border-radius: 4px;
    border: 2px solid #ffffff;
    max-height: 90vh;
    overflow-y: scroll;
    background: #ffffff;
    position: relative;

    h5 {
      font-size: 16px;
      font-weight: 900;
      color: #000;
      padding-left: 20px;
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
  padding: 20px;

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
    background: #f5f5f5;
    border-radius: 16px 16px 16px 16px;
    padding: 6px 12px;
    flex: 0 0 32%;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s linear;

    span {
      padding-right: 8px;
    }

    &:hover {
      color: red;
    }
  }
}

.panel-wrap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 20px;
  row-gap: 10px;
  margin-top: 20px;
  font-size: 12px;
}
</style>
