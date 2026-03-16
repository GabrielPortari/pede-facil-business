import type { BusinessOrder, OrderStatusFilter } from "../types/order.type";

function formatOrderTimestamp(value: BusinessOrder["createdAt"]): string {
  const seconds = value?._seconds;
  const nanoseconds = value?._nanoseconds ?? 0;

  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return "-";
  }

  const timestampInMilliseconds =
    seconds * 1000 + Math.floor(nanoseconds / 1000000);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestampInMilliseconds));
}

function formatOrderTime(value: BusinessOrder["createdAt"]): string {
  const seconds = value?._seconds;
  const nanoseconds = value?._nanoseconds ?? 0;

  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return "-";
  }

  const timestampInMilliseconds =
    seconds * 1000 + Math.floor(nanoseconds / 1000000);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestampInMilliseconds));
}

interface OrdersPanelProps {
  orders: BusinessOrder[];
  isOrdersLoading: boolean;
  ordersError: string;
  onReloadOrders: () => void;
  formatPrice: (amountInCents: number) => string;
  statusFilter: OrderStatusFilter;
  onStatusFilterChange: (value: OrderStatusFilter) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}

export function OrdersPanel({
  orders,
  isOrdersLoading,
  ordersError,
  onReloadOrders,
  formatPrice,
  statusFilter,
  onStatusFilterChange,
  limit,
  onLimitChange,
}: OrdersPanelProps) {
  return (
    <article className="dashboard-panel">
      <div className="dashboard-products-header">
        <div>
          <h2>Pedidos</h2>
          <p className="dashboard-products-subtitle">
            Lista de pedidos baseada no payload retornado pela API.
          </p>
        </div>

        <div className="dashboard-products-actions orders-filters">
          <div className="dashboard-filter-group orders-status-filter">
            <select
              className="orders-status-select"
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(event.target.value as OrderStatusFilter)
              }
              aria-label="Filtrar pedidos por status"
            >
              <option value="all">Todos os status</option>
              <option value="payment_pending">payment_pending</option>
              <option value="paid_awaiting_delivery">
                paid_awaiting_delivery
              </option>
              <option value="delivered">delivered</option>
              <option value="customer_confirmed">customer_confirmed</option>
              <option value="customer_cancelled">customer_cancelled</option>
              <option value="business_cancelled">business_cancelled</option>
            </select>
          </div>

          <div className="field field-small orders-limit-field">
            <label htmlFor="orders-limit">Limite</label>
            <div className="orders-limit-select-wrap">
              <select
                id="orders-limit"
                className="orders-limit-select"
                value={limit}
                onChange={(event) => onLimitChange(Number(event.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-secondary-button"
            onClick={onReloadOrders}
            disabled={isOrdersLoading}
          >
            {isOrdersLoading ? "Atualizando..." : "Atualizar lista"}
          </button>
        </div>
      </div>

      {ordersError ? (
        <div className="dashboard-products-feedback dashboard-products-feedback-error">
          <p>{ordersError}</p>
        </div>
      ) : null}

      {!ordersError && isOrdersLoading ? (
        <div className="dashboard-products-feedback">
          <p>Carregando pedidos...</p>
        </div>
      ) : null}

      {!ordersError && !isOrdersLoading && !orders.length ? (
        <div className="dashboard-products-feedback">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : null}

      {orders.length ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="orders-card">
              <div className="orders-card-top">
                <div>
                  <h3>Pedido {order.clientOrderId}</h3>
                </div>
                <span className="orders-status">{order.status}</span>
              </div>

              <dl className="orders-meta">
                <div>
                  <dt>Cliente</dt>
                  <dd>{order.userName?.trim() || order.userId}</dd>
                </div>
                <div>
                  <dt>Hora do pedido</dt>
                  <dd>{formatOrderTime(order.createdAt)}</dd>
                </div>
                <div>
                  <dt>Método de pagamento</dt>
                  <dd>{order.paymentMethod}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatPrice(order.totalPrice.amount)}</dd>
                </div>
              </dl>

              <div className="orders-items">
                <h4>Itens</h4>
                <div className="orders-items-list">
                  {order.items.map((item) => (
                    <article
                      key={`${order.id}-${item.productId}-${item.name}`}
                      className="orders-item"
                    >
                      <p className="orders-item-title">{item.name}</p>
                      <dl>
                        <div>
                          <dt>Quantidade</dt>
                          <dd>{item.quantity}</dd>
                        </div>
                        <div>
                          <dt>Unitário</dt>
                          <dd>{formatPrice(item.unitPrice.amount)}</dd>
                        </div>
                        <div>
                          <dt>Subtotal</dt>
                          <dd>{formatPrice(item.subtotal.amount)}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </div>

              <dl className="orders-notes">
                <div>
                  <dt>Observações</dt>
                  <dd>{order.observations ?? "-"}</dd>
                </div>
                <div>
                  <dt>Última atualização</dt>
                  <dd>{formatOrderTimestamp(order.updatedAt)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : null}
    </article>
  );
}
