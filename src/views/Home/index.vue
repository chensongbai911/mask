<template>
  <div class="conatiner">
    <Header />
    <main>
      <div class="box-wrap fixed-wrap"
        style="position: sticky; left: 0px; z-index: 199;">
        <!-- 父类的池子 -->
        <section class="p-[20px] sticky">
          <!-- 项目的基本信息、 -->
          <section class="">
            <p class="project-name max-w-[90%] whitespace-nowrap text-ellipsis overflow-hidden ...">
              项目名称：{{ parentProName }}
            </p>
            <p class="time">最后一次修改时间：{{ productDetail.updateTime }}</p>
            <p class="time">创建于{{ productDetail.createTime }}</p>
            <section class="absolute top-[20px] right-[20px] w-[16px] cursor-pointer"
              @click="changeProjectName">
              <svg aria-hidden="true"
                class="icon">
                <use xlink:href="#gt-edit-history" />
              </svg>
            </section>
          </section>

          <!-- 排序、收藏、统计 -->
          <section class="sort-wrap">
            <section v-for="item in sortList"
              class="sort-child">
              <span>{{ item.name }}</span>
              <el-image style="width: 15px; height: 15px;"
                :src="item.url"
                fit="cover" />
            </section>
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
            <el-image style="width: 100%; height: 100%;"
              :src="item.goodsImage"
              fit="cover" />
          </div>
        </div>
      </div>

      <template v-if="childrenList.length">
        <!-- 子类的池子 -->
        <div v-for="item in childrenList"
          :key="item.id"
          class="box-wrap"
          :style="{
            flex: item.show ? '0 0 48%' : ' 0 0 400px',
          }">
          <!-- 最大组内面板数据 -->
          <section class="sticky py-[20px]">
            <section class="panel-wrap flex justify-center"
              v-if="item.statisticalIndicatorInfo">
              <section v-for="ele in bigPanelData"
                :key="ele.label"
                class="text-[12px] text-[#000] flex flex-col text-center">
                <section>{{ ele.label }}</section>
                <span class="text-[#FF9900] font-bold">
                  {{
                    (item.statisticalIndicatorInfo[ele.label] || '0').slice(
                      0,
                      6,
                    )
                  }}
                </span>
              </section>
            </section>
            <h5>
              组间标题：{{ item.groupName }}
              <!-- 放大分组的区域 -->
              <section class="absolute top-[20px] right-[60px] w-[16px] cursor-pointer delete-icon"
                @click="hoverBig(item)">
                <svg aria-hidden="true"
                  class="icon">
                  <use :xlink:href="item.show ? '#gt-plane-left' : '#gt-plane-right'
                    "></use>
                </svg>
              </section>
              <!-- 删除分组 -->
              <section class="absolute top-[20px] right-[20px] w-[16px] cursor-pointer delete-icon"
                @click.stop="deleteGroupHandler(item)">
                <svg aria-hidden="true"
                  class="icon">
                  <use xlink:href="#gt-plane-delete1"></use>
                </svg>
              </section>
            </h5>
          </section>

          <Child :style="{
            'grid-template-columns': item.show
              ? 'repeat(6, minmax(50px, 1fr))'
              : 'repeat(3, minmax(50px, 1fr))',
          }"
            :key="item.groupId"
            v-model="item.goodsList"
            :groupId="item.groupId"
            @update="updateList" />
          <div v-if="Array.isArray(item.childrenList) && item.childrenList.length"
            class="children-list-wrap">
            <div v-for="item in item.childrenList"
              :key="item.groupId"
              class="box-wrap w-90">
              <h5>组类标题：{{ item.groupName }}</h5>
              <div class="panel-wrap"
                v-if="item.statisticalIndicatorInfo">
                <div class="text-[#000] flex flex-col text-center"
                  v-for="ele in Object.keys(item.statisticalIndicatorInfo)">
                  <div>{{ ele }}</div>
                  <div class="text-[#FF9900] font-bold">
                    {{
                      (item.statisticalIndicatorInfo[ele] || '0').slice(0, 6)
                    }}
                  </div>
                </div>
              </div>
              <Child :style="{
                'grid-template-columns': item.show
                  ? 'repeat(6, minmax(50px, 1fr))'
                  : 'repeat(3, minmax(50px, 1fr))',
              }"
                :key="item.groupId"
                :groupId="item.groupId"
                v-model="item.goodsList"
                @update="updateList" />
            </div>
          </div>
          <!-- 创建组间的分类 -->
          <section class="my-[20px] create-btn-wrap w-[90%] bg-[#e1e1e1] m-auto"
            @click="createClassHandler(item)">
            <el-image style="width: 22px; height: 22px;"
              :src="add"
              fit="cover" />
            <span class="px-[10px] cursor-pointer">创建组内</span>
          </section>
        </div>
      </template>
      <!-- 创建组间的分类 -->
      <section class="my-[20px] create-btn-wrap"
        @click="addChildClass">
        <el-image style="width: 22px; height: 22px;"
          :src="add"
          fit="cover" />
        <span class="px-[10px] cursor-pointer">创建组间</span>
      </section>
    </main>

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

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useDraggable } from 'vue-draggable-plus'
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
  deleteGroup,
} from '@/api/modules/index'

// 大组的数据面板
const bigPanelData = ref([
  {
    label: '总ASIN',
    value: '',
  },
  {
    label: '销售额',
    value: '',
  },
  {
    label: '平均价格',
    value: '',
  },
  {
    label: '品牌数',
    value: '',
  },
  {
    label: '前三销售额',
    value: '',
  },
])

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

const parentList = ref<Array<Record<string, any>>>([]) // 最大的池子

const createShow = ref(false)
const show = ref(false)
const editChildShow = ref(false)
const classTitle = ref<string>('') // 子类标题
const childrenList = ref<Array<Record<string, any>>>([]) // 子类集合
const router = useRouter()
const classShow = ref(false)
const createClassShow = ref(false)
const createClassObj = ref<Record<string, any>>({}) // 创建的当前子类信息
const { productDetail } = storeToRefs(useProductStore())
const parentNodeRef = ref(null) // 父类的池子
const editShow = ref(false)
const route = useRoute()
const parentProName = ref(productDetail.value.projectName) // 父级池子的名字
const editParentProName = ref('')
const editChildInfo = ref<Record<string, any>>({})

// 变大
const hoverBig = (item) => {
  console.log('item', item)
  item.show = !item.show
  item.childrenList = item.childrenList.map((res) => {
    res.show = !res.show
    return res
  })
}

// 获取商品列表
async function getProduct() {
  try {
    const params = {
      projectId: route.params.id,
    }
    const { data } = await getProductList(params)
    if (Array.isArray(data?.data)) {
      parentList.value = data.data
    } else {
      parentList.value = []
    }
  } catch (error) {
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
      childrenList.value = data.data.map((res) => {
        res.show = false
        res.childrenList = res.childrenList.map((res) => {
          res.show = false
          return res
        })
        return res
      })
    } else {
      childrenList.value = []
    }
  } catch (error) {
    console.log(error)
  }
}

// 创建分组和编辑子类名字
async function createProductGroup(parentId?: string) {
  try {
    const { data } = await createGroup({
      projectId: route.params.id,
      groupName: classTitle.value,
      parentId,
    })
    if (data.code === 200) {
      ElMessage.success('创建成功')
      return data.data
    }
  } catch (error) {
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
    childrenList.value.push(data as any)
    closeDialogShow()
  }
}

// 删除商品分组
const deleteGroupHandler = async (ele: any) => {
  try {
    ElMessageBox.alert(`确定要删除分组${ele.groupName}吗？`, '删除', {
      confirmButtonText: '确 定',
      cancelButtonText: '取 消',
      callback: async (action: any) => {
        if (action === 'confirm') {
          const { data } = await deleteGroup({ groupId: ele.groupId })
          if (data.code === 200) {
            ElMessage({
              showClose: true,
              message: '操作成功',
              type: 'success',
            })
            await getProduct()
            await getGoodsGroupListHandler()
          }
        } else {
          console.log('取消')
        }
      },
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
  } catch (error) {
    console.log(error)
  }
}

// 创建商品分组 createGoodsGroupHandler
async function createGoodsGroupHandler(groupId: string, goodsId: string) {
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
  } catch (error) {
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
function changeChildProjectName(projectName: Record<string, any>) {
  editShow.value = true
  editParentProName.value = projectName.groupName
  editChildInfo.value = projectName
}
// 更改用户名
function changeProjectName() {
  editShow.value = true
  editParentProName.value = parentProName.value
}

// 确定更改用户名
async function confirmNameData() {
  try {
    const { data } = await editProjectName({
      projectId: route.params.id,
      projectName: editParentProName.value,
    })
    if (data.code === 200) {
      closeEditModal()
      ElMessage({
        showClose: true,
        message: '操作成功',
        type: 'success',
      })
      parentProName.value = data.data.projectName
      console.log('parentProName.value', parentProName.value, data.data)
    } else {
      ElMessage({
        showClose: true,
        message: '操作失败',
        type: 'error',
      })
    }
  } catch (error) {
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
    console.log('data', data)
    if (data.code === 200) {
      editChildInfo.value.groupName = editParentProName.value
      ElMessage.success('修改成功')
    }
  } catch (error) {
    console.log(error)
  }
}
// 所有的名字集合
const nameList = computed(() => {
  return childrenList.value.reduce(
    (cur: Array<any>, next: Record<string, any>) => {
      cur.push(next.groupName)
      if (Array.isArray(next.childrenList) && next.childrenList.length) {
        cur.push(...next.childrenList.map((res) => res.groupName))
      }
      return cur
    },
    [],
  )
})

// 更新子类的信息
function updateList({ data = { data: { goodsId: '' } }, groupId = '' }) {
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
function createClassHandler(res: any) {
  createClassObj.value = res
  createClassShow.value = true
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
  createShow.value = true
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
        res.childrenList.push(data)
      } else {
        res.childrenList = []
        res.childrenList.push(data)
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
    transition: all 0.3s linear;

    h5 {
      font-size: 16px;
      font-weight: 900;
      color: #000;
      padding-left: 20px;
      padding-top: 20px;
      position: relative;
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
  margin-top: 10px;

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

.sticky {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 99;
}

.fixed-wrap.box-wrap {
  flex: 0 0 440px;
  box-shadow: 0 10px 24px 0 rgba(37, 43, 58, .24);
}
</style>
