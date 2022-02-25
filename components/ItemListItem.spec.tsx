import * as React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";

import { ItemListItem } from "./ItemListItem";
import { rest } from "msw";

import { setupServer } from "msw/node";

describe("ItemListItem", () => {
  const updateItem = rest.put("/api/items/55", (req, res, ctx) => {
    if (typeof req.body !== "object") {
      throw new Error("Invalid body");
    }
    return res(
      ctx.json({
        id: "55",
        name: req.body?.name,
        completed: req.body?.completed,
      })
    );
  });

  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("allows checking an item", () => {
    server.use(updateItem);
    const item = { id: "55", name: "bread", completed: false };

    const { getByRole, getByDisplayValue } = render(
      <ItemListItem item={item} />
    );

    expect(getByDisplayValue(/bread/i)).not.toBeUndefined();
    const checkbox = getByRole("checkbox", {
      name: /checked/i,
    }) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });

  it("allows updating an item name", () => {
    server.use(updateItem);
    const item = { id: "55", name: "bread", completed: false };

    const { getByRole, getByDisplayValue } = render(
      <ItemListItem item={item} />
    );

    expect(getByDisplayValue(/bread/i)).not.toBeUndefined();
    const nameInput = getByRole("textbox", {
      name: /item name/i,
    }) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "cheese" } });
    fireEvent.blur(nameInput);

    expect(getByDisplayValue(/cheese/i)).not.toBeUndefined();
  });

  it("allows deleting an item", async () => {
    const deleteSpy = jest.fn();
    const deleteItemMutation = rest.delete("/api/items/55", (req, res, ctx) => {
      deleteSpy("55");
      return res(
        ctx.json({
          id: "55",
          name: "deleted item",
          completed: false,
        })
      );
    });

    server.use(deleteItemMutation);
    const item = { id: "55", name: "bread", completed: false };

    jest
      .spyOn(require("next/router"), "useRouter")
      .mockImplementation(() => ({ asPath: "/", replace: jest.fn() }));

    const { getByRole, getByDisplayValue, queryByDisplayValue } = render(
      <ItemListItem item={item} />
    );

    expect(getByDisplayValue(/bread/i)).not.toBeUndefined();

    fireEvent.click(
      getByRole("button", {
        name: /delete item/i,
      })
    );
    await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith(item.id));
  });
});
