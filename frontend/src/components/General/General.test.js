import General from "./General";
import userApi from "../../services/users/api";

describe("General component", () => {
  let mockUser = {
    settings: {
      language: "Chinese",
      isPrivate: false
    },
    email: "asd",
    _id: "obj1234"
  };

  describe("Rendering tests", () => {
    test("General renders and assigns user settings correctly", () => {
      let wrapper = shallow(<General.WrappedComponent user={mockUser} />);
      expect(wrapper).toMatchSnapshot();

      let dropdown = wrapper.find("Dropdown");
      expect(dropdown.prop("selected")).toEqual(mockUser.settings.language);
      let radioButtonGroup = wrapper.find("RadioButtonGroup");
      expect(radioButtonGroup.prop("checkedValue")).toEqual(
        mockUser.settings.isPrivate ? "private" : "public"
      );
    });

    test("Select language updates settings correctly", () => {
      let wrapper = shallow(<General.WrappedComponent user={mockUser} />);
      expect(wrapper).toMatchSnapshot();

      jest.spyOn(userApi, "update").mockImplementation(() => {
        return Promise.resolve({});
      });

      let saveButton = wrapper.find("Button");
      let dropdown = wrapper.find("Dropdown");
      expect(dropdown.prop("selected")).toEqual(mockUser.settings.language);
      
      dropdown.simulate("change", { target: { value: "Thai" } }); // calling handleLanguageSettingChange
      
      expect(dropdown.prop("selected")).not.toEqual(mockUser.settings.language); // expecting 'Thai' for the user
      expect(userApi.update).toHaveBeenCalledTimes(0);

      return saveButton
        .prop("onClick")()
        .then(() => {
          expect(userApi.update).toHaveBeenCalledTimes(1);
          expect(wrapper.state().outcome.success).toBeTruthy();
          jest.clearAllMocks();
        });
    });

    test("Select privacy updates settings correctly", () => {
        let wrapper = shallow(<General.WrappedComponent user={mockUser} />);
        expect(wrapper).toMatchSnapshot();
  
        jest.spyOn(userApi, "update").mockImplementation(() => {
          return Promise.resolve({});
        });
  
        let saveButton = wrapper.find("Button");
        let radioButtonGroup = wrapper.find("RadioButtonGroup");
        expect(radioButtonGroup.prop("checkedValue")).toEqual('public');
        expect(mockUser.settings.isPrivate).toBeFalsy();
        
        radioButtonGroup.simulate("change", { target: { value: "private" } }); // calling handlePrivacySettingChange
        
        expect(mockUser.settings.isPrivate).toBeTruthy();
        expect(userApi.update).toHaveBeenCalledTimes(0);
  
        return saveButton
          .prop("onClick")()
          .then(() => {
            expect(userApi.update).toHaveBeenCalledTimes(1);
            expect(wrapper.state().outcome.success).toBeTruthy();
            jest.clearAllMocks();
          });
      });
  });
});
