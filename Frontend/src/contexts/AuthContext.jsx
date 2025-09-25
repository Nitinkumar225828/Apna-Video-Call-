import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../enviroment";
import dotenv from "dotenv";
dotenv.config();

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${process.env.baseURL}/api/v1/users`
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", { name, username, password });
      if (request.status === httpStatus.CREATED) return request.data.message;
    } catch (err) {
      return err.response?.data?.message || "Registration failed";
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", { username, password });
      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        setUserData({ username }); // optional, can fetch full user info later
        router("/home");
      }
    } catch (err) {
      return err.response?.data?.message || "Login failed";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    router("/auth");
  };

  const getHistoryOfUser = async () => {
    try {
      const request = await client.get("/history", {
        params: { token: localStorage.getItem("token") }
      });
      return request.data;
    } catch (err) {
      return err.response?.data?.message || [];
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      const request = await client.post("/history", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode
      });
      return request.data;
    } catch (err) {
      return err.response?.data?.message || "Failed to add history";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        handleRegister,
        handleLogin,
        handleLogout,
        getHistoryOfUser,
        addToUserHistory
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
