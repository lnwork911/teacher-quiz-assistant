const quizBank = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
    correct: 0,
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correct: 3,
  },
  {
    question: "What does CSS stand for?",
    options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
    correct: 1,
  },
  {
    question: "What does API stand for?",
    options: ["Application Program Interface", "Application Programming Interface", "Allied Programming Interface", "Applied Programming Interface"],
    correct: 1,
  },
  {
    question: "Which HTTP method is used to retrieve data?",
    options: ["POST", "PUT", "GET", "DELETE"],
    correct: 2,
  },
];

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const countParam = event.queryStringParameters?.count;
  const count = Math.min(parseInt(countParam, 10) || 5, quizBank.length);

  const shuffled = [...quizBank].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, count).map((q, i) => ({
    id: i + 1,
    question: q.question,
    options: q.options,
    correct: q.correct,
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quizId: `quiz_${Date.now()}`, questions }),
  };
};
