import {jwtServerInstance} from "../index";
import qs from	'qs'

//==============================健康报备===============

export const emailSend = () => {
    return jwtServerInstance.request({
        url:'/email/send',
        method:'post'
    })
}
