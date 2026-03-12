import { type FormEvent, useEffect, useState } from "react";
import type {
  AuthMeProfile,
  UpdateBusinessPayload,
} from "../../auth/types/auth.type";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import "./EditProfileModal.css";

interface EditProfileModalProps {
  profile: AuthMeProfile;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

interface EditFormState {
  name: string;
  email: string;
  contact: string;
  website: string;
  logoUrl: string;
  addressStreet: string;
  addressNumber: string;
  addressComplement: string;
  addressNeighborhood: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
}

function getInitialFormState(profile: AuthMeProfile): EditFormState {
  return {
    name: profile.name ?? "",
    email: profile.email ?? "",
    contact: profile.contact ?? "",
    website: profile.website ?? "",
    logoUrl: profile.logoUrl ?? "",
    addressStreet: profile.address.address ?? "",
    addressNumber: profile.address.number ?? "",
    addressComplement: profile.address.complement ?? "",
    addressNeighborhood: profile.address.neighborhood ?? "",
    addressCity: profile.address.city ?? "",
    addressState: profile.address.state ?? "",
    addressZipcode: profile.address.zipcode ?? "",
  };
}

export function EditProfileModal({
  profile,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const [form, setForm] = useState<EditFormState>(getInitialFormState(profile));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isSubmitting, serverError, submitUpdate } = useUpdateProfile();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function handleChange(field: keyof EditFormState, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const errors = {
    name: isSubmitted && !form.name.trim() ? "Informe o nome fantasia." : "",
    email: isSubmitted && !isEmailValid ? "Informe um e-mail válido." : "",
    contact: isSubmitted && !form.contact.trim() ? "Informe o contato." : "",
    addressStreet:
      isSubmitted && !form.addressStreet.trim() ? "Informe o logradouro." : "",
    addressNumber:
      isSubmitted && !form.addressNumber.trim() ? "Informe o número." : "",
    addressNeighborhood:
      isSubmitted && !form.addressNeighborhood.trim()
        ? "Informe o bairro."
        : "",
    addressCity:
      isSubmitted && !form.addressCity.trim() ? "Informe a cidade." : "",
    addressState:
      isSubmitted && form.addressState.trim().length !== 2
        ? "Informe a UF (2 letras)."
        : "",
    addressZipcode:
      isSubmitted && !form.addressZipcode.trim() ? "Informe o CEP." : "",
  };

  const isFormValid =
    Boolean(form.name.trim()) &&
    isEmailValid &&
    Boolean(form.contact.trim()) &&
    Boolean(form.addressStreet.trim()) &&
    Boolean(form.addressNumber.trim()) &&
    Boolean(form.addressNeighborhood.trim()) &&
    Boolean(form.addressCity.trim()) &&
    form.addressState.trim().length === 2 &&
    Boolean(form.addressZipcode.trim());

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setIsSubmitted(true);

    if (!isFormValid || isSubmitting) {
      return;
    }

    const payload: UpdateBusinessPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      website: form.website.trim() || undefined,
      logoUrl: form.logoUrl.trim() || undefined,
      address: {
        address: form.addressStreet.trim(),
        number: form.addressNumber.trim(),
        complement: form.addressComplement.trim() || undefined,
        neighborhood: form.addressNeighborhood.trim(),
        city: form.addressCity.trim(),
        state: form.addressState.trim().toUpperCase(),
        zipcode: form.addressZipcode.trim(),
      },
    };

    const ok = await submitUpdate(payload);

    if (ok) {
      await onSaved();
      onClose();
    }
  }

  return (
    <div
      className="edit-profile-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="edit-profile-modal">
        <div className="edit-profile-modal-header">
          <div>
            <h2 id="edit-profile-title">Editar dados da empresa</h2>
            <p>
              Razão social, CNPJ e status da conta são gerenciados pelo
              administrador e não podem ser alterados aqui.
            </p>
          </div>
          <button
            type="button"
            className="edit-profile-close-button"
            aria-label="Fechar"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="edit-profile-form"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          noValidate
        >
          <fieldset className="edit-profile-fieldset">
            <legend>Informações gerais</legend>

            <div className="edit-profile-field">
              <label htmlFor="ep-name">Nome fantasia *</label>
              <input
                id="ep-name"
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Cafeteria do Bairro"
              />
              {errors.name ? <small>{errors.name}</small> : null}
            </div>

            <div className="edit-profile-field">
              <label htmlFor="ep-email">E-mail *</label>
              <input
                id="ep-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contato@empresa.com"
              />
              {errors.email ? <small>{errors.email}</small> : null}
            </div>

            <div className="edit-profile-field">
              <label htmlFor="ep-contact">Contato *</label>
              <input
                id="ep-contact"
                type="tel"
                value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="+55 (11) 99999-9999"
              />
              {errors.contact ? <small>{errors.contact}</small> : null}
            </div>

            <div className="edit-profile-field">
              <label htmlFor="ep-website">Website</label>
              <input
                id="ep-website"
                type="url"
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://exemplo.com.br"
              />
            </div>

            <div className="edit-profile-field">
              <label htmlFor="ep-logo-url">URL do logo</label>
              <input
                id="ep-logo-url"
                type="url"
                value={form.logoUrl}
                onChange={(e) => handleChange("logoUrl", e.target.value)}
                placeholder="https://cdn.exemplo.com/logo.png"
              />
            </div>
          </fieldset>

          <fieldset className="edit-profile-fieldset">
            <legend>Endereço</legend>

            <div className="edit-profile-field">
              <label htmlFor="ep-address-street">Logradouro *</label>
              <input
                id="ep-address-street"
                type="text"
                value={form.addressStreet}
                onChange={(e) => handleChange("addressStreet", e.target.value)}
                placeholder="Rua, Avenida, Alameda..."
              />
              {errors.addressStreet ? (
                <small>{errors.addressStreet}</small>
              ) : null}
            </div>

            <div className="edit-profile-field-row">
              <div className="edit-profile-field">
                <label htmlFor="ep-address-number">Número *</label>
                <input
                  id="ep-address-number"
                  type="text"
                  value={form.addressNumber}
                  onChange={(e) =>
                    handleChange("addressNumber", e.target.value)
                  }
                  placeholder="123"
                />
                {errors.addressNumber ? (
                  <small>{errors.addressNumber}</small>
                ) : null}
              </div>
              <div className="edit-profile-field">
                <label htmlFor="ep-address-complement">Complemento</label>
                <input
                  id="ep-address-complement"
                  type="text"
                  value={form.addressComplement}
                  onChange={(e) =>
                    handleChange("addressComplement", e.target.value)
                  }
                  placeholder="Apto, sala, bloco..."
                />
              </div>
            </div>

            <div className="edit-profile-field">
              <label htmlFor="ep-address-neighborhood">Bairro *</label>
              <input
                id="ep-address-neighborhood"
                type="text"
                value={form.addressNeighborhood}
                onChange={(e) =>
                  handleChange("addressNeighborhood", e.target.value)
                }
                placeholder="Nome do bairro"
              />
              {errors.addressNeighborhood ? (
                <small>{errors.addressNeighborhood}</small>
              ) : null}
            </div>

            <div className="edit-profile-field-row edit-profile-field-row-city-uf">
              <div className="edit-profile-field">
                <label htmlFor="ep-address-city">Cidade *</label>
                <input
                  id="ep-address-city"
                  type="text"
                  value={form.addressCity}
                  onChange={(e) => handleChange("addressCity", e.target.value)}
                  placeholder="Cidade"
                />
                {errors.addressCity ? (
                  <small>{errors.addressCity}</small>
                ) : null}
              </div>
              <div className="edit-profile-field">
                <label htmlFor="ep-address-state">UF *</label>
                <input
                  id="ep-address-state"
                  type="text"
                  maxLength={2}
                  value={form.addressState}
                  onChange={(e) =>
                    handleChange(
                      "addressState",
                      e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                    )
                  }
                  placeholder="SP"
                />
                {errors.addressState ? (
                  <small>{errors.addressState}</small>
                ) : null}
              </div>
            </div>

            <div className="edit-profile-field">
              <label htmlFor="ep-address-zipcode">CEP *</label>
              <input
                id="ep-address-zipcode"
                type="text"
                value={form.addressZipcode}
                onChange={(e) => handleChange("addressZipcode", e.target.value)}
                placeholder="00000-000"
              />
              {errors.addressZipcode ? (
                <small>{errors.addressZipcode}</small>
              ) : null}
            </div>
          </fieldset>

          {serverError ? (
            <p className="edit-profile-server-error" role="alert">
              {serverError}
            </p>
          ) : null}

          <div className="edit-profile-form-actions">
            <button
              type="button"
              className="edit-profile-cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="edit-profile-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
