exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const dashboardData = {
    totalQuizzesTaken: 12,
    averageScore: 78,
    recentScores: [85, 70, 90, 65, 80],
    topCategories: [
      { name: "Web Basics", score: 85 },
      { name: "APIs", score: 72 },
      { name: "JavaScript", score: 90 },
    ],
    generatedAt: new Date().toISOString(),
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dashboardData),
  };
};
