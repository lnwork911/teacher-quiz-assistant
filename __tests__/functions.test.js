const generate = require("../netlify/functions/generate");
const submitQuiz = require("../netlify/functions/submitQuiz");
const getDashboardData = require("../netlify/functions/getDashboardData");
const initUser = require("../netlify/functions/initUser");

describe("generate function", () => {
  it("returns quiz questions", async () => {
    const event = { httpMethod: "GET", queryStringParameters: { count: "3" } };
    const result = await generate.handler(event);
    const body = JSON.parse(result.body);
    expect(result.statusCode).toBe(200);
    expect(body.questions).toHaveLength(3);
    expect(body.quizId).toMatch(/^quiz_/);
  });

  it("rejects non-GET requests", async () => {
    const event = { httpMethod: "POST" };
    const result = await generate.handler(event);
    expect(result.statusCode).toBe(405);
  });

  it("defaults to 5 questions when no count given", async () => {
    const event = { httpMethod: "GET", queryStringParameters: {} };
    const result = await generate.handler(event);
    const body = JSON.parse(result.body);
    expect(body.questions).toHaveLength(5);
  });
});

describe("initUser function", () => {
  it("creates a user with a valid username", async () => {
    const event = { httpMethod: "POST", body: JSON.stringify({ username: "testuser" }) };
    const result = await initUser.handler(event);
    const body = JSON.parse(result.body);
    expect(result.statusCode).toBe(200);
    expect(body.username).toBe("testuser");
    expect(body.userId).toMatch(/^user_/);
  });

  it("rejects missing username", async () => {
    const event = { httpMethod: "POST", body: JSON.stringify({}) };
    const result = await initUser.handler(event);
    expect(result.statusCode).toBe(400);
  });

  it("rejects non-POST requests", async () => {
    const event = { httpMethod: "GET" };
    const result = await initUser.handler(event);
    expect(result.statusCode).toBe(405);
  });
});

describe("submitQuiz function", () => {
  it("scores a quiz submission", async () => {
    const questions = [
      { question: "Q1", options: ["A", "B"], correct: 0 },
      { question: "Q2", options: ["A", "B"], correct: 1 },
    ];
    const event = {
      httpMethod: "POST",
      body: JSON.stringify({ quizId: "quiz_test", answers: [0, 1], questions }),
    };
    const result = await submitQuiz.handler(event);
    const body = JSON.parse(result.body);
    expect(result.statusCode).toBe(200);
    expect(body.score).toBe(100);
    expect(body.correctCount).toBe(2);
  });

  it("handles wrong answers", async () => {
    const questions = [
      { question: "Q1", options: ["A", "B"], correct: 0 },
      { question: "Q2", options: ["A", "B"], correct: 1 },
    ];
    const event = {
      httpMethod: "POST",
      body: JSON.stringify({ quizId: "quiz_test2", answers: [1, 0], questions }),
    };
    const result = await submitQuiz.handler(event);
    const body = JSON.parse(result.body);
    expect(body.score).toBe(0);
    expect(body.correctCount).toBe(0);
  });

  it("rejects missing fields", async () => {
    const event = { httpMethod: "POST", body: JSON.stringify({}) };
    const result = await submitQuiz.handler(event);
    expect(result.statusCode).toBe(400);
  });
});

describe("getDashboardData function", () => {
  it("returns dashboard data", async () => {
    const event = { httpMethod: "GET" };
    const result = await getDashboardData.handler(event);
    const body = JSON.parse(result.body);
    expect(result.statusCode).toBe(200);
    expect(body.totalQuizzesTaken).toBeDefined();
    expect(body.averageScore).toBeDefined();
    expect(body.recentScores).toBeInstanceOf(Array);
    expect(body.topCategories).toBeInstanceOf(Array);
  });

  it("rejects non-GET requests", async () => {
    const event = { httpMethod: "POST" };
    const result = await getDashboardData.handler(event);
    expect(result.statusCode).toBe(405);
  });
});
