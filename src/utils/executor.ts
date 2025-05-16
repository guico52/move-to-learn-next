import { Api } from "../api";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import Router from 'next/router';

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        
    },
    baseURL: '/back'
})

const executor = (async (args: {
    readonly uri: string,
    readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    readonly headers?: {readonly [key:string]: string},
    readonly body?: any,
}) => {
    const {uri, method, headers, body} = args

    const response = await axiosInstance({
        url: uri,
        method,
        headers: {
            ...headers,
            ...(useAuthStore.getState().tokenName ? {
              [useAuthStore.getState().tokenName]: useAuthStore.getState().tokenValue
            } : {})
        },
        data: body,
    })
    console.log("response", response.data)
    if (response.data.code === 401) {
        useAuthStore.getState().clearAuth()
        Router.push('/login')
    }
    return response
})

export default executor;

export const api = new Api(executor)
