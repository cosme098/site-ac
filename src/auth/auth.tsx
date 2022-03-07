import { isExpired } from "react-jwt";

export const setTokenAndId = (token: string):void => {
  localStorage.setItem('token', token)
}

export const getToken = ():any => {
  return localStorage.getItem('token')
}
export const isAtheticated = ():boolean => {
  return !isExpired(getToken())
}
export const signOut = ():any => {
  return new Promise((resolve, reject) => {
    localStorage.removeItem('token')
    if(localStorage.getItem('token') == ''){
      resolve("Signed out")
    }
    reject("Error signing out")
  })
}