import axios from "axios";

function getAxiosConfig() {
  if(localStorage.getItem("jwt") == null) throw new Error('User not authenticated')
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
  };
}

function handleCatch(err) {
  return { err: err.response.data.err ? err.response.data.err : "Something went wrong" };
}

var api = {
  getById: async id => {
    return axios
      .get(`/api/users/${id}`, getAxiosConfig())
      .then(user => {
        return user.data;
      })
      .catch(handleCatch);
  },
  update: async user => {
    return axios
      .put(`/api/users/${user.id}`, user.settings, getAxiosConfig())
      .then(user => {
        return user.data;
      })
      .catch(handleCatch);
  },
  updatePassword: async (user, oldPassword, newPassword, repeatNewPassword) => {
    return axios
      .put(
        `/api/users/${user.id}/password`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          repeatNewPassword: repeatNewPassword
        },
        getAxiosConfig()
      )
      .then(result => {
        return result.data;
      })
      .catch(handleCatch);
  },
  delete: async user => {
    return axios
      .delete(`/api/users/${user.id}`, getAxiosConfig())
      .then(user => {
        return user.data;
      })
      .catch(handleCatch);
  }
};

export default api;
