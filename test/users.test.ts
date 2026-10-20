import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import type { INestApplication } from "@nestjs/common";
import { createApp } from "../src/app";

let app: INestApplication;
let base: string;
before(async () => {
  app = await createApp();
  await app.listen(0, "127.0.0.1");
  base = await app.getUrl();
});
after(async () => {
  await app?.close();
});

test("perfil de retirada mantém endereço null e propaga request ID", async () => {
  const response = await fetch(`${base}/users/customer-pickup`, {
    headers: { "X-Request-ID": "users-test" },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-request-id"), "users-test");
  const user = await response.json();
  assert.equal(user.address, null);
  assert.equal(user.id, "customer-pickup");
  assert.equal("preferences" in user, false);
});
test("cliente inexistente retorna envelope 404", async () => {
  const response = await fetch(`${base}/users/missing`);
  assert.equal(response.status, 404);
  const body = await response.json();
  assert.equal(body.error.code, "USER_NOT_FOUND");
  assert.ok(body.requestId);
});
test("cliente de entrega mantém endereço", async () => {
  const response = await fetch(`${base}/users/customer-delivery`);
  assert.equal((await response.json()).address.postalCode, "00000000");
});
