import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
    state: () => {
        return {
            counter: 0,
            name: 'zs',
            age: 12
        }
    },
    getters: {},
    actions: {}
})