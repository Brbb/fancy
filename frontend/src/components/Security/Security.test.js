import Security from "./Security";
import userApi from "../../services/users/api";

describe("Security component", () => {
  let mockUser = {
    settings: {
      language: "Chinese",
      isPrivate: false
    },
    email: "asd",
    _id: "obj1234"
  };

  describe("Rendering tests", () => {
    test("Security mounts and fields are initialized correctly", () => {
      let wrapper = shallow(<Security.WrappedComponent user={mockUser} />);
      let saveButton = wrapper.find('[name="save-button"]').first();

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().oldPassword).toEqual("");
      expect(wrapper.state().newPassword).toEqual("");
      expect(wrapper.state().repeatNewPassword).toEqual("");
      expect(saveButton.prop("disabled")).toBeTruthy();
    });

    test("Save button gets enabled correctly on field/state changes", () => {
      let wrapper = mount(<Security.WrappedComponent user={mockUser} />);
      wrapper
        .find('[name="oldPasswordField"]')
        .last()
        .simulate("change", { target: { value: "old" } });
      wrapper
        .find('[name="newPasswordField"]')
        .last()
        .simulate("change", { target: { value: "new" } });
      wrapper
        .find('[name="repeatNewPasswordField"]')
        .last()
        .simulate("change", { target: { value: "new" } });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.state().oldPassword).toEqual("old"); 
      expect(wrapper.state().newPassword).toEqual("new");
      expect(wrapper.state().repeatNewPassword).toEqual("new");

      // re-find the button to include re-rendered prop
      let saveButton = wrapper.find('[name="save-button"]').first();
      expect(saveButton.prop("disabled")).toBeFalsy();

      wrapper
        .find('[name="repeatNewPasswordField"]')
        .last()
        .simulate("change", { target: { value: "wrong" } });
      expect(wrapper.state().repeatNewPassword).toEqual("wrong");
      expect(wrapper.state().error).toEqual("Passwords must match");
    });
  });

  describe("Behavioral test", () => {
    test("Save button calls updatePassword and on success logs out", () => {
      let logout = jest.fn();

      let wrapper = shallow(
        <Security.WrappedComponent
          user={mockUser}
          onUserSettingsChange={logout}
        />
      );
      jest.spyOn(userApi, "updatePassword").mockImplementation(() => {
        return Promise.resolve({});
      });

      expect(logout).toBeCalledTimes(0);
      expect(userApi.updatePassword).toBeCalledTimes(0);

      let saveButton = wrapper.find('[name="save-button"]').first();
      return saveButton
        .prop("onClick")()
        .then(() => {
          expect(userApi.updatePassword).toBeCalledTimes(1);
          expect(logout).toBeCalledTimes(1);
          jest.clearAllMocks();
        });
    });

    test("Save button calls updatePassword and on error shows a message", () => {
      let logout = jest.fn();

      let wrapper = shallow(
        <Security.WrappedComponent
          user={mockUser}
          onUserSettingsChange={logout}
        />
      );
      jest.spyOn(userApi, "updatePassword").mockImplementation(() => {
        return Promise.resolve({ err: "any" });
      });

      expect(wrapper.state().error).toBe("");
      expect(logout).toBeCalledTimes(0);
      expect(userApi.updatePassword).toBeCalledTimes(0);

      let saveButton = wrapper.find('[name="save-button"]').first();
      return saveButton
        .prop("onClick")()
        .then(() => {
          expect(userApi.updatePassword).toBeCalledTimes(1);
          expect(logout).toBeCalledTimes(0);
          expect(wrapper.state().error).toBe("any");
          jest.clearAllMocks();
        });
    });

    test("Delete button calls delete and on success logs out", () => {
      let logout = jest.fn();

      let wrapper = shallow(
        <Security.WrappedComponent
          user={mockUser}
          onUserSettingsChange={logout}
        />
      );
      jest.spyOn(userApi, "delete").mockImplementation(() => {
        return Promise.resolve({});
      });
      jest.spyOn(window, "confirm").mockReturnValue(true);

      expect(logout).toBeCalledTimes(0);
      expect(userApi.delete).toBeCalledTimes(0);

      let deleteButton = wrapper.find('[name="delete-button"]').first();
      return deleteButton
        .prop("onClick")()
        .then(() => {
          expect(userApi.delete).toBeCalledTimes(1);
          expect(logout).toBeCalledTimes(1);
          jest.clearAllMocks();
        });
    });

    test("Delete button calls delete and on error shows a message", () => {
      let logout = jest.fn();

      let wrapper = shallow(
        <Security.WrappedComponent
          user={mockUser}
          onUserSettingsChange={logout}
        />
      );

      jest.spyOn(window, "confirm").mockReturnValue(true);
      jest.spyOn(userApi, "delete").mockImplementation(() => {
        return Promise.resolve({ err: "any" });
      });

      expect(wrapper.state().error).toBe("");
      expect(logout).toBeCalledTimes(0);
      expect(userApi.delete).toBeCalledTimes(0);

      let deleteButton = wrapper.find('[name="delete-button"]').first();
      return deleteButton
        .prop("onClick")()
        .then(() => {
          expect(userApi.delete).toBeCalledTimes(1);
          expect(logout).toBeCalledTimes(0);
          expect(wrapper.state().error).toBe("User not deleted!");
          jest.clearAllMocks();
        });
    });
  });
});
