import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <span className="landing-eyebrow">Pede Fácil Business</span>
        <h1>Organize seus pedidos e aumente a produtividade do seu negócio</h1>
        <p>
          Uma plataforma simples para restaurantes e operações de alimentação
          centralizarem pedidos, reduzirem erros e tomarem decisões com base em
          dados.
        </p>
        <div className="landing-actions">
          <Link
            to="/registre-se"
            className="landing-button landing-button-primary"
          >
            Começar agora
          </Link>
          <Link to="/login" className="landing-button">
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>Quem somos</h2>
        <p>
          Somos uma solução focada na rotina real de operações gastronômicas.
          Criamos tecnologia fácil de usar para que equipes atendam melhor,
          trabalhem com mais agilidade e cresçam com consistência.
        </p>
      </section>

      <section className="landing-section">
        <h2>Por que escolher o Pede Fácil Business</h2>
        <div className="landing-feature-grid">
          <article className="landing-feature-card">
            <h3>Pedidos centralizados</h3>
            <p>Visualize todos os pedidos em um único fluxo de trabalho.</p>
          </article>
          <article className="landing-feature-card">
            <h3>Mais controle operacional</h3>
            <p>Acompanhe status dos pedidos e reduza atrasos no atendimento.</p>
          </article>
          <article className="landing-feature-card">
            <h3>Decisões com dados</h3>
            <p>Tenha visão clara da operação para melhorar resultados.</p>
          </article>
        </div>
      </section>

      <section className="landing-section">
        <h2>Como funciona</h2>
        <ol className="landing-steps">
          <li>
            <strong>Crie sua conta:</strong> faça seu cadastro em poucos
            minutos.
          </li>
          <li>
            <strong>Configure seu negócio:</strong> organize seu fluxo de
            pedidos e operação.
          </li>
          <li>
            <strong>Acompanhe seu desempenho:</strong> use o dashboard para
            tomar decisões rápidas.
          </li>
        </ol>
      </section>

      <section className="landing-section">
        <h2>Resultados que importam</h2>
        <div className="landing-metrics">
          <article className="landing-metric-card">
            <strong>+ Agilidade</strong>
            <p>Equipe mais rápida no dia a dia.</p>
          </article>
          <article className="landing-metric-card">
            <strong>- Erros</strong>
            <p>Processo mais claro do pedido ao preparo.</p>
          </article>
          <article className="landing-metric-card">
            <strong>+ Controle</strong>
            <p>Visão consolidada para gestão da operação.</p>
          </article>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Pronto para profissionalizar sua operação?</h2>
        <p>Crie sua conta e comece a usar o Pede Fácil Business hoje mesmo.</p>
        <Link
          to="/registre-se"
          className="landing-button landing-button-primary"
        >
          Registre-se agora
        </Link>
      </section>
    </main>
  );
}
