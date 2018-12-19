import axios from "axios";

var auth = {
  isSignedIn: () => {
    let jwt = localStorage.getItem("jwt");
    return jwt != null;
  },
  login: (user, password) => {
    return axios
      .post("/api/auth/login", { email: user, password: password })
      .then(response => {
        console.log(response)
        if (!response.data.err) {
          localStorage.setItem("jwt", response.data.token);
          localStorage.setItem("me", response.data.userid);
        }
        return response.data;
      })
      .catch(err => {
        console.log(err);
        return { success: false, reason: err };
      });
  },
  signup: (user, password, repeatPassword) => {
    return axios
      .post("/api/auth/signup", {
        email: user,
        password: password,
        repeatPassword: repeatPassword
      })
      .then(response => {
        return { success: true, payload: response };
      })
      .catch(err => {
        return {
          success: false,
          reason: "Error creating the new user, please retry!"
        };
      });
  },
  logout: jwt => {
    return axios
      .post("/api/auth/logout")
      .then(response => {
        return { success: true, payload: response.data };
      })
      .catch(err => {
        console.log(err);
        return { success: false, reason: err };
      });
  }
};

export default auth;
