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

describe("Test setup", () => {
  test("POST users params and resolves correctly", () => {
    jest.spyOn(axios, "post").mockImplementationOnce((url, body) => {
      if (url === "/api/auth/login")
        return Promise.resolve(mockUser(body.email));
    });

    expect(
      axios.post("/api/auth/login", {
        email: "test",
        password: ""
      })
    ).resolves.toEqual(mockUser("test"));
  });

  test("POST rejects correctly", () => {
    jest.spyOn(axios, "post").mockImplementationOnce((url, body) => {
      return Promise.reject({
        response: { data: { err: "Wrong combination" } }
      });
    });

    expect(
      axios.post("/api/auth/login", {
        email: "test",
        password: ""
      })
    ).rejects.toEqual({
      response: { data: { err: "Wrong combination" } }
    });
  });
});
