import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pedeFacilLogo from "../../../assets/pede_facil_logo.png";
import "./LandingPage.css";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    const sectionIds = [
      "inicio",
      "quem-somos",
      "beneficios",
      "como-funciona",
      "resultados",
      "comecar",
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target?.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        threshold: [0.4, 0.6, 0.8],
        rootMargin: "-20% 0px -30% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const getNavClassName = (sectionId: string) =>
    `landing-nav-link${activeSection === sectionId ? " landing-nav-link-active" : ""}`;

  return (
    <main className="landing-page">
      <header className="landing-nav-wrapper">
        <nav className="landing-nav" aria-label="Navegação da página inicial">
          <a
            href="#inicio"
            className={getNavClassName("inicio")}
            aria-current={activeSection === "inicio" ? "page" : undefined}
          >
            Início
          </a>
          <a
            href="#quem-somos"
            className={getNavClassName("quem-somos")}
            aria-current={activeSection === "quem-somos" ? "page" : undefined}
          >
            Quem somos
          </a>
          <a
            href="#beneficios"
            className={getNavClassName("beneficios")}
            aria-current={activeSection === "beneficios" ? "page" : undefined}
          >
            Benefícios
          </a>
          <a
            href="#como-funciona"
            className={getNavClassName("como-funciona")}
            aria-current={
              activeSection === "como-funciona" ? "page" : undefined
            }
          >
            Como funciona
          </a>
          <a
            href="#resultados"
            className={getNavClassName("resultados")}
            aria-current={activeSection === "resultados" ? "page" : undefined}
          >
            Resultados
          </a>
          <a
            href="#comecar"
            className={getNavClassName("comecar")}
            aria-current={activeSection === "comecar" ? "page" : undefined}
          >
            Começar
          </a>
        </nav>
      </header>

      <section id="inicio" className="landing-hero">
        <div className="landing-content">
          <img
            src={pedeFacilLogo}
            alt="Logo Pede Fácil"
            className="landing-logo"
          />
          <span className="landing-eyebrow">Pede Fácil Business</span>
          <h1>
            Organize seus pedidos e aumente a produtividade do seu negócio
          </h1>
          <p>
            Uma plataforma simples para restaurantes e operações de alimentação
            centralizarem pedidos, reduzirem erros e tomarem decisões com base
            em dados.
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
        </div>
      </section>

      <section id="quem-somos" className="landing-section">
        <div className="landing-content">
          <h2>Quem somos</h2>
          <p>
            Somos uma solução focada na rotina real de operações gastronômicas.
            Criamos tecnologia fácil de usar para que equipes atendam melhor,
            trabalhem com mais agilidade e cresçam com consistência.
          </p>
        </div>
      </section>

      <section id="beneficios" className="landing-section">
        <div className="landing-content">
          <h2>Por que escolher o Pede Fácil Business</h2>
          <div className="landing-feature-grid">
            <article className="landing-feature-card">
              <h3>Pedidos centralizados</h3>
              <p>Visualize todos os pedidos em um único fluxo de trabalho.</p>
            </article>
            <article className="landing-feature-card">
              <h3>Mais controle operacional</h3>
              <p>
                Acompanhe status dos pedidos e reduza atrasos no atendimento.
              </p>
            </article>
            <article className="landing-feature-card">
              <h3>Decisões com dados</h3>
              <p>Tenha visão clara da operação para melhorar resultados.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="landing-section">
        <div className="landing-content">
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
        </div>
      </section>

      <section id="resultados" className="landing-section">
        <div className="landing-content">
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
        </div>
      </section>

      <section id="comecar" className="landing-cta">
        <div className="landing-content">
          <h2>Pronto para profissionalizar sua operação?</h2>
          <p>
            Crie sua conta e comece a usar o Pede Fácil Business hoje mesmo.
          </p>
          <Link
            to="/registre-se"
            className="landing-button landing-button-primary"
          >
            Registre-se agora
          </Link>
        </div>
      </section>
    </main>
  );
}
