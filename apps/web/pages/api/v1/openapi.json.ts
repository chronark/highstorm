import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { OpenAPIRegistry, OpenAPIGenerator } from "@asteasolutions/zod-to-openapi";
import { NextApiRequest, NextApiResponse } from "next";

// export const config = {
//   runtime: "edge",
// };

export default function (_req: NextApiRequest, res: NextApiResponse) {
  extendZodWithOpenApi(z);
  // Register definitions here
  const registry = new OpenAPIRegistry();

  // const auth = registry.registerComponent("securitySchemes", "bearerAuth", {
  //   type: "apiKey",
  //   scheme: "bearer",
  //   bearerFormat: "opaque",
  // });

  // const UserIdSchema = registry.registerParameter(
  //   "UserId",
  //   z.string().openapi({
  //     param: {
  //       name: "id",
  //       in: "path",
  //     },
  //     example: "1212121",
  //   }),
  // );
  const UserSchema = registry.register(
    "User",
    z.object({
      id: z.string().openapi({
        example: "1212121",
      }),
      name: z.string().openapi({
        example: "John Doe",
      }),
      age: z.number().openapi({
        example: 42,
      }),
    }),
  );

  registry.registerPath({
    method: "get",
    path: "/users",
    description: "Get user data by its id",
    summary: "Get a single user",
    // security: [{ [auth.name]: [] }],

    responses: {
      200: {
        description: "Object with user data.",
        content: {
          "application/json": {
            schema: UserSchema,
          },
        },
      },
      204: {
        description: "No content - successful operation",
      },
    },
  });

  // registry.registerPath({
  //   method: "post",
  //   path: "/v1/events/{channel}",
  //   description: "Ingest new events",
  //   summary: "Ingest new events",
  //   request: {
  //     params: z.object({
  //       channel: z
  //         .string()
  //         .openapi({
  //           type: "string",
  //           param: {
  //             name: "channel",
  //             in: "path",
  //           },
  //           example: "users.signup",
  //         })
  //         .regex(/^[a-zA-Z0-9._-]{3,}$/),
  //     }),
  //   },
  //   responses: {
  //     200: {
  //       description: "event id",
  //       content: {
  //         "aplication/json": {
  //           schema: registry.register(
  //             "EventResponse",
  //             z.object({
  //               id: z.string().openapi({ example: "evt_Sohd6nSWqhzpMuDj6yI24Q", type: "string" }),
  //             }),
  //           ),
  //         },
  //       },
  //     },
  //   },
  // });

  const generator = new OpenAPIGenerator(registry.definitions, "3.1.0");

  res.json(
    generator.generateDocument({
      info: {
        version: "1.0.0",
        title: "Highstorm API",
        description: "Highstorm API",
      },
      servers: [{ url: "v1" }],
    }),
  );
  return res.end();
}
