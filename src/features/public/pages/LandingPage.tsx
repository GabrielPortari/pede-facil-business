import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <h1>Pede Fácil Business</h1>
        <p>
          Somos uma plataforma para ajudar restaurantes e negócios de
          alimentação a organizarem pedidos, ganharem produtividade e atenderem
          melhor os clientes.
        </p>
        <div className="landing-actions">
          <Link to="/login" className="landing-button landing-button-primary">
            Entrar
          </Link>
          <Link to="/registre-se" className="landing-button">
            Criar conta
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>Quem somos</h2>
        <p>
          Desenvolvemos soluções simples para gestão de pedidos, focando em
          usabilidade, velocidade e confiabilidade para o dia a dia do seu
          negócio.
        </p>
      </section>

      <section className="landing-section">
        <h2>Sobre a plataforma</h2>
        <ul>
          <li>Centralização dos pedidos em um único lugar</li>
          <li>Acompanhamento de desempenho operacional</li>
          <li>Experiência otimizada para equipes e gestores</li>
        </ul>
      </section>
    </main>
  );
}
