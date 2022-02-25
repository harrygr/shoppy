import { db } from "../../lib/db";
import handler from "./items";
import { createMocks } from "../../testing/httpMocks";

describe("api/items", () => {
  beforeEach(async () => {
    await db.shoppingItem.deleteMany();
  });

  it("creates a new item", async () => {
    const { req, res } = createMocks({
      method: "POST",
      path: "api/items",
      body: {
        name: "Bread",
        completed: false,
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    const resposeBody = res._getJSONData();
    expect(resposeBody.data).toEqual(
      expect.objectContaining({ name: "Bread", completed: false })
    );

    expect(
      await db.shoppingItem.findFirst({ where: { id: resposeBody.data.id } })
    ).toEqual(expect.objectContaining({ name: "Bread" }));
  });

  it("returns errors if the body is invalid", async () => {
    const { req, res } = createMocks({
      method: "POST",
      path: "api/items",
      body: {
        notAField: "Boo",

        completed: false,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(422);

    const { errors } = res._getJSONData();
    expect(errors).toEqual([
      "Expecting string at name but instead got: undefined",
    ]);
  });

  it("responds with an error if the request method is not POST", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
