import { useState } from "react";
import { EditProfileModal } from "../components/EditProfileModal";
import { useAuthenticatedProfile } from "../hooks/useAuthenticatedProfile";
import "./HomePage.css";

function formatProfileDate(value: { isoString: string | null }): string {
  if (!value.isoString) {
    return "Não informado";
  }

  const parsedDate = new Date(value.isoString);

  if (Number.isNaN(parsedDate.getTime())) {
    return value.isoString;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function formatAddressLine(values: Array<string | null>): string {
  const parts = values.filter((value): value is string =>
    Boolean(value && value.trim()),
  );

  return parts.length ? parts.join(", ") : "Não informado";
}

function renderValue(value: string | null): string {
  return value?.trim() || "Não informado";
}

function formatCnpj(value: string | null): string {
  const normalizedValue = renderValue(value);

  if (normalizedValue === "Não informado") {
    return normalizedValue;
  }

  const digits = normalizedValue.replace(/\D/g, "");

  if (digits.length !== 14) {
    return normalizedValue;
  }

  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}

function formatContact(value: string | null): string {
  const normalizedValue = renderValue(value);

  if (normalizedValue === "Não informado") {
    return normalizedValue;
  }

  const digits = normalizedValue.replace(/\D/g, "");

  if (digits.length === 13 && digits.startsWith("55")) {
    return digits.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "+$1 ($2) $3-$4");
  }

  if (digits.length === 12 && digits.startsWith("55")) {
    return digits.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, "+$1 ($2) $3-$4");
  }

  if (digits.length === 11) {
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return normalizedValue;
}

function renderStatusLabel(
  value: boolean | null,
  labels: [string, string],
): string {
  if (value === null) {
    return "Não informado";
  }

  return value ? labels[0] : labels[1];
}

function getStatusClassName(value: boolean | null): string {
  if (value === null) {
    return "home-page-status-badge home-page-status-badge-neutral";
  }

  return value
    ? "home-page-status-badge home-page-status-badge-positive"
    : "home-page-status-badge home-page-status-badge-negative";
}

export default function HomePage() {
  const { profile, isLoading, errorMessage, reloadProfile } =
    useAuthenticatedProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <main className="home-page page-container">
      <header className="page-header home-page-header">
        <div>
          <h1>Meu perfil</h1>
        </div>

        <div className="home-page-header-actions">
          {profile ? (
            <button
              type="button"
              className="home-page-edit-button"
              onClick={() => setIsEditOpen(true)}
              disabled={isLoading}
            >
              Editar dados
            </button>
          ) : null}
          <button
            type="button"
            className="home-page-refresh-button"
            onClick={() => {
              void reloadProfile();
            }}
            disabled={isLoading}
          >
            {isLoading ? "Atualizando..." : "Atualizar dados"}
          </button>
        </div>
      </header>

      {errorMessage && !profile ? (
        <section
          className="section-card home-page-feedback-card"
          aria-live="polite"
        >
          <h2>Não foi possível carregar o perfil</h2>
          <p>{errorMessage}</p>
        </section>
      ) : null}

      {profile ? (
        <>
          <section className="section-card home-page-hero-card">
            <div className="home-page-hero-content">
              <div>
                <p className="home-page-eyebrow">Conta autenticada</p>
                <h2>{renderValue(profile.name)}</h2>
                <p className="home-page-subtitle">{renderValue(profile.id)}</p>
              </div>

              <div className="summary-grid home-page-summary-grid">
                <article className="summary-card home-page-summary-card">
                  <p>Email</p>
                  <strong>{renderValue(profile.email)}</strong>
                </article>
                <article className="summary-card home-page-summary-card">
                  <p>Contato</p>
                  <strong>{formatContact(profile.contact)}</strong>
                </article>
                <article className="summary-card home-page-summary-card">
                  <p>CNPJ</p>
                  <strong>{formatCnpj(profile.cnpj)}</strong>
                </article>
                <article className="summary-card home-page-summary-card">
                  <p>Verificação</p>
                  <strong>
                    <span className={getStatusClassName(profile.verified)}>
                      {renderStatusLabel(profile.verified, [
                        "Verificado",
                        "Pendente",
                      ])}
                    </span>
                  </strong>
                </article>
                <article className="summary-card home-page-summary-card">
                  <p>Status da conta</p>
                  <strong>
                    <span className={getStatusClassName(profile.active)}>
                      {renderStatusLabel(profile.active, ["Ativa", "Inativa"])}
                    </span>
                  </strong>
                </article>
              </div>
            </div>
          </section>

          {errorMessage ? (
            <section
              className="section-card home-page-feedback-card"
              aria-live="polite"
            >
              <h2>Última atualização com aviso</h2>
              <p>{errorMessage}</p>
            </section>
          ) : null}

          <section className="home-page-grid">
            <article className="section-card home-page-detail-card">
              <h2>Dados da empresa</h2>
              <dl className="home-page-detail-list">
                <div>
                  <dt>Nome fantasia</dt>
                  <dd>{renderValue(profile.name)}</dd>
                </div>
                <div>
                  <dt>Razão social</dt>
                  <dd>{renderValue(profile.legalName)}</dd>
                </div>
                <div>
                  <dt>Contato</dt>
                  <dd>{formatContact(profile.contact)}</dd>
                </div>
                <div>
                  <dt>CNPJ</dt>
                  <dd>{formatCnpj(profile.cnpj)}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{renderValue(profile.email)}</dd>
                </div>
                <div>
                  <dt>Website</dt>
                  <dd>{renderValue(profile.website)}</dd>
                </div>
                <div>
                  <dt>Verificação</dt>
                  <dd>
                    {renderStatusLabel(profile.verified, [
                      "Verificado",
                      "Pendente",
                    ])}{" "}
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    {renderStatusLabel(profile.active, [
                      "Ativa",
                      "Inativa",
                    ])}{" "}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="section-card home-page-detail-card">
              <h2>Endereço</h2>
              <dl className="home-page-detail-list">
                <div>
                  <dt>Logradouro</dt>
                  <dd>{renderValue(profile.address.address)}</dd>
                </div>
                <div>
                  <dt>Número e complemento</dt>
                  <dd>
                    {formatAddressLine([
                      profile.address.number,
                      profile.address.complement,
                    ])}
                  </dd>
                </div>
                <div>
                  <dt>Bairro</dt>
                  <dd>{renderValue(profile.address.neighborhood)}</dd>
                </div>
                <div>
                  <dt>Cidade / UF</dt>
                  <dd>
                    {formatAddressLine([
                      profile.address.city,
                      profile.address.state,
                    ])}
                  </dd>
                </div>
                <div>
                  <dt>CEP</dt>
                  <dd>{renderValue(profile.address.zipcode)}</dd>
                </div>
              </dl>
            </article>

            <article className="section-card home-page-detail-card">
              <h2>Metadados</h2>
              <dl className="home-page-detail-list">
                <div>
                  <dt>Criado em</dt>
                  <dd>{formatProfileDate(profile.createdAt)}</dd>
                </div>
                <div>
                  <dt>Atualizado em</dt>
                  <dd>{formatProfileDate(profile.updatedAt)}</dd>
                </div>
                <div>
                  <dt>Logo</dt>
                  <dd>{renderValue(profile.logoUrl)}</dd>
                </div>
              </dl>
            </article>
          </section>
        </>
      ) : isLoading ? (
        <section
          className="section-card home-page-feedback-card"
          aria-live="polite"
        >
          <h2>Carregando perfil</h2>
          <p>Consultando os dados autenticados da empresa.</p>
        </section>
      ) : null}

      {isEditOpen && profile ? (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onSaved={reloadProfile}
        />
      ) : null}
    </main>
  );
}
