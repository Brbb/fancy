import Settings from "./Settings";
import General from "../General/General";
import Security from "../Security/Security";
import authApi from "../../services/auth/api";

describe("Serrings component", () => {
  describe("Rendering tests", () => {
    test("Settings shallow-renders correctly", () => {
      const history = { location: { state: { user: "dummy" } } };
      let wrapper = shallow(<Settings history={history} />);
      expect(wrapper).toMatchSnapshot();
    });

    test("Sidebar buttons switch component correctly between <General /> and <Security />", () => {
      const history = { location: { state: { user: "dummy" } } };

      let wrapper = shallow(<Settings history={history} />);
      expect(wrapper.find(General).length).toEqual(1);
      expect(wrapper.find(Security).length).toEqual(0);

      wrapper
        .find('[name="security-button"]')
        .first()
        .simulate("click");

      expect(wrapper.find(General).length).toEqual(0);
      expect(wrapper.find(Security).length).toEqual(1);

      wrapper
        .find('[name="general-button"]')
        .first()
        .simulate("click");

      expect(wrapper.find(General).length).toEqual(1);
      expect(wrapper.find(Security).length).toEqual(0);
    });

    test("Logout button calls logout function and redirects to <Login />", () => {
      let mockLocation = { state: { user: "dummy" }, pathname: "/settings" };

      let historyMock = {
        location: mockLocation,
        push: jest.fn(path => {
          mockLocation.pathname = path;
        })
      };

      let wrapper = shallow(<Settings history={historyMock} />);

      jest.spyOn(authApi, "logout").mockImplementation(() => {
        return Promise.resolve({});
      });

      expect(authApi.logout).toHaveBeenCalledTimes(0);
      expect(historyMock.location.pathname).toEqual("/settings");

      let logoutButton = wrapper.find('[name="logout-button"]').first();

      return logoutButton
        .prop("onClick")()
        .then(() => {
          expect(authApi.logout).toHaveBeenCalledTimes(1);
          expect(mockLocation.pathname).toEqual("/");
          jest.clearAllMocks();
        });
    });
  });
});
