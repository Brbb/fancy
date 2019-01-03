import CreateAccount from "./CreateAccount";
import authApi from "../../services/auth/api";

describe("CreateAccount component", () => {
  describe("Rendering tests", () => {
    test("CreateAccount mounts and fields are initialized correctly", () => {
      let wrapper = shallow(<CreateAccount />);
      let createButton = wrapper.find('[name="create-button"]').first();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().password).toEqual("");
      expect(wrapper.state().repeatPassword).toEqual("");
      expect(wrapper.state().error).toEqual("");
      expect(createButton.prop("disabled")).toBeTruthy();
    });

    test("Save button gets enabled correctly on field/state changes", () => {
      let wrapper = mount(<CreateAccount />);
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

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().username).toEqual("test@email.com");
      expect(wrapper.state().password).toEqual("pass123");
      expect(wrapper.state().repeatPassword).toEqual("pass123");

      // re-find the button to include re-rendered prop
      let saveButton = wrapper.find('[name="create-button"]').first();
      expect(saveButton.prop("disabled")).toBeFalsy();

      wrapper
        .find('[name="repeatNewPasswordField"]')
        .last()
        .simulate("change", { target: { value: "wrong" } });
      expect(wrapper.state().repeatPassword).toEqual("wrong");
      expect(wrapper.state().error).toEqual("Passwords must match");
    });
  });

  describe("Behavioral test", () => {
    test("Create button calls signup and on success goes to login", () => {
      let location = { pathname: "/new" };
      let historyMock = {
        push: jest.fn(path => {
          location.pathname = path;
        })
      };

      let wrapper = shallow(<CreateAccount history={historyMock} />);
      jest.spyOn(authApi, "signup").mockImplementation(() => {
        return Promise.resolve({});
      });

      expect(authApi.signup).toBeCalledTimes(0);
      expect(location.pathname).toBe("/new");

      let createButton = wrapper.find('[name="create-button"]').first();
      return createButton
        .prop("onClick")()
        .then(() => {
          expect(authApi.signup).toBeCalledTimes(1);
          expect(location.pathname).toBe("/");
          jest.clearAllMocks();
        });
    });

    test("Save button calls updatePassword and on error shows a message", () => {
      let location = { pathname: "/new" };
      let historyMock = {
        push: jest.fn(path => {
          location.pathname = path;
        })
      };

      let wrapper = shallow(<CreateAccount history={historyMock} />);
      jest.spyOn(authApi, "signup").mockImplementation(() => {
        return Promise.resolve({ err: "Any" });
      });

      expect(authApi.signup).toBeCalledTimes(0);
      expect(location.pathname).toBe("/new");

      let createButton = wrapper.find('[name="create-button"]').first();
      return createButton
        .prop("onClick")()
        .then(() => {
          let messageField = wrapper.find("Message").first();
          expect(authApi.signup).toBeCalledTimes(1);
          expect(location.pathname).toBe("/new");
          expect(wrapper.state().error).toBe("Any");
          expect(messageField.prop("text")).toBe("Any");
          jest.clearAllMocks();
        });
    });
  });
});
