import Login from "./Login";
import authApi from "../../services/auth/api";
import userApi from "../../services/users/api";

describe("Login component", () => {
  describe("Rendering tests", () => {
    test("Login shallow-renders correctly", () => {
      const wrapper = shallow(<Login />);
      expect(wrapper).toMatchSnapshot();
    });

    test("Login mounts and evaluates state correctly", () => {
      const wrapper = mount(<Login />);
      wrapper.setState({ username: "test", password: "12345" });
      expect(wrapper).toMatchSnapshot();
      expect(
        wrapper
          .find({ value: "test" })
          .first()
          .text()
      ).toEqual("Email");
      expect(
        wrapper
          .find({ value: "12345" })
          .first()
          .text()
      ).toEqual("Password");
    });
  });

  describe("Props tests", () => {
    test("Login button is disabled if one InputField is empty", () => {
      const wrapper = shallow(<Login />);
      wrapper.setState({ username: "test" });
      const loginButton = wrapper.find("Button").first();
      expect(loginButton.prop("name")).toEqual("login-button");
      expect(loginButton.prop("disabled")).toBeTruthy();
    });

    test("Login button is enabled if the InputFields have value", () => {
      const wrapper = shallow(<Login />);
      wrapper.setState({ username: "test", password: "1234" });
      const loginButton = wrapper.find("Button").first();
      expect(loginButton.prop("name")).toEqual("login-button");
      expect(loginButton.prop("disabled")).toBeFalsy();
    });
  });

  describe("Navigation test", () => {
    test("Create account button redirects to /new", () => {
      const locationMock = { pathname: location.pathname };

      const historyMock = {
        push: jest.fn(() => {
          locationMock.pathname = "/new";
        })
      };
      const wrapper = shallow(<Login history={historyMock} />);
      const createButton = wrapper.find("[name='create-button']").first();
      createButton.simulate("click");

      expect(locationMock.pathname).toEqual("/new");
      expect(historyMock.push.mock.calls.length).toEqual(1);
    });

    test("Correct login navigates to <Settings />", () => {
      const locationMock = { pathname: location.pathname };

      const historyMock = {
        push: jest.fn(payload => {
          locationMock.pathname = payload.pathname;
          locationMock.state = payload.state;
        })
      };
      const wrapper = mount(<Login history={historyMock} />);
      const mockUser = function(id) {
        return {
          settings: {
            language: "Chinese",
            isPrivate: false
          },
          email: "asd",
          _id: id
        };
      };
      jest.spyOn(userApi, "getById").mockImplementation(id => {
        return Promise.resolve(mockUser(id));
      });

      expect(userApi.getById).toBeCalledTimes(0);
      wrapper
        .instance()
        .loadUser("abcdf123")
        .then(() => {
          expect(userApi.getById).toBeCalledTimes(1);
          expect(locationMock.pathname).toEqual("/settings");
          expect(locationMock.state.user).toEqual(mockUser("abcdf123"));
        });
    });
  });

  describe("Login API call result (MOCK)", () => {
    test("Backend returns error and <Login /> displays it properly", () => {
      const wrapper = mount(<Login />);

      jest.spyOn(authApi, "login").mockImplementation(() => {
        return Promise.resolve({ err: "anyerror" });
      });

      wrapper.setState({ username: "test", password: "12345" });
      const loginButton = wrapper.find("[name='login-button']").first();

      return loginButton
        .prop("onClick")()
        .then(() => {
          expect(wrapper.state().error).toEqual("anyerror"); //checking if the state has been updated correctly
          wrapper.update();
          const messageElement = wrapper.find("Message").first(); //checking if the Message component will show the error
          expect(messageElement.prop("text")).toEqual("anyerror");
          expect(messageElement.prop("success")).toBeFalsy();
          jest.clearAllMocks();
        });
    });

    test("Backend returns correct authentication and <Login /> calls loadUser", () => {
      jest.spyOn(authApi, "login").mockImplementation(() => {
        return Promise.resolve({ token: "asd123", userid: 12345 });
      });

      const wrapper = mount(<Login />);
      const spyLoadUser = jest
        .spyOn(wrapper.instance(), "loadUser")
        .mockImplementationOnce(() => {
          /*empty*/
        });

      wrapper.setState({ username: "test", password: "12345" });
      const loginButton = wrapper.find("[name='login-button']").first();

      expect(spyLoadUser).toHaveBeenCalledTimes(0);

      return loginButton
        .prop("onClick")()
        .then(() => {
          expect(spyLoadUser).toHaveBeenCalledTimes(1);
          jest.clearAllMocks();
        });
    });
  });
});

// 1. test loadUser
// 2. test handleChange
// 3. test navigation to
