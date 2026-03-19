import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  clearStoredAuthSession,
  getLoggedBusinessId,
  getLoggedBusinessName,
  isAuthenticatedSession,
} from "../state/authSession";
import "./GlobalNav.css";

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio" },
  { id: "quem-somos", label: "Quem somos" },
  { id: "beneficios", label: "Benefícios" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "resultados", label: "Resultados" },
  { id: "comecar", label: "Começar" },
] as const;

function getSectionTarget(sectionId: string): string {
  return `/#${sectionId}`;
}

function scrollToSection(sectionId: string): void {
  const section = document.getElementById(sectionId);

  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function GlobalNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const loggedBusinessId = getLoggedBusinessId();
  const hasAuthenticatedSession = isAuthenticatedSession();
  const hasLoggedAccount = Boolean(loggedBusinessId || hasAuthenticatedSession);
  const profileImageUrl: string | null = null;
  const businessDisplayName = getLoggedBusinessName() || "Meu negócio";
  const currentActiveSection =
    location.pathname === "/" && location.hash
      ? location.hash.replace("#", "")
      : activeSection;

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");

    // The section may not be mounted yet right after route navigation.
    requestAnimationFrame(() => {
      scrollToSection(sectionId);
    });
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent): void {
      if (!accountMenuRef.current) {
        return;
      }

      if (!accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    if (location.hash) {
      return;
    }

    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

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
  }, [location.hash, location.pathname]);

  function handleSectionNavigation(sectionId: string): void {
    if (location.pathname === "/") {
      window.history.replaceState(null, "", getSectionTarget(sectionId));
      setActiveSection(sectionId);
      scrollToSection(sectionId);
      return;
    }

    navigate(getSectionTarget(sectionId));
  }

  function handleLogout(): void {
    clearStoredAuthSession();
    setIsAccountMenuOpen(false);
    navigate("/login", { replace: true });
  }

  return (
    <header className="global-nav-wrapper">
      <div className="global-nav-shell">
        <nav className="global-nav" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === "/" && currentActiveSection === item.id;

            return (
              <Link
                key={item.id}
                to={getSectionTarget(item.id)}
                onClick={(event) => {
                  event.preventDefault();
                  handleSectionNavigation(item.id);
                }}
                className={`global-nav-link${isActive ? " global-nav-link-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="global-nav-account" ref={accountMenuRef}>
          {hasLoggedAccount ? (
            <>
              <span
                className="global-nav-business-name"
                title={businessDisplayName}
              >
                {businessDisplayName}
              </span>

              <button
                type="button"
                className="global-nav-account-avatar"
                aria-label="Abrir menu da conta"
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              >
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Foto de perfil" />
                ) : (
                  <span
                    className="global-nav-account-avatar-icon"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-4.76 0-8.63 2.79-8.63 6.22 0 .29.23.53.52.53h16.22c.29 0 .52-.24.52-.53 0-3.43-3.87-6.22-8.63-6.22Z" />
                    </svg>
                  </span>
                )}
              </button>

              {isAccountMenuOpen ? (
                <div className="global-nav-account-menu" role="menu">
                  <button
                    type="button"
                    className="global-nav-account-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Ir para dashboard
                  </button>
                  <button
                    type="button"
                    className="global-nav-account-menu-item"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      navigate("/perfil");
                    }}
                  >
                    Meu perfil
                  </button>
                  <button
                    type="button"
                    className="global-nav-account-menu-item global-nav-account-menu-item-danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <Link to="/login" className="global-nav-login-button">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
