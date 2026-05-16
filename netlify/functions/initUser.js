const users = new Map();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const { username } = JSON.parse(event.body || "{}");
  if (!username || typeof username !== "string") {
    return { statusCode: 400, body: JSON.stringify({ error: "Username is required" }) };
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const user = { id: userId, username, quizzes: [], createdAt: new Date().toISOString() };
  users.set(userId, user);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, username, message: "User initialized successfully" }),
  };
};
