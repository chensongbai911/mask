<template>
  <section class="create-project-wrap">
    <el-container style="height: 100%">
      <el-header style="padding: 0;">
        <!-- <Header /> -->
      </el-header>
      <el-container>
        <el-aside width="200px">
          <section class="aside-menu">
            <section class="child">
              我的项目
            </section>
            <section class="child">
              回收站
            </section>
          </section>

        </el-aside>
        <el-main>
          <main>
            <section class="create-btn"
              @click="createProject">
              <section class="flex items-center">
                <svg aria-hidden="true"
                  class="icon">
                  <use xlink:href="#gt-plane-project-opened-blue"></use>
                </svg>
                <span>创建项目</span>
              </section>
              <svg aria-hidden="true"
                class="icon">
                <use xlink:href="#gt-line-add"></use>
              </svg>
            </section>
            <Create title="创建项目"
              v-model:show="show"
              @closeDialog="closeModal"
              @confirmData="confirmModal">
              <template #message>
                <el-form ref="ruleFormRef"
                  style="max-width: 600px"
                  :model="ruleForm"
                  :rules="rules"
                  label-width="auto"
                  :size="formSize"
                  status-icon>
                  <el-form-item label="项目名字："
                    prop="projectName">
                    <el-input v-model="ruleForm.projectName"
                      placeholder="请输入项目名字" />
                  </el-form-item>
                  <el-form-item label="上传项目数据："
                    prop="file">
                    <input @change="changeFile"
                      type="file"
                      id="file" />
                  </el-form-item>
                </el-form>
              </template>
            </Create>
          </main>
        </el-main>
      </el-container>
    </el-container>


  </section>
</template>
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import Header from '@/components/Header/index.vue'
import Create from '@/components/Create/index.vue';
import { addProject } from '@/api/modules/index'
import { computed } from 'vue';
import { useRouter } from 'vue-router'
interface RuleForm {
  projectName: string
}


const show = ref(false)
const router = useRouter()
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  projectName: '',
  file: ''
})
const rules = computed(() => {
  return {
    projectName: [
      { required: true, message: '请输入项目名字', trigger: 'blur' },
      { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
    ],
    file: [
      { required: true, message: '请上传项目数据', trigger: 'change' }
    ],
  }
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      try {
        let formData = new FormData();
        formData.append('projectName', ruleForm.projectName)

        formData.append('file', ruleForm.file)
        const { data } = await addProject(formData)
        if (data?.data) {
          closeModal()
          ElMessage({
            showClose: true,
            message: '操作成功',
            type: 'success',
          })
          router.push({ path: '/list' })
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

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const closeModal = () => {
  show.value = false
}

const confirmModal = () => {
  submitForm(ruleFormRef.value)
}

const fileList = ref<UploadUserFile[]>([
])



const changeFile: UploadProps['onChange'] = (e) => {
  ruleForm.file = e.target.files[0]
}



// 创建项目
const createProject = () => {
  show.value = true
}
</script>
<style scoped lang='scss'>
.create-project-wrap {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}

main {
  padding-top: 0;
}

.create-btn {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #ddd;
  min-width: 20%;
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
  background-color: rgb(159, 159, 159);

  .child {
    padding: 30px 0;
    text-align: center;
    background-color: rgb(114, 114, 114);
    color: #fff;
    margin-bottom: 4px;
    cursor: pointer;
    transition: all .3s linear;

    &:hover {
      color: red;
    }
  }

}
</style>
