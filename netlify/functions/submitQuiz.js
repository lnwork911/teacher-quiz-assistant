const submissions = [];

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const { quizId, answers, questions } = JSON.parse(event.body || "{}");
  if (!quizId || !answers || !questions) {
    return { statusCode: 400, body: JSON.stringify({ error: "quizId, answers, and questions are required" }) };
  }

  let correctCount = 0;
  const results = questions.map((q, i) => {
    const isCorrect = answers[i] === q.correct;
    if (isCorrect) correctCount++;
    return {
      question: q.question,
      selected: answers[i],
      correct: q.correct,
      isCorrect,
    };
  });

  const score = Math.round((correctCount / questions.length) * 100);
  const submission = {
    quizId,
    score,
    correctCount,
    totalQuestions: questions.length,
    results,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(submission);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  };
};

exports._submissions = submissions;
