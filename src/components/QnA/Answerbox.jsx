function Answerbox({ questionSubmitted, answer, dateAnswered }) {
  const isTemplateEntry =
    String(questionSubmitted ?? '').trim() === '-' &&
    String(answer ?? '').trim() === '-' &&
    String(dateAnswered ?? '').trim() === '-';

  if (isTemplateEntry) return null;

  return (
    <section className="answerbox" aria-label="Answer">
        <h3 className="answerbox-question">{questionSubmitted || '—'}</h3>
      <div className="answerbox-body">
        <p className="answerbox-answer">{answer || '—'}</p>
        <p className="answerbox-date">Answered on {dateAnswered || '—'} </p>
      </div>
    </section>
  );
}

export default Answerbox;
