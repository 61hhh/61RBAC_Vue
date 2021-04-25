import HttpRequest from '@/lib/request'
export const backendServer = "http://localhost:8202"
export const jwtServerInstance = new HttpRequest(backendServer)
