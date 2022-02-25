import { db } from "../../../lib/db";
import handler from "./[id]";
import { createMocks } from "../../../testing/httpMocks";

beforeEach(async () => {
  await db.shoppingItem.deleteMany();
});

describe("PUT api/items/:id", () => {
  it("updates an existing item", async () => {
    const item = await db.shoppingItem.create({
      data: { name: "Cheese", completed: false },
    });

    const { req, res } = createMocks({
      method: "PUT",
      path: `/api/items/${item.id}`,
      query: { id: item.id },
      body: {
        completed: true,
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const responseBody = res._getJSONData();
    expect(responseBody.data).toEqual(
      expect.objectContaining({ name: "Cheese", completed: true })
    );

    expect(await db.shoppingItem.findFirst({ where: { id: item.id } })).toEqual(
      expect.objectContaining({ name: "Cheese", completed: true })
    );
  });

  it("responds with an error if the payload is invalid", async () => {
    const item = await db.shoppingItem.create({
      data: { name: "Avocados", completed: false },
    });

    const { req, res } = createMocks({
      method: "PUT",
      path: `/api/items/${item.id}`,
      query: { id: item.id },
      body: {
        completed: "true",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(422);

    const responseBody = res._getJSONData();
    expect(responseBody.errors).toEqual([
      'Expecting boolean at completed but instead got: "true"',
    ]);

    expect(await db.shoppingItem.findFirst({ where: { id: item.id } })).toEqual(
      expect.objectContaining({ name: "Avocados", completed: false })
    );
  });
});

describe("DELETE api/items/:id", () => {
  it("deletes an existing item", async () => {
    const item = await db.shoppingItem.create({
      data: { name: "Wine", completed: false },
    });

    const { req, res } = createMocks({
      method: "DELETE",
      path: `/api/items/${item.id}`,
      query: { id: item.id },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    expect(await db.shoppingItem.count({ where: { id: item.id } })).toBe(0);
  });
});
