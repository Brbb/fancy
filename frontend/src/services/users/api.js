import axios from "axios";
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`
  }
});

function handleCatch(err) {
  console.error(err);
  return { err: err.message ? err.message : "Something went wrong" };
}

var api = {
  getById: async id => {
    return axiosInstance
      .get(`/api/users/${id}`)
      .then(user => {
        console.log(user);
        return user.data;
      })
      .catch(handleCatch);
  },
  update: async user => {
    return axiosInstance
      .put(`/api/users/${user.id}`, user.settings)
      .then(user => {
        return user.data;
      })
      .catch(handleCatch);
  },
  updatePassword: async (user, oldPassword, newPassword, repeatNewPassword) => {
    return axiosInstance
      .put(`/api/users/${user.id}/password`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
        repeatNewPassword: repeatNewPassword
      })
      .then(result => {
        return result.data;
      })
      .catch(handleCatch);
  }
};

export default api;
