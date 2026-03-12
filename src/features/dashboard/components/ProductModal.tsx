interface ProductModalProps {
  isOpen: boolean;
  mode?: "create" | "edit";
  isLoading: boolean;
  serverError: string;
  successMessage: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  available: boolean;
  useStock: boolean;
  stock: string;
  nameError: string;
  priceError: string;
  stockError: string;
  isProductFormValid: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onAvailableChange: (value: boolean) => void;
  onUseStockChange: (value: boolean) => void;
  onStockChange: (value: string) => void;
}

export function ProductModal({
  isOpen,
  mode = "create",
  isLoading,
  serverError,
  successMessage,
  name,
  description,
  price,
  imageUrl,
  available,
  useStock,
  stock,
  nameError,
  priceError,
  stockError,
  isProductFormValid,
  onClose,
  onSubmit,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onImageUrlChange,
  onAvailableChange,
  onUseStockChange,
  onStockChange,
}: ProductModalProps) {
  if (!isOpen) {
    return null;
  }

  const isEditMode = mode === "edit";

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
        aria-label={isEditMode ? "Edição de produto" : "Cadastro de produto"}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dashboard-modal-header">
          <div>
            <h2>{isEditMode ? "Editar produto" : "Cadastrar produto"}</h2>
            <p>
              {isEditMode
                ? "Atualize os dados principais do produto cadastrado."
                : "Preencha os dados principais para adicionar um novo item ao cardápio."}
            </p>
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
          <div className="field-row">
            <div className="field">
              <label htmlFor="product-name">Nome do produto</label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? "product-name-error" : undefined}
              />
              {nameError && <small id="product-name-error">{nameError}</small>}
            </div>

            <div className="field">
              <label htmlFor="product-price">Preço (BRL)</label>
              <input
                id="product-price"
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(event) => onPriceChange(event.target.value)}
                placeholder="R$ 0,00"
                aria-invalid={Boolean(priceError)}
                aria-describedby={
                  priceError ? "product-price-error" : undefined
                }
              />
              {priceError && (
                <small id="product-price-error">{priceError}</small>
              )}
            </div>
          </div>

          <div className="field">
            <label htmlFor="product-description">Descrição (opcional)</label>
            <textarea
              id="product-description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              rows={3}
            />
          </div>

          <div className="field">
            <label htmlFor="product-image">URL da imagem (opcional)</label>
            <input
              id="product-image"
              type="url"
              value={imageUrl}
              onChange={(event) => onImageUrlChange(event.target.value)}
              placeholder="https://cdn.exemplo.com/produto.png"
            />
          </div>

          <div className="field-row checkbox-row">
            <label className="checkbox-field" htmlFor="product-available">
              <input
                id="product-available"
                type="checkbox"
                checked={available}
                onChange={(event) => onAvailableChange(event.target.checked)}
              />
              Produto disponível
            </label>

            <label className="checkbox-field" htmlFor="product-use-stock">
              <input
                id="product-use-stock"
                type="checkbox"
                checked={useStock}
                onChange={(event) => onUseStockChange(event.target.checked)}
              />
              Controlar estoque
            </label>
          </div>

          {useStock && (
            <div className="field field-small">
              <label htmlFor="product-stock">Estoque inicial</label>
              <input
                id="product-stock"
                type="number"
                min={0}
                step={1}
                value={stock}
                onChange={(event) => onStockChange(event.target.value)}
                aria-invalid={Boolean(stockError)}
                aria-describedby={
                  stockError ? "product-stock-error" : undefined
                }
              />
              {stockError && (
                <small id="product-stock-error">{stockError}</small>
              )}
            </div>
          )}

          {serverError && <p className="form-error">{serverError}</p>}
          {successMessage && <p className="form-success">{successMessage}</p>}

          <button type="submit" disabled={isLoading || !isProductFormValid}>
            {isLoading
              ? isEditMode
                ? "Salvando..."
                : "Cadastrando..."
              : isEditMode
                ? "Salvar alterações"
                : "Cadastrar produto"}
          </button>
        </form>
      </section>
    </div>
  );
}
