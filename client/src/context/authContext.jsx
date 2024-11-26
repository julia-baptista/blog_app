import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();


// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || "null");

  const login = async(inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, { withCredentials: true })
    setCurrentUser(res.data)
  }

  const logout = async() => {
    await axios.get("http://localhost:8800/api/auth/logout", { withCredentials: true })
    setCurrentUser(null)
  }

  useEffect(()=> {
    localStorage.setItem("user", JSON.stringify(currentUser))
  }, [currentUser])

  const values = {
    currentUser,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  );
};