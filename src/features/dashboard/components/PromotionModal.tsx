import type { PromotionType } from "../types/product.type";

interface ProductOption {
  id: string;
  name: string;
  priceInCents: number;
  stock: number;
}

interface PromotionModalProps {
  isOpen: boolean;
  isLoading: boolean;
  serverError: string;
  successMessage: string;
  promotionProductId: string;
  promotionType: PromotionType;
  promotionPercentage: string;
  promotionAmount: string;
  usePromotionStock: boolean;
  promotionStock: string;
  promotionProductIdError: string;
  promotionPercentageError: string;
  promotionAmountError: string;
  promotionStockError: string;
  hasRealStockControl: boolean;
  selectedPromotionProduct: ProductOption | undefined;
  discountedPriceInCents: number | null;
  isPromotionFormValid: boolean;
  products: ProductOption[];
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onProductChange: (value: string) => void;
  onTypeChange: (value: PromotionType) => void;
  onPercentageChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onUsePromotionStockChange: (value: boolean) => void;
  onPromotionStockChange: (value: string) => void;
  formatCentsToBrl: (amountInCents: number) => string;
}

export function PromotionModal({
  isOpen,
  isLoading,
  serverError,
  successMessage,
  promotionProductId,
  promotionType,
  promotionPercentage,
  promotionAmount,
  usePromotionStock,
  promotionStock,
  promotionProductIdError,
  promotionPercentageError,
  promotionAmountError,
  promotionStockError,
  hasRealStockControl,
  selectedPromotionProduct,
  discountedPriceInCents,
  isPromotionFormValid,
  products,
  onClose,
  onSubmit,
  onProductChange,
  onTypeChange,
  onPercentageChange,
  onAmountChange,
  onUsePromotionStockChange,
  onPromotionStockChange,
  formatCentsToBrl,
}: PromotionModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="dashboard-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="dashboard-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Aplicar promoção"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dashboard-modal-header">
          <div>
            <h2>Aplicar promoção</h2>
            <p>Atualize a promoção de um produto com base no seu DTO.</p>
          </div>
          <button
            type="button"
            className="dashboard-close-button"
            aria-label="Fechar modal"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form className="dashboard-form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="promotion-product-id">Produto</label>
            <select
              id="promotion-product-id"
              value={promotionProductId}
              onChange={(event) => onProductChange(event.target.value)}
              aria-invalid={Boolean(promotionProductIdError)}
              aria-describedby={
                promotionProductIdError
                  ? "promotion-product-id-error"
                  : undefined
              }
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {`${product.name} - ${formatCentsToBrl(product.priceInCents)}`}
                </option>
              ))}
            </select>
            {promotionProductIdError && (
              <small id="promotion-product-id-error">
                {promotionProductIdError}
              </small>
            )}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="promotion-type">Tipo de promoção</label>
              <select
                id="promotion-type"
                value={promotionType}
                onChange={(event) =>
                  onTypeChange(event.target.value as PromotionType)
                }
              >
                <option value="percentage">Porcentagem (%)</option>
                <option value="fixed">Valor fixo (BRL)</option>
              </select>
            </div>

            {promotionType === "percentage" && (
              <div className="field">
                <label htmlFor="promotion-percentage">Valor do desconto</label>
                <div className="input-with-suffix">
                  <input
                    id="promotion-percentage"
                    type="text"
                    inputMode="numeric"
                    value={promotionPercentage}
                    onChange={(event) => onPercentageChange(event.target.value)}
                    placeholder="0 - 100"
                    aria-invalid={Boolean(promotionPercentageError)}
                    aria-describedby={
                      promotionPercentageError
                        ? "promotion-percentage-error"
                        : undefined
                    }
                  />
                  <span className="input-suffix" aria-hidden="true">
                    %
                  </span>
                </div>
                {promotionPercentageError && (
                  <small id="promotion-percentage-error">
                    {promotionPercentageError}
                  </small>
                )}
              </div>
            )}

            {promotionType === "fixed" && (
              <div className="field">
                <label htmlFor="promotion-amount">Valor do desconto</label>
                <input
                  id="promotion-amount"
                  type="text"
                  inputMode="numeric"
                  value={promotionAmount}
                  onChange={(event) => onAmountChange(event.target.value)}
                  placeholder="R$ 0,00"
                  aria-invalid={Boolean(promotionAmountError)}
                  aria-describedby={
                    promotionAmountError ? "promotion-amount-error" : undefined
                  }
                />
                {promotionAmountError && (
                  <small id="promotion-amount-error">
                    {promotionAmountError}
                  </small>
                )}
              </div>
            )}
          </div>

          {selectedPromotionProduct && discountedPriceInCents !== null && (
            <p className="promotion-preview">
              Novo valor do produto: {formatCentsToBrl(discountedPriceInCents)}
            </p>
          )}

          <label
            className="checkbox-field"
            htmlFor="promotion-use-promotion-stock"
          >
            <input
              id="promotion-use-promotion-stock"
              type="checkbox"
              checked={usePromotionStock}
              onChange={(event) =>
                onUsePromotionStockChange(event.target.checked)
              }
            />
            Usar estoque promocional
          </label>

          {usePromotionStock && (
            <div className="field field-small">
              <label htmlFor="promotion-stock">Estoque promocional</label>
              <input
                id="promotion-stock"
                type="number"
                min={0}
                step={1}
                value={promotionStock}
                onChange={(event) => onPromotionStockChange(event.target.value)}
                aria-invalid={Boolean(promotionStockError)}
                aria-describedby={
                  promotionStockError ? "promotion-stock-error" : undefined
                }
              />
              {hasRealStockControl && selectedPromotionProduct && (
                <small>
                  Estoque disponível: {selectedPromotionProduct.stock}
                </small>
              )}
              {promotionStockError && (
                <small id="promotion-stock-error">{promotionStockError}</small>
              )}
            </div>
          )}

          {serverError && <p className="form-error">{serverError}</p>}
          {successMessage && <p className="form-success">{successMessage}</p>}

          <button type="submit" disabled={isLoading || !isPromotionFormValid}>
            {isLoading ? "Aplicando..." : "Aplicar promoção"}
          </button>
        </form>
      </section>
    </div>
  );
}
