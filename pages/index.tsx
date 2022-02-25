import { ShoppingItem } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import React from "react";
import { EELogo } from "../components/EELogo";

import { ShoppingList } from "../components/ShoppingList";
import { db } from "../lib/db";

interface ServerProps {
  items: Pick<ShoppingItem, "id" | "name" | "completed">[];
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async () => {
  const items = await db.shoppingItem.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, completed: true },
  });

  return { props: { items } };
};

const Home: NextPage<ServerProps> = ({ items }) => {
  return (
    <div className="container mx-auto py-8 px-6">
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛒</text></svg>"
        />
        <title>Shoppy</title>
      </Head>
      <header className="mb-4 flex justify-between">
        <h1 className="text-3xl font-semibold">Shoppy</h1>
        <EELogo className="fill-blue-500 w-28" />
      </header>
      <main>
        <ShoppingList items={items} />
      </main>
    </div>
  );
};

export default Home;
