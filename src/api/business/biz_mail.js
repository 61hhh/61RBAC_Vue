import {jwtServerInstance} from "../index";
import qs from	'qs'

//==============================邮件发送===============

export const emailSend = (bizMail) => {
    return jwtServerInstance.request({
        url:'/mail/send',
        method:'post',
        data: bizMail
    })
}

export const emailAdd = (bizMail) => {
    return jwtServerInstance.request({
        url:'/mail/add',
        method:'post',
        data: bizMail
    })
}

//删除一条数据记录
export const emailDelete = (deleteId) => {
    return jwtServerInstance.request({
        url: '/mail/delete',
        method: 'post',
        data: qs.stringify({
            id: deleteId
        })
    })
}

//查询当前用户的所有邮件
export const getAllEmail = () => {
    return jwtServerInstance.request({
        url: '/mail/all',
        method: 'post'
    })
}

//模糊查询
export const getQueryMail = (titleLike) => {
    return jwtServerInstance.request({
        url: '/mail/query',
        method: 'post',
        data: qs.stringify({
            titleLike
        })
    })
}
