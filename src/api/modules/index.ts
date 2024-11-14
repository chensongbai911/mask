
import http from "../index";
import qs from 'qs'

// 删除项目 
export function deleteProject(params:any): Promise<any> {
  return http({
    url: `/api/project`,
    method: 'delete',
    params
  });
}
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
export function getProductList(params:any): Promise<any> {
  return http({
    url: `/api/goods`,
    method: 'get',
    params
  });
}



// 获取项目列表
export function getProjectList(params?:any): Promise<any> {
  return http({
    url: `/api/projects`,
    method: 'get',
    params
  });
}



// 修改项目名字
export function editProjectName(data:any): Promise<any> {
  return http({
    url: `/api/project`,
    method: 'post',
    data
  });
}
