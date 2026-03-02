import request from "supertest";
import { createApp } from "../app.js";
const app = createApp();
const testUser = {
  username: "bowen",
  email: "test@example.com",
  password: "123456",
};
describe("POST /api/auth/register", () => {
  it("201 + returns user + sets token cookie", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username:testUser.username, 
        email: testUser.email, 
        password: testUser.password })
      expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const user = res.body?.data?.user;
    expect(user).toBeDefined();  //expect(value !== undefined).toBe(true);
    expect(user.email).toBe(testUser.email);
    expect(user.password).toBeUndefined();

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();

    if (Array.isArray(setCookie)) {
      expect(setCookie.join(";")).toContain("token=");
    } else {
      // 有些环境/类型定义会把它当成 string
      expect(setCookie).toContain("token=");
    }
  });
});

describe("POST /api/auth/login",()=>{
  //register first
  it("201 + returns user + sets token cookie", async()=>{
    await request(app)
    .post("/api/auth/register")
    .send(
      {username:testUser.username,
        email:testUser.email,
        password:testUser.password
      }).expect(201)
      const res= await request(app)
    .post("/api/auth/login")
    .send({email:testUser.email,
      password:testUser.password
    })
    console.log("body",res.body)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true);
  })
})


describe("POST /api/auth/logout", () => {
  it("200 + clears token cookie + returns success/message", async () => {
    // 先注册 + 登录拿到 cookie（更真实）

    await request(app)
      .post("/api/auth/register")
      .send({ username: testUser.username, email:testUser.email, password:testUser.password })
      .expect(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email:testUser.email, password:testUser.password })
      .expect(200);

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Logged out");

    // 验证确实有清 cookie 的 Set-Cookie（clearCookie 会设置过期）
    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();

    const cookieStr = Array.isArray(setCookie) ? setCookie.join(";") : setCookie;
    expect(cookieStr).toContain("token=");
  });
});

describe("GET /api/auth/me", () => {
  it("200 + returns current user when authenticated", async () => {


    // 1) register
    await request(app)
      .post("/api/auth/register")
      .send({ username: testUser.username, email:testUser.email, password:testUser.password})
      .expect(201);

    // 2) login -> get cookie
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email:testUser.email, password:testUser.password })
      .expect(200);

    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // 3) call /me with cookie
    const res = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies)
      .expect(200);

    expect(res.body.success).toBe(true);

    // 你的 getMe 返回的是 data: user
    expect(res.body.data).toBeDefined();
    expect(res.body.data.email).toBe(testUser.email);

    // 取决于你 getCurrentUser 返回的结构：有的返回 {user:{...}} 有的直接 user
    // 如果你的 data 不是直接 user，把这一行按实际改一下。
  });

  it("401 when no token (not authenticated)", async () => {
    // 没带 cookie，protect 应该拦截
    await request(app)
      .get("/api/auth/me")
      .expect(401);
  });
});