export const getSession = (key: string) => sessionStorage.getItem(key)

export const setSession = (key: string, value: string) => sessionStorage.setItem(key, value)

export const removeSession = (key: string) => sessionStorage.removeItem(key)

export const clearSession = () => sessionStorage.clear()
