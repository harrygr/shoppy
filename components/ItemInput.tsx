import { useRouter } from "next/router";
import * as React from "react";
import { PlusIcon } from "./PlusIcon";

export const ItemInput: React.FC = () => {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const itemInput = React.useRef<null | HTMLInputElement>(null);

  const submitCreateItem: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (itemInput.current?.value) {
      const response = await fetch("/api/items", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: itemInput.current.value }),
      });

      if (response.ok) {
        refreshData();
        itemInput.current.value = "";
      }
      return;
    }
  };

  return (
    <form onSubmit={submitCreateItem} className="flex items-center">
      <PlusIcon className="w-4 h-4 inline-block mr-2" />
      <label htmlFor="new-item" className="sr-only">
        Add a new item
      </label>
      <input
        id="new-item"
        placeholder="Add a new item"
        type="text"
        name="name"
        ref={itemInput}
        className="flex-grow"
      />
    </form>
  );
};
