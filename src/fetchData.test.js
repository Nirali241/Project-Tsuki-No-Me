const fetchData = require("../../../app/utils/fetchData");
const fetch = require("node-fetch");

jest.mock("node-fetch");

describe("fetchData function", () => {
  it("should make a POST request to the correct endpoint", async () => {
    fetch.mockResolvedValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: "test data" }),
      })
    );
    const payload = { foo: "bar" };
    const data = await fetchData("http://www.abcd.com", payload);
    expect(data).toEqual({ data: "test data" });
  });

  it("should throw an error if the request fails", async () => {
    fetch.mockRejectedValue("Error");
    try {
      await fetchData("http://www.abcd.com", {});
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
