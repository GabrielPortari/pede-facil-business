import { useState } from "react";

const ORDER_STATUS_SUMMARY = [
  { label: "Aguardando pagamento", count: 4 },
  { label: "Pagos e aguardando entrega", count: 7 },
  { label: "Entregues", count: 5 },
  { label: "Confirmados pelo cliente", count: 3 },
  { label: "Cancelados pelo cliente", count: 1 },
  { label: "Cancelados pelo estabelecimento", count: 1 },
];

const FINALIZED_ORDERS = [
  {
    id: "PED-1041",
    customer: "Ana Souza",
    items: ["2x Cappuccino", "1x Mocha"],
    totalInCents: 5698,
  },
  {
    id: "PED-1042",
    customer: "Rafael Lima",
    items: ["1x Café preto", "1x Croissant"],
    totalInCents: 2298,
  },
  {
    id: "PED-1043",
    customer: "Camila Nunes",
    items: ["2x Latte", "1x Brownie"],
    totalInCents: 4890,
  },
];

const ORDER_ITEMS_DETAILS = [
  {
    orderId: "PED-1045",
    customer: "Thiago Alves",
    items: [
      { name: "Cappuccino", quantity: 1, unitPriceInCents: 2450 },
      { name: "Cookie", quantity: 2, unitPriceInCents: 890 },
    ],
  },
  {
    orderId: "PED-1046",
    customer: "Mariana Costa",
    items: [
      { name: "Mocha", quantity: 2, unitPriceInCents: 800 },
      { name: "Pão de queijo", quantity: 3, unitPriceInCents: 450 },
    ],
  },
];

const REGISTERED_PRODUCTS = [
  {
    id: "prod-001",
    name: "Café preto",
    priceInCents: 1099,
    available: true,
    stock: 12,
  },
  {
    id: "prod-002",
    name: "Cappuccino",
    priceInCents: 2450,
    available: true,
    stock: 6,
  },
  {
    id: "prod-003",
    name: "Mocha",
    priceInCents: 800,
    available: false,
    stock: 0,
  },
];

const ACTIVE_PROMOTIONS = [
  {
    id: "promo-001",
    productName: "Café preto",
    typeLabel: "Porcentagem",
    discountLabel: "10%",
  },
  {
    id: "promo-002",
    productName: "Cappuccino",
    typeLabel: "Valor fixo",
    discountLabel: "R$ 4,00",
  },
];

function formatCentsToBrl(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

const OPERATION_MENU = [
  { key: "orders-status", label: "Status dos pedidos" },
  { key: "finalized-report", label: "Relatório de finalizados" },
  { key: "order-items", label: "Itens dos pedidos" },
  { key: "products", label: "Produtos cadastrados" },
  { key: "promotions", label: "Promoções ativas" },
] as const;

type OperationKey = (typeof OPERATION_MENU)[number]["key"];

export function DashboardOperations() {
  const [selectedOperation, setSelectedOperation] =
    useState<OperationKey>("orders-status");

  return (
    <section className="dashboard-operations" aria-label="Operação">
      <aside className="operations-sidebar" aria-label="Menu de operações">
        <h2>Operações</h2>
        <nav>
          {OPERATION_MENU.map((menuItem) => (
            <button
              key={menuItem.key}
              type="button"
              className={`operations-menu-item${
                selectedOperation === menuItem.key ? " is-active" : ""
              }`}
              onClick={() => setSelectedOperation(menuItem.key)}
            >
              {menuItem.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="operations-content">
        {selectedOperation === "orders-status" && (
          <article className="dashboard-panel">
            <h2>Informação sobre pedidos</h2>
            <div className="status-grid">
              {ORDER_STATUS_SUMMARY.map((status) => (
                <div key={status.label} className="status-card">
                  <span>{status.label}</span>
                  <strong>{status.count}</strong>
                </div>
              ))}
            </div>
          </article>
        )}

        {selectedOperation === "finalized-report" && (
          <article className="dashboard-panel">
            <h2>Relatório de pedidos finalizados</h2>
            <div className="finalized-grid">
              {FINALIZED_ORDERS.map((order) => (
                <div key={order.id} className="finalized-card">
                  <h3>{order.id}</h3>
                  <p>Quem pediu: {order.customer}</p>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <strong>Total: {formatCentsToBrl(order.totalInCents)}</strong>
                </div>
              ))}
            </div>
          </article>
        )}

        {selectedOperation === "order-items" && (
          <article className="dashboard-panel">
            <h2>Itens em pedidos realizados</h2>
            <div className="details-list">
              {ORDER_ITEMS_DETAILS.map((order) => (
                <div key={order.orderId} className="details-card">
                  <div className="details-header">
                    <div>
                      <h3>{order.orderId}</h3>
                      <p>Cliente: {order.customer}</p>
                    </div>
                    <button type="button" className="dashboard-action-button">
                      Ver itens do pedido
                    </button>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={`${order.orderId}-${item.name}`}>
                        {item.quantity}x {item.name} ·{" "}
                        {formatCentsToBrl(item.unitPriceInCents)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </article>
        )}

        {selectedOperation === "products" && (
          <article className="dashboard-panel">
            <h2>Produtos cadastrados</h2>
            <div className="details-list">
              {REGISTERED_PRODUCTS.map((product) => (
                <div key={product.id} className="details-card">
                  <div className="details-header">
                    <div>
                      <h3>{product.name}</h3>
                      <p>
                        {product.id} · {formatCentsToBrl(product.priceInCents)}{" "}
                        · Estoque: {product.stock}
                      </p>
                    </div>
                    <div className="actions-inline">
                      <button type="button" className="dashboard-action-button">
                        Atualizar
                      </button>
                      <button type="button" className="dashboard-danger-button">
                        Remover
                      </button>
                    </div>
                  </div>
                  <p>
                    Status: {product.available ? "Disponível" : "Indisponível"}
                  </p>
                </div>
              ))}
            </div>
          </article>
        )}

        {selectedOperation === "promotions" && (
          <article className="dashboard-panel">
            <h2>Promoções ativas</h2>
            <div className="details-list">
              {ACTIVE_PROMOTIONS.map((promotion) => (
                <div key={promotion.id} className="details-card">
                  <div className="details-header">
                    <div>
                      <h3>{promotion.productName}</h3>
                      <p>
                        {promotion.typeLabel} · Desconto:{" "}
                        {promotion.discountLabel}
                      </p>
                    </div>
                    <div className="actions-inline">
                      <button type="button" className="dashboard-action-button">
                        Atualizar
                      </button>
                      <button type="button" className="dashboard-danger-button">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
