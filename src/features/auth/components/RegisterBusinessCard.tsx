import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import type {
  BusinessAddressPayload,
  SignupBusinessPayload,
} from "../types/auth.type";
import "./RegisterBusinessCard.css";

interface RegisterBusinessCardProps {
  onSubmit: (payload: SignupBusinessPayload) => void | Promise<void>;
  isLoading?: boolean;
  serverError?: string;
  successMessage?: string;
}

interface RegisterTouchedState {
  name: boolean;
  legalName: boolean;
  cnpj: boolean;
  website: boolean;
  contact: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  address: boolean;
  number: boolean;
  neighborhood: boolean;
  city: boolean;
  state: boolean;
  zipcode: boolean;
}

function formatCnpjInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 14);

  const part1 = digits.slice(0, 2);
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5, 8);
  const part4 = digits.slice(8, 12);
  const part5 = digits.slice(12, 14);

  let formatted = part1;
  if (part2) formatted += `.${part2}`;
  if (part3) formatted += `.${part3}`;
  if (part4) formatted += `/${part4}`;
  if (part5) formatted += `-${part5}`;

  return formatted;
}

function formatPhoneInput(rawValue: string): string {
  let digits = rawValue.replace(/\D/g, "");

  // If the user pastes +55, keep only local BR number for input mask.
  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, 11);

  const ddd = digits.slice(0, 2);
  const prefix = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const suffix = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  if (!ddd) {
    return "";
  }

  let formatted = `(${ddd}`;
  if (ddd.length === 2) {
    formatted += ")";
  }
  if (prefix) {
    formatted += ` ${prefix}`;
  }
  if (suffix) {
    formatted += `-${suffix}`;
  }

  return formatted;
}

function formatZipcodeInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 8);

  const part1 = digits.slice(0, 5);
  const part2 = digits.slice(5, 8);

  if (!part2) {
    return part1;
  }

  return `${part1}-${part2}`;
}

function formatStateInput(rawValue: string): string {
  return rawValue
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase();
}

export function RegisterBusinessCard({
  onSubmit,
  isLoading = false,
  serverError = "",
  successMessage = "",
}: RegisterBusinessCardProps) {
  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");

  const [touched, setTouched] = useState<RegisterTouchedState>({
    name: false,
    legalName: false,
    cnpj: false,
    website: false,
    contact: false,
    email: false,
    password: false,
    confirmPassword: false,
    address: false,
    number: false,
    neighborhood: false,
    city: false,
    state: false,
    zipcode: false,
  });

  const cnpjDigits = cnpj.replace(/\D/g, "");
  const contactDigits = contact.replace(/\D/g, "");
  const isNameInvalid = !name.trim();
  const isLegalNameInvalid = !legalName.trim();
  const isCnpjInvalid = cnpjDigits.length !== 14;

  const isWebsiteInvalid =
    Boolean(website.trim()) && !/^https?:\/\/.+/.test(website.trim());

  const isContactInvalid =
    contactDigits.length < 10 || contactDigits.length > 11;
  const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordInvalid = password.length < 6;
  const isConfirmPasswordInvalid =
    !confirmPassword || confirmPassword !== password;

  const isAddressInvalid = !address.trim();
  const isNumberInvalid = !number.trim();
  const isNeighborhoodInvalid = !neighborhood.trim();
  const isCityInvalid = !city.trim();
  const isStateInvalid = !/^[A-Za-z]{2}$/.test(state.trim());
  const isZipcodeInvalid = !/^\d{5}-?\d{3}$/.test(zipcode.trim());

  const nameError =
    touched.name && isNameInvalid ? "Informe o nome fantasia." : "";

  const legalNameError =
    touched.legalName && isLegalNameInvalid ? "Informe a razão social." : "";

  const cnpjError =
    touched.cnpj && isCnpjInvalid ? "Informe um CNPJ válido (14 dígitos)." : "";

  const websiteError =
    touched.website && isWebsiteInvalid
      ? "Informe uma URL válida começando com http:// ou https://."
      : "";

  const contactError =
    touched.contact && isContactInvalid
      ? "Informe um telefone com DDD (10 ou 11 dígitos)."
      : "";

  const emailError =
    touched.email && isEmailInvalid ? "Informe um e-mail válido." : "";

  const passwordError =
    touched.password && isPasswordInvalid
      ? "A senha deve ter pelo menos 6 caracteres."
      : "";

  const confirmPasswordError =
    touched.confirmPassword && isConfirmPasswordInvalid
      ? "As senhas não coincidem."
      : "";

  const addressError =
    touched.address && isAddressInvalid ? "Informe a rua." : "";

  const numberError =
    touched.number && isNumberInvalid ? "Informe o número." : "";

  const neighborhoodError =
    touched.neighborhood && isNeighborhoodInvalid ? "Informe o bairro." : "";

  const cityError = touched.city && isCityInvalid ? "Informe a cidade." : "";

  const stateError =
    touched.state && isStateInvalid ? "Use a UF com 2 letras (ex: SP)." : "";

  const zipcodeError =
    touched.zipcode && isZipcodeInvalid ? "Informe um CEP válido." : "";

  const hasErrors = Boolean(
    nameError ||
    legalNameError ||
    cnpjError ||
    websiteError ||
    contactError ||
    emailError ||
    passwordError ||
    confirmPasswordError ||
    addressError ||
    numberError ||
    neighborhoodError ||
    cityError ||
    stateError ||
    zipcodeError,
  );

  function buildAddressPayload(): BusinessAddressPayload {
    return {
      address: address.trim(),
      number: number.trim(),
      complement: complement.trim() || undefined,
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      zipcode: zipcode.replace(/\D/g, ""),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTouched({
      name: true,
      legalName: true,
      cnpj: true,
      website: true,
      contact: true,
      email: true,
      password: true,
      confirmPassword: true,
      address: true,
      number: true,
      neighborhood: true,
      city: true,
      state: true,
      zipcode: true,
    });

    const hasSubmitErrors =
      isNameInvalid ||
      isLegalNameInvalid ||
      isCnpjInvalid ||
      isWebsiteInvalid ||
      isContactInvalid ||
      isEmailInvalid ||
      isPasswordInvalid ||
      isConfirmPasswordInvalid ||
      isAddressInvalid ||
      isNumberInvalid ||
      isNeighborhoodInvalid ||
      isCityInvalid ||
      isStateInvalid ||
      isZipcodeInvalid;

    if (hasSubmitErrors || isLoading) {
      return;
    }

    const payload: SignupBusinessPayload = {
      name: name.trim(),
      legalName: legalName.trim(),
      cnpj: cnpjDigits,
      logoUrl: logoUrl.trim() || undefined,
      website: website.trim() || undefined,
      contact: `+55${contactDigits}`,
      email: email.trim(),
      password,
      address: buildAddressPayload(),
    };

    onSubmit(payload);
  }

  return (
    <main className="register-page">
      <section className="register-section">
        <h1>Cadastro de empresa</h1>
        <p>Preencha os dados do negócio para concluir seu cadastro.</p>
        <p className="register-required-note">
          Após o seu cadastro, nossa equipe irá analisar as informações
          fornecidas. O processo de aprovação pode levar até 7 dias. Você
          receberá um e-mail de confirmação assim que a verificação for
          realizada, com retorno se foi aprovado ou não.
        </p>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Nome fantasia</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "name-error" : undefined}
                required
              />
              {nameError && <small id="name-error">{nameError}</small>}
            </div>

            <div className="field">
              <label htmlFor="legalName">Razão social</label>
              <input
                id="legalName"
                name="legalName"
                type="text"
                value={legalName}
                onChange={(event) => setLegalName(event.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, legalName: true }))
                }
                aria-invalid={Boolean(legalNameError)}
                aria-describedby={
                  legalNameError ? "legal-name-error" : undefined
                }
                required
              />
              {legalNameError && (
                <small id="legal-name-error">{legalNameError}</small>
              )}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                id="cnpj"
                name="cnpj"
                type="text"
                placeholder="00.000.000/0000-00"
                value={cnpj}
                inputMode="numeric"
                onChange={(event) =>
                  setCnpj(formatCnpjInput(event.target.value))
                }
                onBlur={() => setTouched((prev) => ({ ...prev, cnpj: true }))}
                aria-invalid={Boolean(cnpjError)}
                aria-describedby={cnpjError ? "cnpj-error" : undefined}
                required
              />
              {cnpjError && <small id="cnpj-error">{cnpjError}</small>}
            </div>

            <div className="field">
              <label htmlFor="website">Site (opcional)</label>
              <input
                id="website"
                name="website"
                type="url"
                placeholder="https://seusite.com.br"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, website: true }))
                }
                aria-invalid={Boolean(websiteError)}
                aria-describedby={websiteError ? "website-error" : undefined}
              />
              {websiteError && <small id="website-error">{websiteError}</small>}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="contact">Telefone para contato</label>
              <input
                id="contact"
                name="contact"
                type="tel"
                placeholder="(11) 99999-9999"
                value={contact}
                inputMode="tel"
                onChange={(event) =>
                  setContact(formatPhoneInput(event.target.value))
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, contact: true }))
                }
                aria-invalid={Boolean(contactError)}
                aria-describedby={contactError ? "contact-error" : undefined}
                required
              />
              {contactError && <small id="contact-error">{contactError}</small>}
            </div>

            <div className="field">
              <label htmlFor="email">E-mail corporativo</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? "email-error" : undefined}
                required
              />
              {emailError && <small id="email-error">{emailError}</small>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="logoUrl">Logo URL (opcional)</label>
            <input
              id="logoUrl"
              name="logoUrl"
              type="url"
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, password: true }))
                }
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? "password-error" : undefined}
                required
              />
              {passwordError && (
                <small id="password-error">{passwordError}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                aria-invalid={Boolean(confirmPasswordError)}
                aria-describedby={
                  confirmPasswordError ? "confirm-password-error" : undefined
                }
                required
              />
              {confirmPasswordError && (
                <small id="confirm-password-error">
                  {confirmPasswordError}
                </small>
              )}
            </div>
          </div>

          <h2>Endereço da empresa</h2>

          <div className="field-row">
            <div className="field">
              <label htmlFor="address">Rua</label>
              <input
                id="address"
                name="address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, address: true }))
                }
                aria-invalid={Boolean(addressError)}
                aria-describedby={addressError ? "address-error" : undefined}
                required
              />
              {addressError && <small id="address-error">{addressError}</small>}
            </div>

            <div className="field field-small">
              <label htmlFor="number">Número</label>
              <input
                id="number"
                name="number"
                type="text"
                value={number}
                onChange={(event) => setNumber(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, number: true }))}
                aria-invalid={Boolean(numberError)}
                aria-describedby={numberError ? "number-error" : undefined}
                required
              />
              {numberError && <small id="number-error">{numberError}</small>}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="complement">Complemento (opcional)</label>
              <input
                id="complement"
                name="complement"
                type="text"
                value={complement}
                onChange={(event) => setComplement(event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="neighborhood">Bairro</label>
              <input
                id="neighborhood"
                name="neighborhood"
                type="text"
                value={neighborhood}
                onChange={(event) => setNeighborhood(event.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, neighborhood: true }))
                }
                aria-invalid={Boolean(neighborhoodError)}
                aria-describedby={
                  neighborhoodError ? "neighborhood-error" : undefined
                }
                required
              />
              {neighborhoodError && (
                <small id="neighborhood-error">{neighborhoodError}</small>
              )}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                name="city"
                type="text"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, city: true }))}
                aria-invalid={Boolean(cityError)}
                aria-describedby={cityError ? "city-error" : undefined}
                required
              />
              {cityError && <small id="city-error">{cityError}</small>}
            </div>

            <div className="field field-small">
              <label htmlFor="state">UF</label>
              <input
                id="state"
                name="state"
                type="text"
                maxLength={2}
                value={state}
                onChange={(event) =>
                  setState(formatStateInput(event.target.value))
                }
                onBlur={() => setTouched((prev) => ({ ...prev, state: true }))}
                aria-invalid={Boolean(stateError)}
                aria-describedby={stateError ? "state-error" : undefined}
                required
              />
              {stateError && <small id="state-error">{stateError}</small>}
            </div>

            <div className="field field-small">
              <label htmlFor="zipcode">CEP</label>
              <input
                id="zipcode"
                name="zipcode"
                type="text"
                placeholder="00000-000"
                value={zipcode}
                inputMode="numeric"
                onChange={(event) =>
                  setZipcode(formatZipcodeInput(event.target.value))
                }
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, zipcode: true }))
                }
                aria-invalid={Boolean(zipcodeError)}
                aria-describedby={zipcodeError ? "zipcode-error" : undefined}
                required
              />
              {zipcodeError && <small id="zipcode-error">{zipcodeError}</small>}
            </div>
          </div>

          {serverError && (
            <p role="alert" className="form-error">
              {serverError}
            </p>
          )}

          {successMessage && <p className="form-success">{successMessage}</p>}

          <button type="submit" disabled={isLoading || hasErrors}>
            {isLoading ? "Cadastrando..." : "Cadastrar empresa"}
          </button>

          <footer
            className="register-card-footer"
            aria-label="Ações adicionais"
          >
            <p>
              Já possui conta? <Link to="/login">Entrar</Link>
            </p>
            <p>
              <Link to="/">Voltar para página inicial</Link>
            </p>
          </footer>
        </form>
      </section>
    </main>
  );
}
