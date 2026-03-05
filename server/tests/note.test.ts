// tests/note.test.ts
import request from "supertest";
import {createApp} from "../app.js"; // 确保你的 app.ts / app.js 是 export default app
import { Note } from "../model/note.model.js";
const app = createApp()
const registerAndLogin = async (
  agent: ReturnType<typeof request.agent>,
  opts: { email: string }
) => {
  const password = "password123";

  // register
//   await agent.post("/api/auth/register").send({ //agent 的作用：让多次 HTTP 请求共享 cookie / session。
//     name: "test",
//     email: opts.email,
//     password,
//   });
const loginRes = await agent.post("/api/auth/login").send({ email: opts.email, password });
console.log("LOGIN STATUS:", loginRes.status);
console.log("LOGIN SET-COOKIE:", loginRes.headers["set-cookie"]);

  // login (agent 会自动保存 cookie)
  await agent.post("/api/auth/login").send({
    email: opts.email,
    password,
  });
};

describe("Notes API (integration)", () => {
  let userAgent: ReturnType<typeof request.agent>;
    let otherAgent: ReturnType<typeof request.agent>;

  beforeEach(async () => {
    userAgent = request.agent(app);
    otherAgent = request.agent(app);

    await registerAndLogin(userAgent, { email: "u1@test.com" });
    await registerAndLogin(otherAgent, { email: "u2@test.com" });
  });

  describe("POST /api/notes", () => {
    it("401 when not logged in", async () => {
      const res = await request(app).post("/api/notes").send({ title: "t", content: "c" });
      expect(res.status).toBe(401);
    });

    it("201 creates note", async () => {
      const res = await userAgent.post("/api/notes").send({ title: "t1", content: "c1" });
       console.log("STATUS:", res.status);
  console.log("BODY:", JSON.stringify(res.body, null, 2));
  console.log("SET-COOKIE:", res.headers["set-cookie"]);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("t1");
      expect(res.body.data.content).toBe("c1");
    });

    it("400 when title/content missing", async () => {
      const res = await userAgent.post("/api/notes").send({ title: "", content: "" });
      expect(res.status).toBe(400);
    });

    it("409 when duplicate title for same user", async () => {
      await userAgent.post("/api/notes").send({ title: "dup", content: "c1" });
      const res = await userAgent.post("/api/notes").send({ title: "dup", content: "c2" });
      expect(res.status).toBe(409);
    });
  });

//   describe("GET /api/notes", () => {
//     it("200 returns notes with pagination (default limit=3 in your service)", async () => {
//       for (let i = 1; i <= 5; i++) {
//         await userAgent.post("/api/notes").send({ title: `t${i}`, content: `c${i}` });
//       }

//       const res = await userAgent.get("/api/notes");
//       expect(res.status).toBe(200);
//       expect(res.body.success).toBe(true);

//       expect(Array.isArray(res.body.data)).toBe(true);
//       expect(res.body.data.length).toBe(3);

//       expect(res.body.pagination.page).toBe(1);
//       expect(res.body.pagination.total).toBe(5);
//     });

//     it("supports search", async () => {
//       await userAgent.post("/api/notes").send({ title: "apple pie", content: "c" });
//       await userAgent.post("/api/notes").send({ title: "banana", content: "c" });

//       const res = await userAgent.get("/api/notes").query({ search: "apple", limit: 10 });
//       expect(res.status).toBe(200);
//       expect(res.body.data.length).toBe(1);
//       expect(String(res.body.data[0].title).toLowerCase()).toContain("apple");
//     });

//     it("supports sort createdAt asc", async () => {
//       await userAgent.post("/api/notes").send({ title: "a", content: "1" });
//       await userAgent.post("/api/notes").send({ title: "b", content: "2" });

//       const res = await userAgent.get("/api/notes").query({ sort: "createdAt:asc", limit: 10 });
//       expect(res.status).toBe(200);

//       const titles = res.body.data.map((n: any) => n.title);
//       expect(titles[0]).toBe("a");
//       expect(titles[1]).toBe("b");
//     });
//   });

//   describe("GET /api/notes/:id", () => {
//     it("400 invalid id", async () => {
//       const res = await userAgent.get("/api/notes/123");
//       expect(res.status).toBe(400);
//     });

//     it("404 not found (valid ObjectId but not exist)", async () => {
//       const fakeId = "507f1f77bcf86cd799439011";
//       const res = await userAgent.get(`/api/notes/${fakeId}`);
//       expect(res.status).toBe(404);
//     });

//     it("200 owner can read", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await userAgent.get(`/api/notes/${id}`);
//       expect(res.status).toBe(200);
//       expect(res.body.success).toBe(true);
//       expect(res.body.data.note._id).toBe(id);
//     });

//     it("403 other user cannot read", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await otherAgent.get(`/api/notes/${id}`);
//       expect(res.status).toBe(403);
//     });
//   });

//   describe("PATCH /api/notes/:id", () => {
//     it("400 invalid id", async () => {
//       const res = await userAgent.patch("/api/notes/123").send({ title: "x" });
//       expect(res.status).toBe(400);
//     });

//     it("400 nothing to update (title/content both undefined)", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await userAgent.patch(`/api/notes/${id}`).send({});
//       expect(res.status).toBe(400);
//     });

//     it("403 other user cannot update", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await otherAgent.patch(`/api/notes/${id}`).send({ title: "new" });
//       expect(res.status).toBe(403);
//     });

//     it("409 title conflict for same user", async () => {
//       const n1 = await userAgent.post("/api/notes").send({ title: "A", content: "c1" });
//       const n2 = await userAgent.post("/api/notes").send({ title: "B", content: "c2" });

//       const res = await userAgent.patch(`/api/notes/${n2.body.data._id}`).send({ title: "A" });
//       expect(res.status).toBe(409);
//     });

//     it("200 owner updates title", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await userAgent.patch(`/api/notes/${id}`).send({ title: "t2" });
//       expect(res.status).toBe(200);
//       expect(res.body.success).toBe(true);
//       expect(res.body.data.title).toBe("t2");
//     });
//   });

//   describe("DELETE /api/notes/:id", () => {
//     it("400 invalid id", async () => {
//       const res = await userAgent.delete("/api/notes/123");
//       expect(res.status).toBe(400);
//     });

//     it("403 other user cannot delete", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await otherAgent.delete(`/api/notes/${id}`);
//       expect(res.status).toBe(403);
//     });

//     it("204 soft deletes and marks in db", async () => {
//       const created = await userAgent.post("/api/notes").send({ title: "t", content: "c" });
//       const id = created.body.data._id;

//       const res = await userAgent.delete(`/api/notes/${id}`);
//       expect(res.status).toBe(204);

//       const noteInDb = await Note.findById(id);
//       expect(noteInDb).toBeTruthy();
//       expect(noteInDb?.isDeleted).toBe(true);
//       expect(noteInDb?.deletedAt).toBeDefined();
//     });
//   });
});