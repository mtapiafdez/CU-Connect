const { testAsync } = require("../controllers/admin");

test("probably adds two numbers", async () => {
    const data = await testAsync();
    expect(data).toBe("Miguel");
});
