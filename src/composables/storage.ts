export let isDev = ref(false)
export let toggleDev = function(){
  isDev.value=!isDev.value
}

