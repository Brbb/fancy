import Login from "../Login/Login";
import axios from "axios";
import userApi from "../../services/users/api";
import authApi from "../../services/auth/api";
jest.mock("axios");

const mockUser = email => {
  return {
    data: {
      id: "asd123",
      email: email,
      settings: {
        language: "English",
        isPrivate: false
      }
    }
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Login component, integration test", () => {
  describe("Login successful", () => {
    test("User types email and passwords, clicks on login and goes to /settings.", () => {
      let location = {};
      let historyMock = {
        push: jest.fn(payload => {
          location = payload;
        })
      };

      jest.spyOn(axios, "post").mockImplementation(() => {
        return Promise.resolve({
          data: {
            userId: mockUser().data.id,
            token: "any-valid-token"
          }
        });
      });

      jest.spyOn(axios, "get").mockImplementation(url => {
        return Promise.resolve(mockUser());
      });

      jest.spyOn(userApi, "getById");
      jest.spyOn(authApi, "login");

      let wrapper = mount(<Login history={historyMock} />);

      wrapper
        .find('[name="emailField"]')
        .last()
        .simulate("change", { target: { value: "test@email.com" } });
      wrapper
        .find('[name="passwordField"]')
        .last()
        .simulate("change", { target: { value: "pass123" } });

      let loginButton = wrapper.find('[name="login-button"]').first();

      expect(wrapper).toMatchSnapshot(); // fields are populated and button is ready to be clicked
      expect(wrapper.state().username).toEqual("test@email.com");
      expect(wrapper.state().password).toEqual("pass123");
      expect(loginButton.prop("disabled")).toBeFalsy();
      expect(axios.post).toBeCalledTimes(0);
      expect(axios.get).toBeCalledTimes(0);

      // submit
      return loginButton
        .prop("onClick")()
        .then(() => {
          // we called the login API
          expect(axios.post).toBeCalledTimes(1);
          expect(authApi.login).toBeCalledWith(
            wrapper.state().username,
            wrapper.state().password
          );

          // we called then the user API to retrieve the user by id with the previous result
          expect(userApi.getById).toBeCalledTimes(1);
          expect(userApi.getById).toBeCalledWith(mockUser().data.id);
          expect(axios.get).toBeCalledTimes(1);

          // successfully redirected to setting with user as prop
          expect(location.pathname).toBe("/settings");
          expect(location.state.user.id).toBe(mockUser().data.id);
        });
    });
  });
});
