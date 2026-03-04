import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";
import "./ForgotPasswordPage.css";

export default function ForgotPasswordPage() {
  const { isLoading, serverError, submitForgotPassword } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const emailError =
    touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Informe um e-mail válido."
      : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);

    if (emailError || !email.trim() || isLoading) {
      return;
    }

    const result = await submitForgotPassword({ email: email.trim() });

    if (result.ok) {
      setSuccessMessage(
        "Se o e-mail existir na plataforma, você receberá as instruções de redefinição.",
      );
    }
  }

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-section">
        <h1>Esqueci minha senha</h1>
        <p>Informe o e-mail da sua conta para receber o link de redefinição.</p>

        <form
          className="forgot-password-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="field">
            <label htmlFor="forgot-email">E-mail</label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "forgot-email-error" : undefined}
              required
            />
            {emailError && <small id="forgot-email-error">{emailError}</small>}
          </div>

          {serverError && (
            <p role="alert" className="form-error">
              {serverError}
            </p>
          )}

          {successMessage && <p className="form-success">{successMessage}</p>}

          <button type="submit" disabled={isLoading || Boolean(emailError)}>
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </button>

          <footer className="forgot-password-footer">
            <Link to="/login">Voltar para o login</Link>
            <Link to="/">Página inicial</Link>
          </footer>
        </form>
      </section>
    </main>
  );
}
