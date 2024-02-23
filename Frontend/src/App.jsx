import React, { useState, useEffect } from 'react'
import { useAuth } from "@clerk/clerk-react"
import './App.css'
import { Test } from './pages'
import Routes from "./routes";
import axios from "axios";

function App() {

  const { getToken } = useAuth()
  const [token, setToken] = useState(localStorage.getItem("clerk_streamify_token"))

  getToken({ template: 'streamify_user' }).then((temp) => {

    if (!token){
      localStorage.setItem('clerk_streamify_token', temp)
      setToken(temp)
    }
  })

  // useEffect(() => {
  //   delete axios.defaults.headers.common["authorization"]
  //   axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  // }, [token])

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + `${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('clerk_streamify_token')
    }
}, [token]);

  // useEffect(() => {

  //   const setHeader = async () => {
  //     setToken()
  //     // console.log(token)
  //   }

  //   setHeader()
  // }, [token]);

  return (
    <>
      {/* <Test/> */}
      {/* <Signup/> */}
      {/* <Signin/> */}

      <Routes />
    </>
  )
}

export default App
