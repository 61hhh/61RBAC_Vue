import {jwtServerInstance} from "../index";
import qs from 'qs'

//OOS上传
export const uploadALI = (fileList) => {
    return jwtServerInstance.request({
        url: '/files/upload',
        method: 'post',
        data: fileList,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

//查询所有文件
export const getAllFile = () => {
    return jwtServerInstance.request({
        url: '/files/allFile',
        method: 'post'
    })
}

//参数查询
export const getQueryFile = (titleLike) => {
    return jwtServerInstance.request({
        url: '/files/queryFile',
        method: 'post',
        data: qs.stringify({
            titleLike
        })
    })
}

//更新一条数据记录
export const updateFile = (bizFile) => {
    return jwtServerInstance.request({
        url: '/files/updateFile',
        method: 'post',
        data: bizFile
    })
}

//新增一条数据记录
export const addFile = (bizFile) => {
    return jwtServerInstance.request({
        url: '/files/addFile',
        method: 'post',
        data: bizFile
    })
}

//删除一条数据记录
export const deleteFile = (deleteId) => {
    return jwtServerInstance.request({
        url: '/files/deleteFile',
        method: 'post',
        data: qs.stringify({
            id: deleteId
        })
    })
}
