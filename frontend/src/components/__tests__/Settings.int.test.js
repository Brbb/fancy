import General from "../General/General";
import axios from "axios";
import userApi from "../../services/users/api";
jest.mock("axios");

let mockUser = {
  settings: {
    language: "Chinese",
    isPrivate: false
  },
  email: "asd",
  _id: "obj1234"
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Settings component, integration test", () => {
  describe("Change any settings", () => {
    test("Select privacy updates settings gets 'User not authenticated' error for missing jwt token", () => {
      let wrapper = shallow(<General.WrappedComponent user={mockUser} />);

      let saveButton = wrapper.find("Button");
      jest.spyOn(userApi, "update");
      jest.spyOn(axios, "put");

      return saveButton
        .prop("onClick")()
        .catch(err => {
          expect(userApi.update).toHaveBeenCalledTimes(1);
          //it never gets here due to authentication
          expect(axios.put).toHaveBeenCalledTimes(0);
          expect(err.message).toBe("User not authenticated");
        });
    });

    test("Select privacy updates settings correctly", () => {
      let wrapper = shallow(<General.WrappedComponent user={mockUser} />);

      //Let's change the privacy property
      jest.spyOn(axios, "put").mockImplementationOnce(() => {
        mockUser.settings.isPrivate = true;
        return Promise.resolve({
          data: { ...mockUser }
        });
      });

      jest.spyOn(userApi, "update");
      // We need to set the token otherwise we'll get Unauthorized error
      localStorage.setItem("jwt", "any-valid-token");

      let saveButton = wrapper.find("Button");
      let radioButtonGroup = wrapper.find("RadioButtonGroup");
      expect(radioButtonGroup.prop("checkedValue")).toEqual("public");
      expect(mockUser.settings.isPrivate).toBeFalsy();

      // changing the property
      radioButtonGroup.simulate("change", { target: { value: "private" } }); // calling handlePrivacySettingChange

      expect(mockUser.settings.isPrivate).toBeTruthy();
      expect(userApi.update).toHaveBeenCalledTimes(0);

      // submitting and checking
      return saveButton
        .prop("onClick")()
        .then(() => {
          expect(userApi.update).toHaveBeenCalledTimes(1);
          expect(axios.put).toHaveBeenCalledTimes(1);
          expect(wrapper.state().outcome.success).toBeTruthy();
          expect(mockUser.settings.isPrivate).toBeTruthy();
        });
    });
  });
});
