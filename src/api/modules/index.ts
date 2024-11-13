
import http from "../index";
import qs from 'qs'

// 创建修改项目
export function addProject(formData:any): Promise<any> {
  return http({
    url: `/api/goods/import`,
    method: 'post',
    data:formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 返回商品列表
export function getProject(params:any): Promise<any> {
  return http({
    url: `/api/goods`,
    method: 'get',
    params
  });
}



