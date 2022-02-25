import * as React from "react";
import { render } from "@testing-library/react";
import { ShoppingList } from "./ShoppingList";

describe("ShoppingList", () => {
  it("renders a list of items", () => {
    const items = [
      { id: "1", name: "Bread", completed: false },
      { id: "2", name: "Cheese", completed: true },
      { id: "3", name: "Wine", completed: false },
    ];

    const { getByDisplayValue } = render(<ShoppingList items={items} />);
    expect(getByDisplayValue("Cheese")).toBeInTheDocument();
  });
});
