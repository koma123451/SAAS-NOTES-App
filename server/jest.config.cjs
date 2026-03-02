/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  // 关键：把 TS 源码里的 ".js" import 映射回同路径（让 Jest 去加载 ts）
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};