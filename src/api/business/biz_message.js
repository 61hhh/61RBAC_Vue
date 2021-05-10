import {jwtServerInstance} from "../index";
import qs from	'qs'

//==============================公告留言板===============

export const getMessage = (query) => {
    return jwtServerInstance.request({
        url:'/message/all',
        method:'get',
        data: query
    })
}

export const addMessage = (bizMessage) => {
    return jwtServerInstance.request({
        url:'/message/add',
        method:'post',
        data: bizMessage
    })
}

export const addReplay = (bizReplay) => {
    return jwtServerInstance.request({
        url:'/replay/add',
        method:'post',
        data: bizReplay
    })
}
