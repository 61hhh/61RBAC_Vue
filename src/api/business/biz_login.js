import {jwtServerInstance} from "../index";
import qs from 'qs'

//查询所有文章
export const getAllLogin = () => {
    return jwtServerInstance.request({
        url: '/login/all',
        method: 'post'
    })
}

//参数查询
export const getQueryLogin = (queryMap) => {
    return jwtServerInstance.request({
        url: '/login/query',
        method: 'post',
        data: qs.stringify({
            nameLike: queryMap.username,
            ipLike: queryMap.ip,
            locationLike: queryMap.location
        })
    })
}

//新增一条数据记录
export const addLogin = (bizLogin) => {
    return jwtServerInstance.request({
        url: '/login/add',
        method: 'post',
        data: bizLogin
    })
}

//删除一条数据记录
export const deleteLogin = (deleteId) => {
    return jwtServerInstance.request({
        url: '/login/delete',
        method: 'post',
        data: qs.stringify({
            id: deleteId
        })
    })
}

//删除一条数据记录
export const batchDelete = (logIds) => {
    return jwtServerInstance.request({
        url: '/login/batchDelete',
        method: 'post',
        data: qs.stringify({
            logIds: logIds
        })
    })
}
