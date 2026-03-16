interface FormFeedbackProps {
  serverError?: string;
  successMessage?: string;
}

export default function FormFeedback({
  serverError = "",
  successMessage = "",
}: FormFeedbackProps) {
  return (
    <>
      {serverError ? (
        <p role="alert" className="form-error">
          {serverError}
        </p>
      ) : null}
      {successMessage ? <p className="form-success">{successMessage}</p> : null}
    </>
  );
}
