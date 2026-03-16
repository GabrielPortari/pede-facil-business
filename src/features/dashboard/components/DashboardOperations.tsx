import { useState } from "react";
import { DashboardOverview } from "./DashboardOverview";
import { OrdersPanel } from "./OrdersPanel";
import type { BusinessOrder, OrderStatusFilter } from "../types/order.type";

const OPERATION_MENU = [
  { key: "overview", label: "Visão geral" },
  { key: "orders", label: "Pedidos" },
  { key: "products", label: "Produtos cadastrados" },
  { key: "promotions", label: "Promoções" },
  { key: "order-info", label: "Informação de pedidos" },
] as const;

type OperationMenuKey = (typeof OPERATION_MENU)[number]["key"];

interface DashboardProductItem {
  id: string;
  name: string;
  description?: string;
  priceInCents: number;
  promotionType?: "percentage" | "fixed";
  promotionPercentage?: number;
  promotionAmountInCents?: number;
  promotedPriceInCents?: number | null;
  available: boolean;
  stock: number;
  useStock: boolean;
  imageUrl?: string;
  hasActivePromotion: boolean;
}

interface DashboardPromotedProductItem {
  id: string;
  name: string;
  description?: string;
  priceInCents: number;
  promotionType?: "percentage" | "fixed";
  promotionPercentage?: number;
  promotionAmountInCents?: number;
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
  productFilter: "all" | "available" | "unavailable";
  onProductFilterChange: (filter: "all" | "available" | "unavailable") => void;
  promotedProducts: DashboardPromotedProductItem[];
  isPromotionsLoading: boolean;
  promotionsError: string;
  removePromotionError: string;
  removingPromotionProductId: string | null;
  onReloadPromotedProducts: () => void;
  onRemovePromotion: (productId: string) => void;
  onEditPromotion: (productId: string) => void;
  onOpenPromotionModal: () => void;
  productsWithoutPromotion: DashboardProductItem[];
  isProductsWithoutPromotionLoading: boolean;
  productsWithoutPromotionError: string;
  onReloadProductsWithoutPromotion: () => void;
  onApplyPromotion: (productId: string) => void;
  promotionFilter: "with" | "without";
  onPromotionFilterChange: (filter: "with" | "without") => void;
  orders: BusinessOrder[];
  isOrdersLoading: boolean;
  ordersError: string;
  onReloadOrders: () => void;
  orderStatusFilter: OrderStatusFilter;
  onOrderStatusFilterChange: (value: OrderStatusFilter) => void;
  orderLimit: number;
  onOrderLimitChange: (value: number) => void;
  overviewStats: {
    totalProducts: number;
    availableProducts: number;
    unavailableProducts: number;
    promotedProducts: number;
    productsWithoutPromotion: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    noStockControlProducts: number;
  };
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
  productFilter,
  onProductFilterChange,
  promotedProducts,
  isPromotionsLoading,
  promotionsError,
  removePromotionError,
  removingPromotionProductId,
  onReloadPromotedProducts,
  onRemovePromotion,
  onEditPromotion,
  onOpenPromotionModal,
  productsWithoutPromotion,
  isProductsWithoutPromotionLoading,
  productsWithoutPromotionError,
  onReloadProductsWithoutPromotion,
  onApplyPromotion,
  promotionFilter,
  onPromotionFilterChange,
  orders,
  isOrdersLoading,
  ordersError,
  onReloadOrders,
  orderStatusFilter,
  onOrderStatusFilterChange,
  orderLimit,
  onOrderLimitChange,
  overviewStats,
}: DashboardOperationsProps) {
  const [activeTab, setActiveTab] = useState<OperationMenuKey>("overview");

  const enabledTabs: OperationMenuKey[] = [
    "overview",
    "orders",
    "products",
    "promotions",
  ];

  return (
    <section className="dashboard-operations" aria-label="Operação">
      <aside className="operations-sidebar" aria-label="Menu de operações">
        <h2>Operações</h2>
        <nav>
          {OPERATION_MENU.map((menuItem) => (
            <button
              key={menuItem.key}
              type="button"
              className={`operations-menu-item${activeTab === menuItem.key ? " is-active" : ""}`}
              disabled={!enabledTabs.includes(menuItem.key as OperationMenuKey)}
              onClick={() => {
                if (enabledTabs.includes(menuItem.key as OperationMenuKey)) {
                  setActiveTab(menuItem.key as OperationMenuKey);
                }
              }}
            >
              {menuItem.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="operations-content">
        {activeTab === "overview" ? (
          <DashboardOverview
            totalProducts={overviewStats.totalProducts}
            availableProducts={overviewStats.availableProducts}
            unavailableProducts={overviewStats.unavailableProducts}
            promotedProducts={overviewStats.promotedProducts}
            productsWithoutPromotion={overviewStats.productsWithoutPromotion}
            lowStockProducts={overviewStats.lowStockProducts}
            outOfStockProducts={overviewStats.outOfStockProducts}
            noStockControlProducts={overviewStats.noStockControlProducts}
            onOpenProductModal={onOpenProductModal}
            onOpenPromotionModal={onOpenPromotionModal}
            onRefreshProducts={onReloadProducts}
            isRefreshingProducts={isProductsLoading}
          />
        ) : null}

        {activeTab === "orders" ? (
          <OrdersPanel
            orders={orders}
            isOrdersLoading={isOrdersLoading}
            ordersError={ordersError}
            onReloadOrders={onReloadOrders}
            formatPrice={formatPrice}
            statusFilter={orderStatusFilter}
            onStatusFilterChange={onOrderStatusFilterChange}
            limit={orderLimit}
            onLimitChange={onOrderLimitChange}
          />
        ) : null}

        {activeTab === "products" ? (
          <article className="dashboard-panel">
            <div className="dashboard-products-header">
              <div>
                <h2>Produtos cadastrados</h2>
                <p className="dashboard-products-subtitle">
                  Lista em tempo real dos produtos vinculados ao seu negócio.
                </p>
              </div>

              <div className="dashboard-products-actions">
                <div className="dashboard-filter-group">
                  <button
                    type="button"
                    className={`dashboard-filter-button${productFilter === "all" ? " is-active" : ""}`}
                    onClick={() => onProductFilterChange("all")}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    className={`dashboard-filter-button${productFilter === "available" ? " is-active" : ""}`}
                    onClick={() => onProductFilterChange("available")}
                  >
                    Disponíveis
                  </button>
                  <button
                    type="button"
                    className={`dashboard-filter-button${productFilter === "unavailable" ? " is-active" : ""}`}
                    onClick={() => onProductFilterChange("unavailable")}
                  >
                    Indisponíveis
                  </button>
                </div>
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
                      <div className="dashboard-product-badges">
                        {product.hasActivePromotion ? (
                          <span className="dashboard-promotion-badge">
                            Promoção ativa
                          </span>
                        ) : null}
                        <span
                          className={`dashboard-product-status${product.available ? " dashboard-product-status-available" : " dashboard-product-status-unavailable"}`}
                        >
                          {product.available ? "Disponível" : "Indisponível"}
                        </span>
                      </div>
                    </div>

                    <p className="dashboard-product-description">
                      {product.description?.trim() ||
                        "Sem descrição cadastrada."}
                    </p>

                    <dl className="dashboard-product-meta">
                      <div>
                        <dt>Preço</dt>
                        <dd>
                          {product.hasActivePromotion &&
                          product.promotedPriceInCents !== null &&
                          product.promotedPriceInCents !== undefined ? (
                            <span className="dashboard-product-price-promotion">
                              <span className="dashboard-product-price-original">
                                {formatPrice(product.priceInCents)}
                              </span>
                              <span className="dashboard-product-price-discounted">
                                {formatPrice(product.promotedPriceInCents)}
                              </span>
                            </span>
                          ) : (
                            formatPrice(product.priceInCents)
                          )}
                        </dd>
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
        ) : null}

        {activeTab === "promotions" ? (
          <article className="dashboard-panel">
            <div className="dashboard-products-header">
              <div>
                <h2>Promoções</h2>
                <p className="dashboard-products-subtitle">
                  {promotionFilter === "with"
                    ? "Produtos com promoção aplicada no momento."
                    : "Produtos que ainda não possuem promoção ativa."}
                </p>
              </div>

              <div className="dashboard-products-actions">
                <div className="dashboard-filter-group">
                  <button
                    type="button"
                    className={`dashboard-filter-button${promotionFilter === "with" ? " is-active" : ""}`}
                    onClick={() => onPromotionFilterChange("with")}
                  >
                    Com promoção
                  </button>
                  <button
                    type="button"
                    className={`dashboard-filter-button${promotionFilter === "without" ? " is-active" : ""}`}
                    onClick={() => onPromotionFilterChange("without")}
                  >
                    Sem promoção
                  </button>
                </div>
                {promotionFilter === "with" ? (
                  <button
                    type="button"
                    className="dashboard-secondary-button"
                    onClick={onReloadPromotedProducts}
                    disabled={isPromotionsLoading}
                  >
                    {isPromotionsLoading ? "Atualizando..." : "Atualizar lista"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="dashboard-secondary-button"
                    onClick={onReloadProductsWithoutPromotion}
                    disabled={isProductsWithoutPromotionLoading}
                  >
                    {isProductsWithoutPromotionLoading
                      ? "Atualizando..."
                      : "Atualizar lista"}
                  </button>
                )}
                <button
                  type="button"
                  className="dashboard-primary-button"
                  onClick={onOpenPromotionModal}
                >
                  Aplicar promoção
                </button>
              </div>
            </div>

            {promotionFilter === "with" ? (
              <>
                {promotionsError ? (
                  <div className="dashboard-products-feedback dashboard-products-feedback-error">
                    <p>{promotionsError}</p>
                  </div>
                ) : null}

                {removePromotionError ? (
                  <div className="dashboard-products-feedback dashboard-products-feedback-error">
                    <p>{removePromotionError}</p>
                  </div>
                ) : null}

                {!promotionsError && isPromotionsLoading ? (
                  <div className="dashboard-products-feedback">
                    <p>Carregando promoções...</p>
                  </div>
                ) : null}

                {!promotionsError &&
                !isPromotionsLoading &&
                !promotedProducts.length ? (
                  <div className="dashboard-products-feedback">
                    <p>Nenhuma promoção ativa no momento.</p>
                  </div>
                ) : null}

                {promotedProducts.length ? (
                  <div className="dashboard-products-grid">
                    {promotedProducts.map((product) => (
                      <article
                        key={product.id}
                        className="dashboard-product-card"
                      >
                        <div className="dashboard-product-card-top">
                          <h3>{product.name}</h3>
                          <span className="dashboard-promotion-badge">
                            Em promoção
                          </span>
                        </div>

                        <p className="dashboard-product-description">
                          {product.description?.trim() ||
                            "Sem descrição cadastrada."}
                        </p>

                        <dl className="dashboard-product-meta">
                          <div>
                            <dt>Preço original</dt>
                            <dd>{formatPrice(product.priceInCents)}</dd>
                          </div>
                          {product.promotionType === "percentage" &&
                          product.promotionPercentage !== undefined ? (
                            <div>
                              <dt>Desconto</dt>
                              <dd>{product.promotionPercentage}%</dd>
                            </div>
                          ) : null}
                          {product.promotionType === "fixed" &&
                          product.promotionAmountInCents !== undefined ? (
                            <div>
                              <dt>Desconto fixo</dt>
                              <dd>
                                {formatPrice(product.promotionAmountInCents)}
                              </dd>
                            </div>
                          ) : null}
                        </dl>

                        <div className="dashboard-product-actions">
                          <button
                            type="button"
                            className="dashboard-action-button"
                            onClick={() => onEditPromotion(product.id)}
                            disabled={removingPromotionProductId === product.id}
                          >
                            Alterar promoção
                          </button>
                          <button
                            type="button"
                            className="dashboard-danger-button"
                            onClick={() => onRemovePromotion(product.id)}
                            disabled={removingPromotionProductId === product.id}
                          >
                            {removingPromotionProductId === product.id
                              ? "Removendo..."
                              : "Remover promoção"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <>
                {productsWithoutPromotionError ? (
                  <div className="dashboard-products-feedback dashboard-products-feedback-error">
                    <p>{productsWithoutPromotionError}</p>
                  </div>
                ) : null}

                {!productsWithoutPromotionError &&
                isProductsWithoutPromotionLoading ? (
                  <div className="dashboard-products-feedback">
                    <p>Carregando produtos sem promoção...</p>
                  </div>
                ) : null}

                {!productsWithoutPromotionError &&
                !isProductsWithoutPromotionLoading &&
                !productsWithoutPromotion.length ? (
                  <div className="dashboard-products-feedback">
                    <p>Todos os produtos já possuem promoção ativa.</p>
                  </div>
                ) : null}

                {productsWithoutPromotion.length ? (
                  <div className="dashboard-products-grid">
                    {productsWithoutPromotion.map((product) => (
                      <article
                        key={product.id}
                        className="dashboard-product-card"
                      >
                        <div className="dashboard-product-card-top">
                          <div>
                            <h3>{product.name}</h3>
                          </div>
                          <span
                            className={`dashboard-product-status${product.available ? " dashboard-product-status-available" : " dashboard-product-status-unavailable"}`}
                          >
                            {product.available ? "Disponível" : "Indisponível"}
                          </span>
                        </div>

                        <p className="dashboard-product-description">
                          {product.description?.trim() ||
                            "Sem descrição cadastrada."}
                        </p>

                        <dl className="dashboard-product-meta">
                          <div>
                            <dt>Preço</dt>
                            <dd>{formatPrice(product.priceInCents)}</dd>
                          </div>
                        </dl>

                        <div className="dashboard-product-actions">
                          <button
                            type="button"
                            className="dashboard-action-button"
                            onClick={() => onApplyPromotion(product.id)}
                          >
                            Aplicar promoção
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </article>
        ) : null}
      </div>
    </section>
  );
}
