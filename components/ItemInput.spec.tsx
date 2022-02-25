import * as React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";

import { ItemInput } from "./ItemInput";
import { rest } from "msw";

describe("ItemInput", () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.resetAllMocks();
  });
  afterAll(() => server.close());

  it("allows creating a new item", async () => {
    const createItemSpy = jest.fn();

    const routerMock = {
      asPath: "/",
      replace: jest.fn(),
    };

    jest
      .spyOn(require("next/router"), "useRouter")
      .mockImplementation(() => routerMock);

    const create = rest.post("/api/items", (req, res, ctx) => {
      createItemSpy();
      return res(ctx.json({ name: "cheese" }));
    });
    server.use(create);

    const { getByRole, container, debug, getByDisplayValue } = render(
      <ItemInput />
    );

    expect(
      getByRole("textbox", { name: /add a new item/i })
    ).toBeInTheDocument();

    const input = getByRole("textbox", { name: /add a new item/i });
    fireEvent.change(input, { target: { value: "cheese" } });

    fireEvent.submit(container.querySelector("form")!);

    // assert that we send the item creation request and that it succeeded.
    await waitFor(() => expect(createItemSpy).toHaveBeenCalled());
    expect(routerMock.replace).toHaveBeenCalled();
  });
});
