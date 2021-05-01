import {jwtServerInstance} from "../index";
import qs from 'qs'

//查询所有文章
export const getAllContent = () => {
    return jwtServerInstance.request({
        url: '/content/all',
        method: 'post'
    })
}

//参数查询
export const getQueryContent = (titleLike) => {
        return jwtServerInstance.request({
            url: '/content/query',
            method: 'post',
            data: qs.stringify({
                titleLike
            })
        })
    }

//更新一条数据记录
export const updateContent = (content) => {
    return jwtServerInstance.request({
        url: '/content/update',
        method: 'post',
        data: content
    })
}

//新增一条数据记录
export const addContent = (content) => {
    return jwtServerInstance.request({
        url: '/content/add',
        method: 'post',
        data: content
    })
}

//删除一条数据记录
export const deleteContent = (deleteId) => {
    return jwtServerInstance.request({
        url: '/content/delete',
        method: 'post',
        data: qs.stringify({
            id: deleteId
        })
    })
}
