const OPERATION_MENU = [
  { key: "overview", label: "Visão geral" },
  { key: "orders", label: "Pedidos" },
  { key: "products", label: "Produtos cadastrados" },
  { key: "promotions", label: "Promoções" },
  { key: "order-info", label: "Informação de pedidos" },
] as const;

interface DashboardProductItem {
  id: string;
  name: string;
  description?: string;
  priceInCents: number;
  available: boolean;
  stock: number;
  useStock: boolean;
  imageUrl?: string;
}

interface DashboardOperationsProps {
  products: DashboardProductItem[];
  isProductsLoading: boolean;
  productsError: string;
  deleteError: string;
  deletingProductId: string | null;
  onReloadProducts: () => void;
  onOpenProductModal: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  formatPrice: (amountInCents: number) => string;
}

export function DashboardOperations({
  products,
  isProductsLoading,
  productsError,
  deleteError,
  deletingProductId,
  onReloadProducts,
  onOpenProductModal,
  onEditProduct,
  onDeleteProduct,
  formatPrice,
}: DashboardOperationsProps) {
  return (
    <section className="dashboard-operations" aria-label="Operação">
      <aside className="operations-sidebar" aria-label="Menu de operações">
        <h2>Operações</h2>
        <nav>
          {OPERATION_MENU.map((menuItem) => (
            <button
              key={menuItem.key}
              type="button"
              className={`operations-menu-item${menuItem.key === "products" ? " is-active" : ""}`}
              disabled={menuItem.key !== "products"}
            >
              {menuItem.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="operations-content">
        <article className="dashboard-panel">
          <div className="dashboard-products-header">
            <div>
              <h2>Produtos cadastrados</h2>
              <p className="dashboard-products-subtitle">
                Lista em tempo real dos produtos vinculados ao seu negócio.
              </p>
            </div>

            <div className="dashboard-products-actions">
              <button
                type="button"
                className="dashboard-secondary-button"
                onClick={onReloadProducts}
                disabled={isProductsLoading}
              >
                {isProductsLoading ? "Atualizando..." : "Atualizar lista"}
              </button>
              <button
                type="button"
                className="dashboard-primary-button"
                onClick={onOpenProductModal}
              >
                Cadastrar produto
              </button>
            </div>
          </div>

          {productsError ? (
            <div className="dashboard-products-feedback dashboard-products-feedback-error">
              <p>{productsError}</p>
            </div>
          ) : null}

          {deleteError ? (
            <div className="dashboard-products-feedback dashboard-products-feedback-error">
              <p>{deleteError}</p>
            </div>
          ) : null}

          {!productsError && isProductsLoading ? (
            <div className="dashboard-products-feedback">
              <p>Carregando produtos cadastrados...</p>
            </div>
          ) : null}

          {!productsError && !isProductsLoading && !products.length ? (
            <div className="dashboard-products-feedback">
              <p>Nenhum produto cadastrado ainda.</p>
            </div>
          ) : null}

          {products.length ? (
            <div className="dashboard-products-grid">
              {products.map((product) => (
                <article key={product.id} className="dashboard-product-card">
                  <div className="dashboard-product-card-top">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="dashboard-product-id">ID: {product.id}</p>
                    </div>
                    <span
                      className={`dashboard-product-status${product.available ? " dashboard-product-status-available" : " dashboard-product-status-unavailable"}`}
                    >
                      {product.available ? "Disponível" : "Indisponível"}
                    </span>
                  </div>

                  <p className="dashboard-product-description">
                    {product.description?.trim() || "Sem descrição cadastrada."}
                  </p>

                  <dl className="dashboard-product-meta">
                    <div>
                      <dt>Preço</dt>
                      <dd>{formatPrice(product.priceInCents)}</dd>
                    </div>
                    <div>
                      <dt>Estoque</dt>
                      <dd>
                        {product.useStock
                          ? String(product.stock)
                          : "Sem controle"}
                      </dd>
                    </div>
                  </dl>

                  <div className="dashboard-product-actions">
                    <button
                      type="button"
                      className="dashboard-action-button"
                      onClick={() => onEditProduct(product.id)}
                      disabled={deletingProductId === product.id}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="dashboard-danger-button"
                      onClick={() => onDeleteProduct(product.id)}
                      disabled={deletingProductId === product.id}
                    >
                      {deletingProductId === product.id
                        ? "Excluindo..."
                        : "Excluir"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
