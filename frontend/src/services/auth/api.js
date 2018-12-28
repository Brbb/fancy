import axios from "axios";

function handleCatch(error) {
  return { err: error.response.data.err ? error.response.data.err : "Something went wrong" };
}

var api = {
  isAuthorized: () => {
    let jwt = localStorage.getItem("jwt");
    return jwt != null;
  },

  login: (user, password) => {
    return axios
      .post("/api/auth/login", { email: user, password: password })
      .then(response => {
        if (!response.data.err) {
          localStorage.setItem("jwt", response.data.token);
          localStorage.setItem("me", response.data.userid);
        }
        return response.data;
      })
      .catch(handleCatch);
  },

  signup: (user, password, repeatPassword) => {
    return axios
      .post("/api/auth/signup", {
        email: user,
        password: password,
        repeatPassword: repeatPassword
      })
      .then(response => {
        return response.data;
      })
      .catch(handleCatch);
  },

  logout: jwt => {
    return axios
      .post("/api/auth/logout")
      .then(response => {
        return response.data;
      })
      .catch(handleCatch);
  }
};

export default api;
