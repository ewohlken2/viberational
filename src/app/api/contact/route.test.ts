/** @jest-environment node */

import type { NextRequest } from "next/server";
import { POST } from "./route";

function makeContactRequest(body: Record<string, unknown>): NextRequest {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

test("returns HTTP 400 when required fields are missing", async () => {
  const response = await POST(
    makeContactRequest({
      name: "Test User",
      email: "test@example.com",
      subject: "",
      message: "Hello",
    }),
  );

  expect(response.status).toBe(400);
  await expect(response.json()).resolves.toEqual({
    message: "Missing required fields",
  });
});
