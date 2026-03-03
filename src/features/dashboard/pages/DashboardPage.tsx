import "./DashboardPage.css";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <h1>Dashboard do usuário</h1>
        <p>Resumo inicial da sua operação.</p>
      </section>

      <section className="dashboard-grid" aria-label="Resumo">
        <article className="dashboard-card">
          <h2>Pedidos hoje</h2>
          <strong>0</strong>
        </article>
        <article className="dashboard-card">
          <h2>Faturamento</h2>
          <strong>R$ 0,00</strong>
        </article>
        <article className="dashboard-card">
          <h2>Tempo médio</h2>
          <strong>0 min</strong>
        </article>
      </section>
    </main>
  );
}
