import React, { useEffect, useState } from "react";
import freshToken from "./services/resfreshToken.jsx";

import axios from "axios";
import logOut from "./services/logout.jsx";

const useUser = () => {
  const axiosjwt = axios.create();
  const [token, setToken] = useState();
  const [user, setUser] = useState({
    id : "",
    user_name: "",
    email: "",
    role: "",
    expire: "",
  });

  useEffect(() => {
    const setupUser = async () => {
      try {
        const response = await freshToken();
        setToken(response.token);
        setUser({
          id : response.decoded.id,
          user_name: response.decoded.uname,
          email: response.decoded.email,
          role: response.decoded.role,
          expire: response.decoded.exp,
        });
      } catch (error) {
        await logOut();
        console.log("responseData : ", error);
      }
    };

    setupUser();
  }, []);

  axiosjwt.interceptors.request.use(
    (config) => {
      const currentDate = new Date();
      if (user.expire * 1000 < currentDate.getTime()) {
        setupUser();
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return {
    user,
    token,
  };
};

export default useUser;