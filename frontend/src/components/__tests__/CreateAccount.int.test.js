import CreateAccount from "../CreateAccount/CreateAccount";
import axios from "axios";
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

describe("CreateAccount component, integration test", () => {
  describe("Account creation", () => {
    test("User types email and passwords, clicks on create and gets a user as result.", () => {
      let location = { pathname: "/new" };
      let historyMock = {
        push: jest.fn(path => {
          location.pathname = path;
        })
      };

      jest.spyOn(axios, "post").mockImplementation((url, body) => {
        if (url === "/api/auth/signup")
          return Promise.resolve(mockUser(body.email));
      });

      // User fills the form
      let wrapper = mount(<CreateAccount history={historyMock} />);
      wrapper
        .find('[name="emailField"]')
        .last()
        .simulate("change", { target: { value: "test@email.com" } });
      wrapper
        .find('[name="newPasswordField"]')
        .last()
        .simulate("change", { target: { value: "pass123" } });
      wrapper
        .find('[name="repeatNewPasswordField"]')
        .last()
        .simulate("change", { target: { value: "pass123" } });

      let createButton = wrapper.find('[name="create-button"]').first();

      expect(wrapper).toMatchSnapshot(); // fields are populated and button is ready to be clicked
      expect(wrapper.state().username).toEqual("test@email.com");
      expect(wrapper.state().password).toEqual("pass123");
      expect(wrapper.state().repeatPassword).toEqual("pass123");
      expect(createButton.prop("disabled")).toBeFalsy();
      expect(axios.post).toBeCalledTimes(0);

      // submit
      return createButton
        .prop("onClick")()
        .then(() => {
          // we called the signup API
          expect(axios.post).toBeCalledTimes(1);
          // successfully redirected to Login
          expect(location.pathname).toBe("/");
        });
    });

    test("User types existing email, clicks on create and gets error message.", () => {
      jest.spyOn(axios, "post").mockImplementation(url => {
        if (url === "/api/auth/signup") {
          return Promise.reject({
            response: { data: { err: "Email exists" } }
          });
        }
      });

      // User fills the form
      let wrapper = mount(<CreateAccount />);
      let createButton = wrapper.find('[name="create-button"]').first();

      // submit
      return createButton
        .prop("onClick")()
        .then(err => {
          // we called the signup API
          expect(axios.post).toBeCalledTimes(1);
          // sets the error message to err
          expect(wrapper.state().error).toBe("Email exists");
        });
    });
  });
});
