import { Api } from "../api";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const executor = ((args: {
    readonly uri: string,
    readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    readonly headers?: {readonly [key:string]: string},
    readonly body?: any,
}) => {
    const {uri, method, headers, body} = args

    const response = axiosInstance({
        url: uri,
        method,
        headers,
        data: body,
    })

    return response
})

export const api = new Api(executor)
