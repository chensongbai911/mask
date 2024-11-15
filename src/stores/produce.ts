import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('Product', () => {
  const productDetail = ref<Record<string,any>>({})
  function setProductDetail(data: any) {
    productDetail.value = data
  }

  return { productDetail, setProductDetail }
}, {
  persist: {
    storage: localStorage,
    key: 'product',
  },
})
