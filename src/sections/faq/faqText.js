export function parseFaqText(value) {
  const lines = String(value || "").split(/\r?\n/);
  const items = [];
  let current = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const questionMatch = trimmed.match(/^q\d+\s*:\s*(.+)$/i);
    if (questionMatch) {
      current = { question: questionMatch[1].trim(), answer: "" };
      items.push(current);
      return;
    }

    const answerMatch = trimmed.match(/^r\d+\s*:\s*(.+)$/i);
    if (answerMatch) {
      if (!current) {
        current = { question: "", answer: "" };
        items.push(current);
      }
      current.answer = answerMatch[1].trim();
      return;
    }

    if (current?.answer) {
      current.answer = `${current.answer} ${trimmed}`;
    } else if (current) {
      current.question = `${current.question} ${trimmed}`.trim();
    }
  });

  return items.filter((item) => item.question || item.answer);
}

export function parseChecklistText(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^i\d+\s*:\s*/i, ""))
    .map((line) => {
      const [title, ...descriptionParts] = line.split(/\s+-\s+/);
      return {
        title: title?.trim() || "",
        description: descriptionParts.join(" - ").trim()
      };
    })
    .filter((item) => item.title || item.description);
}
