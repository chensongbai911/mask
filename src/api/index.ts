
import http from "@/utils/http";
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


// 创建商品分组
export function createGroup(data:any): Promise<any> {
  return http({
    url: `/api/group`,
    method: 'post',
    data
  });
}

// 设置商品分组 
export function createGoodsGroup(data:any): Promise<any> {
  return http({
    url: `/api/goods/group`,
    method: 'post',
    data
  });
}


// 获取商品分组的信息 
export function getGoodsGroupList(params:any): Promise<any> {
  return http({
    url: `/api/goods/list`,
    method: 'get',
    params
  });
}

// 删除项目 
export function deleteGroup(params:any): Promise<any> {
  return http({
    url: `/api/group`,
    method: 'delete',
    params
  });
}