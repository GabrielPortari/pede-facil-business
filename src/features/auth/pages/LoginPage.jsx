function LoginPage() {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <header className="login-header">
          <h1>Pede Fácil</h1>
          <p>Acesse sua conta para continuar</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="voce@empresa.com"
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
