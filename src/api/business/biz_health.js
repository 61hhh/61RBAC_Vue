import {jwtServerInstance} from "../index";
import qs from	'qs'

//==============================健康报备===============

export const report = (health) => {
    return jwtServerInstance.request({
        url:'/health/report',
        method:'post',
        data: health
    })
}

export const isReport = () => {
    return jwtServerInstance.request({
        url:'/health/isreport',
        method:'get'
    })
}

export const history = (queryMap) => {
    return jwtServerInstance.request({
        url:'/health/history',
        method:'get',
        data: queryMap
    })
}
