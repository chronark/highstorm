import { faker } from "@faker-js/faker"

import { newId } from "@/lib/id"

async function main() {
  const start = Date.now() - 30 * 24 * 60 * 60 * 1000
  const end = Date.now()

  for (let i = 0; i < 10000; i++) {
    console.log(i)
    const amount = faker.finance.amount(5, 100, 2, "$", true)
    await fetch("https://highstorm.vercel.app/api/v1/events/invoices.paid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer api_4Z2czRtEAvKam8iKzfXmVW",
      },
      body: JSON.stringify({
        event: `${faker.name.fullName()} has payed ${amount}`,
        time: Math.random() * (end - start) + start,
        content: `${faker.internet.domainName()}`,
        metadata: { userId: newId("user"), type: faker.finance.transactionType() },
      }),
    })
  }
}

main()
