import cookie from 'js-cookie'

//set in cookie
export const setCookie = (key, value) => {
    if(process.browser){
        cookie.set(key, value, {
            expires: 1
        })
    }
}

//remove from cookie
export const removeCookie = (key, value) => {
    if(process.browser){
        cookie.set(key)
    }
}

// get from cookie such as stored token
//useful when we need to make request to server with auth token
export const getCookie = key => {
    if(process.browser){
        return cookie.get(key)
    }
}


//set in local storage
export const setLocalStorage = (key, value) => {
    if(process.browser){
        localStorage.setItem(key, JSON.stringify(value))
    }
}

//remove from local storage
export const removeLocalStorage = (key) => {
    if(process.browser){
        localStorage.removeItem(key)
    }
}

//authenticating user by passing data to vookie and local storage during signin
export const authenticate = (response, next) => {
    setCookie('token', response.data.token)
    setLocalStorage('user', reponse.data.user)
    next()
}

//access user info from local storage
export const isAuth = () => {
    if(process.browser){
        const cookieChecked = getCookie('token')
        if(cookieChecked) {
            if(localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false;
            }
        }
    }
}