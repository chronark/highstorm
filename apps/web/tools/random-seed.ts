import { faker } from "@faker-js/faker";

import { newId } from "@/lib/id";

async function main() {
  const start = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const end = Date.now();

  for (let i = 0; i < 1000; i++) {
    console.log(i);

    await Promise.all(
      new Array(100).fill(0).map(async () => {
        const amount = faker.finance.amount(5, 100, 2, "$", true);
        const res = await fetch("http://localhost:3000/api/v1/events/invoices.paid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer api_VvdMTFMjTuZ9VuntUYkJGA",
          },
          body: JSON.stringify({
            event: `${faker.name.fullName()} has payed ${amount}`,
            time: Math.floor(Math.random() * (end - start) + start),
            content: `${faker.internet.domainName()}`,
            metadata: {
              userId: newId("user"),
              type: faker.finance.transactionType(),
            },
          }),
        });
        if (!res.ok) {
          console.error(await res.text());
        }
      }),
    );
  }
}

main();
