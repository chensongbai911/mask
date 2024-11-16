<template>
  <section class="create-project-wrap">
    <el-container style="height: 100%;">
      <el-header style="padding: 0;">
        <Header />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <section class="aside-menu">
            <section class="child">
              <svg aria-hidden="true" class="icon">
                <use xlink:href="#gt-plane-notebook-red"></use>
              </svg>
              我的项目
            </section>
            <section class="child">
              <svg aria-hidden="true" class="icon">
                <use xlink:href="#gt-plane-goback"></use>
              </svg>
              回收站
            </section>
          </section>
        </el-aside>
        <el-main>
          <section class="flex flex-col">
            <!-- 创建项目 -->
            <section class="create-btn" @click="createProject">
              <section class="flex items-center">
                <svg aria-hidden="true" class="icon">
                  <use xlink:href="#gt-plane-project-opened-blue"></use>
                </svg>
                <span>创建项目</span>
              </section>
              <svg aria-hidden="true" class="icon">
                <use xlink:href="#gt-line-add"></use>
              </svg>
            </section>
            <!-- 项目列表 -->
            <section class="project-list-wrap my-[30px]">
              <section class="title">
                <h3 class="font-bold">项目列表</h3>
              </section>
              <section
                class="card-list grid grid-flow-row grid-cols-4 gap-4 mt-3 pr-[40px]"
              >
                <el-card
                  class="card-container"
                  v-for="ele in projectList"
                  @click="goDetail(ele)"
                  :key="ele"
                >
                  <section class="relative card-wrap">
                    <section
                      class="absolute top-[0px] right-[0px] w-[16px] cursor-pointer delete-icon"
                      @click.stop="deleteProjectHandler(ele)"
                    >
                      <svg aria-hidden="true" class="icon">
                        <use xlink:href="#gt-line-delete"></use>
                      </svg>
                    </section>
                    <p class="text item font-bold text-[18px]">
                      {{ ele.projectName }}
                    </p>
                    <p class="text item">创建时间：{{ ele.createTime }}</p>
                    <p class="text item">更新时间：{{ ele.updateTime }}</p>
                  </section>
                </el-card>
              </section>
            </section>
          </section>
        </el-main>
      </el-container>
    </el-container>

    <Create
      title="创建项目"
      v-model:show="show"
      @closeDialog="closeModal"
      @confirmData="confirmModal"
    >
      <template #message>
        <el-form
          ref="ruleFormRef"
          style="max-width: 600px;"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          :size="formSize"
          status-icon
        >
          <el-form-item label="项目名字：" prop="projectName">
            <el-input
              v-model="ruleForm.projectName"
              placeholder="请输入项目名字"
            />
          </el-form-item>
          <el-form-item label="上传项目数据：" prop="file">
            <input
              @change="changeFile"
              type="file"
              id="file"
              accept=".xls,.xlsx"
            />
          </el-form-item>
        </el-form>
      </template>
    </Create>
  </section>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { ComponentSize, FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import Header from '@/components/Header/index.vue'
import Create from '@/components/Create/index.vue'
import { addProject, getProjectList, deleteProject } from '@/api/modules/index'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/produce'
interface RuleForm {
  projectName: string
  file: any
}

const show = ref(false)
const router = useRouter()
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  projectName: '',
  file: '',
})
const productStore = useProductStore()
const projectList = ref<
  Array<{
    projectName: ''
    createTime: ''
    updateTime: ''
  }>
>([]) //项目列表
const rules = computed(() => {
  return {
    projectName: [
      { required: true, message: '请输入项目名字', trigger: 'blur' },
      { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
    ],
    file: [{ required: true, message: '请上传项目数据', trigger: 'change' }],
  }
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      try {
        let formData = new FormData()
        formData.append('projectName', ruleForm.projectName)

        formData.append('file', ruleForm.file)
        const { data } = await addProject(formData)
        if (data?.data) {
          await getProject()
          closeModal()
          ElMessage({
            showClose: true,
            message: '操作成功',
            type: 'success',
          })
          // router.push({ path: '/list' })
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
    } else {
      console.log('error submit!', fields)
    }
  })
}

const closeModal = () => {
  show.value = false
  ruleForm.projectName = ''
  ruleForm.file = ''
}

const confirmModal = () => {
  submitForm(ruleFormRef.value)
}

// 删除项目
const deleteProjectHandler = async (ele: any) => {
  try {
    ElMessageBox.alert(`确定要删除项目${ele.projectName}吗？`, '删除', {
      confirmButtonText: '确 定',
      callback: async (action: Action) => {
        if (action === 'confirm') {
          const { data } = await deleteProject({ projectId: ele.projectId })
          if (data.code === 200) {
            ElMessage({
              showClose: true,
              message: '操作成功',
              type: 'success',
            })
            await getProject()
          }
        }
      },
    })
  } catch (error) {
    console.log(error)
  }
}

// 获取项目列表
const getProject = async () => {
  try {
    const { data } = await getProjectList()
    if (Array.isArray(data?.data)) {
      projectList.value = data.data
    } else {
      projectList.value = []
    }
  } catch (error) {
    console.log(error)
  }
}

const changeFile = (e: any) => {
  const { name } = e.target.files[0]
  const [a, type] = name.split('.')
  if (['xls', 'xlsx'].includes(type)) {
    ruleForm.file = e.target.files[0]
  } else {
    ElMessage({
      showClose: true,
      message: '上传的文件需要是 xlsx 或 xls 类型的文件',
      type: 'error',
    })
    ruleForm.file = ''
  }
}

// 创建项目
const createProject = () => {
  show.value = true
}

// 进入到项目详情
const goDetail = (ele: any) => {
  productStore.setProductDetail(ele)
  router.push({ path: `list/${ele.projectId}` })
}

onMounted(() => {
  getProject()
})
</script>
<style scoped lang="scss">
.create-project-wrap {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}

main {
  padding-top: 20px;
}

.create-btn {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #ddd;
  max-width: 20%;
  justify-content: space-between;
  cursor: pointer;

  span {
    padding-left: 20px;
  }
}

.aside-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 5px - 5px 5px rgba(0, 0, 0, 0.3),
    -10px - 10px 10px rgba(0, 0, 0, 0.2), -15px - 15px 15px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #e5e5e5;
  z-index: 99;

  .child {
    padding: 30px 0;
    text-align: center;
    background-color: #fff;
    color: #000;
    margin-bottom: 4px;
    cursor: pointer;
    transition: all 0.3s linear;
    font-family: sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 22px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-right: 8px;
    }

    &:hover {
      color: #da1f3f;
    }
  }
}

/* 后面的提示文字颜色 */
[type='file'] {
  color: red;
  /* font-size: 0; */
}

/* 主按钮的样式自定义 */
::file-selector-button {
  height: 33px;
  color: #fff;
  border-radius: 0.25rem;
  border: 1px solid #2a80eb;
  background-color: #2a80eb;
  cursor: pointer;
}

.card-wrap {
  transition: all 0.3s linear;

  .delete-icon {
    display: block;
  }
}

::-ms-browse {
  height: 33px;
  color: #fff;
  border-radius: 0.25rem;
  border: 1px solid #2a80eb;
  background-color: #2a80eb;
  cursor: pointer;
}

.project-list-wrap .card-list {
  cursor: pointer;
}

.card-container {
  background: #efefef;
  color: #000;
  border-radius: 14px;
  &:hover {
    transform: translateY(10px);
  }
  transition: all 0.3s linear;
}
</style>
