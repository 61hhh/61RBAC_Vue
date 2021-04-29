import {jwtServerInstance} from "../index";
import qs from	'qs'

//==============================邮件发送===============

export const emailSend = () => {
    return jwtServerInstance.request({
        url:'/email/send',
        method:'post'
    })
}
