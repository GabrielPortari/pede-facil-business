import { useState } from "react";
import type { FormEvent } from "react";
import {
  DashboardOperations,
  ProductModal,
  PromotionModal,
} from "../components";
import { useBusinessProducts } from "../hooks/useBusinessProducts";
import type { ProductAvailabilityFilter } from "../hooks/useBusinessProducts";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { usePromotedProducts } from "../hooks/usePromotedProducts";
import { useProductsWithoutPromotion } from "../hooks/useProductsWithoutPromotion";
import { useBusinessOrders } from "../hooks/useBusinessOrders";
import { updateBusinessOrderStatusRequest } from "../services/orderService";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useUpdateProductPromotion } from "../hooks/useUpdateProductPromotion";
import type {
  BusinessProduct,
  PromotedProduct,
  PromotionType,
  UpdateProductPayload,
} from "../types/product.type";
import {
  OrderStatus,
  OrderStatusFilterValue,
  type OrderStatusFilter,
} from "../types/order.type";
import "./DashboardPage.css";

const OPERATIONAL_ORDER_STATUSES = new Set<OrderStatus>([
  OrderStatus.PaymentPending,
  OrderStatus.PaidAwaitingDelivery,
  OrderStatus.CustomerDeclined,
]);

const CANCELLED_ORDER_STATUSES = new Set<OrderStatus>([
  OrderStatus.CustomerCancelled,
  OrderStatus.BusinessCancelled,
]);

function getTimestampInMs(value: {
  _seconds?: number;
  _nanoseconds?: number;
}): number {
  const seconds = value?._seconds;
  const nanoseconds = value?._nanoseconds ?? 0;

  if (typeof seconds !== "number" || !Number.isFinite(seconds)) {
    return 0;
  }

  return seconds * 1000 + Math.floor(nanoseconds / 1000000);
}

function isSameCalendarDay(date: Date, targetDate: Date): boolean {
  return (
    date.getDate() === targetDate.getDate() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  );
}

function formatPriceInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const normalizedDigits = digits.replace(/^0+(?=\d)/, "");
  const integerRaw = normalizedDigits.slice(0, -2);
  const integerPart = integerRaw.replace(/^0+(?=\d)/, "") || "0";
  const decimalPart = normalizedDigits.slice(-2).padStart(2, "0");

  return `R$ ${integerPart},${decimalPart}`;
}

function parsePriceToCents(formattedPrice: string): number {
  const digits = formattedPrice.replace(/\D/g, "");

  if (!digits) {
    return Number.NaN;
  }

  return Number(digits);
}

function formatPercentageInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "");

  if (!digits) {
    return "0";
  }

  const normalizedDigits = digits.replace(/^0+(?=\d)/, "");

  if (!normalizedDigits) {
    return "0";
  }

  const value = Math.min(100, Math.max(0, Number(normalizedDigits)));
  return String(value);
}

function formatCentsToBrl(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100);
}

function mapPromotedProductToItem(product: PromotedProduct) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceInCents: product.price.amount,
    promotionType: product.promotion.type,
    promotionPercentage: product.promotion.percentage,
    promotionAmountInCents: product.promotion.amount?.amount,
  };
}

function getPromotionalPriceInCents(product: {
  priceInCents: number;
  promotionType?: PromotionType;
  promotionPercentage?: number;
  promotionAmountInCents?: number;
}): number | null {
  if (product.promotionType === "percentage") {
    if (product.promotionPercentage === undefined) {
      return null;
    }

    const discount = Math.round(
      (product.priceInCents * product.promotionPercentage) / 100,
    );

    return Math.max(0, product.priceInCents - discount);
  }

  if (product.promotionType === "fixed") {
    if (product.promotionAmountInCents === undefined) {
      return null;
    }

    return Math.max(0, product.priceInCents - product.promotionAmountInCents);
  }

  return null;
}

function mapBusinessProductToPromotionOption(product: BusinessProduct) {
  const hasAvailableStock = product.useStock
    ? Boolean(product.available && (product.stock ?? 0) > 0)
    : Boolean(product.available);

  return {
    id: product.id,
    name: product.name,
    priceInCents: product.price.amount,
    available: hasAvailableStock,
    useStock: Boolean(product.useStock),
    stock: product.stock ?? 0,
    description: product.description,
    imageUrl: product.imageUrl,
  };
}

function formatPriceToInput(amountInCents: number): string {
  const integerPart = Math.floor(amountInCents / 100);
  const decimalPart = Math.abs(amountInCents % 100)
    .toString()
    .padStart(2, "0");

  return `R$ ${integerPart},${decimalPart}`;
}

export default function DashboardPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingPromotionProductId, setEditingPromotionProductId] = useState<
    string | null
  >(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [removingPromotionProductId, setRemovingPromotionProductId] = useState<
    string | null
  >(null);
  const [removePromotionError, setRemovePromotionError] = useState("");
  const [productFilter, setProductFilter] =
    useState<ProductAvailabilityFilter>("all");
  const [promotionFilter, setPromotionFilter] = useState<"with" | "without">(
    "with",
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);
  const [useStock, setUseStock] = useState(false);
  const [stock, setStock] = useState("0");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [promotionProductId, setPromotionProductId] = useState("");
  const [promotionType, setPromotionType] =
    useState<PromotionType>("percentage");
  const [promotionPercentage, setPromotionPercentage] = useState("0");
  const [promotionAmount, setPromotionAmount] = useState("R$ 0,00");
  const [usePromotionStock, setUsePromotionStock] = useState(false);
  const [promotionStock, setPromotionStock] = useState("");
  const [isPromotionSubmitted, setIsPromotionSubmitted] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>(
    OrderStatusFilterValue.All,
  );
  const [orderLimit, setOrderLimit] = useState(50);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [orderStatusUpdateError, setOrderStatusUpdateError] = useState("");

  const {
    products,
    isLoading: isProductsLoading,
    errorMessage: productsError,
    reloadProducts,
  } = useBusinessProducts(productFilter);

  const {
    promotedProducts,
    isLoading: isPromotionsLoading,
    errorMessage: promotionsError,
    reloadPromotedProducts,
  } = usePromotedProducts();

  const {
    orders,
    isLoading: isOrdersLoading,
    errorMessage: ordersError,
    reloadOrders,
  } = useBusinessOrders(OrderStatusFilterValue.All, orderLimit);

  const {
    products: productsWithoutPromotion,
    isLoading: isProductsWithoutPromotionLoading,
    errorMessage: productsWithoutPromotionError,
    reloadProducts: reloadProductsWithoutPromotion,
  } = useProductsWithoutPromotion();

  const {
    isLoading,
    serverError,
    successMessage,
    submitProduct,
    setSuccessMessage,
  } = useCreateProduct();

  const {
    isLoading: isUpdateLoading,
    serverError: updateServerError,
    successMessage: updateSuccessMessage,
    submitUpdate,
    setSuccessMessage: setUpdateSuccessMessage,
  } = useUpdateProduct();

  const {
    isLoading: isDeleteLoading,
    serverError: deleteServerError,
    submitDelete,
    setServerError: setDeleteServerError,
  } = useDeleteProduct();

  const {
    isLoading: isPromotionLoading,
    serverError: promotionServerError,
    successMessage: promotionSuccessMessage,
    submitPromotion,
    setSuccessMessage: setPromotionSuccessMessage,
  } = useUpdateProductPromotion();

  const promotedProductItems = promotedProducts.map(mapPromotedProductToItem);
  const promotedProductMap = new Map(
    promotedProductItems.map((product) => [product.id, product]),
  );
  const promotionProducts = products.map(mapBusinessProductToPromotionOption);
  const dashboardProductItems = promotionProducts.map((product) => {
    const promotedProduct = promotedProductMap.get(product.id);

    return {
      ...product,
      hasActivePromotion: Boolean(promotedProduct),
      promotionType: promotedProduct?.promotionType,
      promotionPercentage: promotedProduct?.promotionPercentage,
      promotionAmountInCents: promotedProduct?.promotionAmountInCents,
      promotedPriceInCents: promotedProduct
        ? getPromotionalPriceInCents({
            priceInCents: product.priceInCents,
            promotionType: promotedProduct.promotionType,
            promotionPercentage: promotedProduct.promotionPercentage,
            promotionAmountInCents: promotedProduct.promotionAmountInCents,
          })
        : null,
    };
  });
  const withoutPromotionItems = productsWithoutPromotion.map((p) => ({
    ...mapBusinessProductToPromotionOption(p),
    hasActivePromotion: false,
  }));
  const overviewStats = {
    totalProducts: dashboardProductItems.length,
    availableProducts: dashboardProductItems.filter(
      (product) => product.available,
    ).length,
    unavailableProducts: dashboardProductItems.filter(
      (product) => !product.available,
    ).length,
    promotedProducts: promotedProductItems.length,
    productsWithoutPromotion: withoutPromotionItems.length,
    lowStockProducts: dashboardProductItems.filter(
      (product) => product.useStock && product.stock > 0 && product.stock <= 5,
    ).length,
    outOfStockProducts: dashboardProductItems.filter(
      (product) => product.useStock && product.stock === 0,
    ).length,
    noStockControlProducts: dashboardProductItems.filter(
      (product) => !product.useStock,
    ).length,
  };

  const now = new Date();
  const totalOrders = orders.length;
  const ordersToday = orders.filter((order) => {
    const timestampInMs = getTimestampInMs(order.createdAt);

    return timestampInMs
      ? isSameCalendarDay(new Date(timestampInMs), now)
      : false;
  }).length;
  const operationalOrders = orders.filter((order) =>
    OPERATIONAL_ORDER_STATUSES.has(order.status),
  ).length;
  const pendingPaymentOrders = orders.filter(
    (order) => order.status === OrderStatus.PaymentPending,
  ).length;
  const cancelledOrders = orders.filter((order) =>
    CANCELLED_ORDER_STATUSES.has(order.status),
  ).length;
  const finalizedOrders = orders.filter(
    (order) => order.status === OrderStatus.CustomerConfirmed,
  ).length;
  const revenueOrders = orders.filter(
    (order) =>
      order.status !== OrderStatus.PaymentPending &&
      !CANCELLED_ORDER_STATUSES.has(order.status),
  );
  const revenueInCents = revenueOrders.reduce(
    (total, order) => total + order.totalPrice.amount,
    0,
  );
  const averageTicketInCents = revenueOrders.length
    ? Math.round(revenueInCents / revenueOrders.length)
    : 0;

  const orderOverviewStats = {
    totalOrders,
    ordersToday,
    operationalOrders,
    finalizedOrders,
    cancelledOrders,
    pendingPaymentOrders,
    revenueInCents,
    averageTicketInCents,
  };

  const isEditingProduct = Boolean(editingProductId);

  const parsedPrice = parsePriceToCents(price);
  const parsedStock = Number(stock);
  const parsedPromotionPercentage = Number(promotionPercentage);
  const parsedPromotionAmount = parsePriceToCents(promotionAmount);
  const parsedPromotionStock = Number(promotionStock);

  const isProductNameValid = Boolean(name.trim());
  const isProductPriceValid = Number.isInteger(parsedPrice) && parsedPrice >= 0;
  const isProductStockValid =
    !useStock || (Number.isInteger(parsedStock) && parsedStock >= 0);
  const isProductFormValid =
    isProductNameValid && isProductPriceValid && isProductStockValid;

  const selectedPromotionProduct = promotionProducts.find(
    (product) => product.id === promotionProductId,
  );
  const hasRealStockControl = Boolean(selectedPromotionProduct?.useStock);
  const isPromotionProductSelected = Boolean(selectedPromotionProduct);

  const isPromotionPercentageValid =
    Number.isInteger(parsedPromotionPercentage) &&
    parsedPromotionPercentage >= 0 &&
    parsedPromotionPercentage <= 100;

  const isPromotionAmountValid =
    Number.isInteger(parsedPromotionAmount) &&
    parsedPromotionAmount >= 0 &&
    (selectedPromotionProduct
      ? parsedPromotionAmount <= selectedPromotionProduct.priceInCents
      : false);

  const isPromotionStockValid =
    !usePromotionStock ||
    (Number.isInteger(parsedPromotionStock) &&
      parsedPromotionStock >= 0 &&
      (!hasRealStockControl ||
        parsedPromotionStock <= (selectedPromotionProduct?.stock ?? 0)));

  const isPromotionDiscountValid =
    promotionType === "percentage"
      ? isPromotionPercentageValid
      : isPromotionAmountValid;

  const isPromotionFormValid =
    isPromotionProductSelected &&
    isPromotionDiscountValid &&
    isPromotionStockValid;

  const nameError =
    isSubmitted && !name.trim() ? "Informe o nome do produto." : "";
  const priceError =
    isSubmitted && (!Number.isInteger(parsedPrice) || parsedPrice < 0)
      ? "Informe um preço válido no formato BRL."
      : "";
  const stockError =
    isSubmitted &&
    useStock &&
    (!Number.isInteger(parsedStock) || parsedStock < 0)
      ? "Informe um estoque válido."
      : "";

  const promotionProductIdError =
    isPromotionSubmitted && !promotionProductId.trim()
      ? "Selecione um produto."
      : "";

  const promotionPercentageError =
    isPromotionSubmitted &&
    promotionType === "percentage" &&
    (!Number.isInteger(parsedPromotionPercentage) ||
      parsedPromotionPercentage < 0 ||
      parsedPromotionPercentage > 100)
      ? "Informe uma porcentagem entre 0 e 100."
      : "";

  const promotionAmountError =
    isPromotionSubmitted &&
    promotionType === "fixed" &&
    (!Number.isInteger(parsedPromotionAmount) ||
      parsedPromotionAmount < 0 ||
      (selectedPromotionProduct
        ? parsedPromotionAmount > selectedPromotionProduct.priceInCents
        : false))
      ? "O valor fixo não pode ser maior que o preço original do produto."
      : "";

  const promotionStockError =
    isPromotionSubmitted &&
    usePromotionStock &&
    (!Number.isInteger(parsedPromotionStock) ||
      parsedPromotionStock < 0 ||
      (hasRealStockControl &&
        parsedPromotionStock > (selectedPromotionProduct?.stock ?? 0)))
      ? hasRealStockControl
        ? "O estoque promocional não pode ser maior que o estoque real do produto."
        : "Informe um estoque promocional válido."
      : "";

  const discountedPriceInCents = selectedPromotionProduct
    ? promotionType === "percentage" && !promotionPercentageError
      ? Math.max(
          0,
          selectedPromotionProduct.priceInCents -
            Math.round(
              (selectedPromotionProduct.priceInCents *
                parsedPromotionPercentage) /
                100,
            ),
        )
      : promotionType === "fixed" && !promotionAmountError
        ? Math.max(
            0,
            selectedPromotionProduct.priceInCents - parsedPromotionAmount,
          )
        : null
    : null;

  function resetProductForm(): void {
    setName("");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setAvailable(true);
    setUseStock(false);
    setStock("0");
    setIsSubmitted(false);
    setEditingProductId(null);
    setSuccessMessage("");
    setUpdateSuccessMessage("");
  }

  function handleApplyPromotion(productId?: string): void {
    setEditingPromotionProductId(null);
    setPromotionProductId(productId ?? "");
    setPromotionType("percentage");
    setPromotionPercentage("0");
    setPromotionAmount("R$ 0,00");
    setUsePromotionStock(false);
    setPromotionStock("");
    setIsPromotionSubmitted(false);
    setIsPromotionModalOpen(true);
  }

  function handleEditPromotion(productId: string): void {
    const promotedProduct = promotedProducts.find(
      (item) => item.id === productId,
    );

    if (!promotedProduct) {
      return;
    }

    const promotional = promotedProduct.promotion;

    setEditingPromotionProductId(productId);
    setPromotionProductId(productId);
    setPromotionType(promotional.type ?? "percentage");

    if (
      promotional.type === "percentage" &&
      promotional.percentage !== undefined
    ) {
      setPromotionPercentage(String(promotional.percentage));
      setPromotionAmount("R$ 0,00");
    } else if (promotional.type === "fixed" && promotional.amount) {
      setPromotionAmount(formatPriceToInput(promotional.amount.amount));
      setPromotionPercentage("0");
    }

    setUsePromotionStock(Boolean(promotional.usePromotionStock));
    setPromotionStock(String(promotional.promotionStock ?? ""));
    setIsPromotionSubmitted(false);
    setIsPromotionModalOpen(true);
  }

  async function handleRemovePromotion(productId: string): Promise<void> {
    const product = products.find((item) => item.id === productId);
    const confirmed = window.confirm(
      `Remover a promoção do produto "${product?.name ?? productId}"?`,
    );

    if (!confirmed) {
      return;
    }

    setRemovePromotionError("");
    setRemovingPromotionProductId(productId);

    const result = await submitPromotion(productId, { active: false });

    if (result.ok) {
      await Promise.all([
        reloadPromotedProducts(),
        reloadProductsWithoutPromotion(),
      ]);
    } else {
      setRemovePromotionError("Não foi possível remover a promoção.");
    }

    setRemovingPromotionProductId(null);
  }

  function handleOpenCreateProductModal(): void {
    resetProductForm();
    setIsProductModalOpen(true);
  }

  function handleOpenEditProductModal(productId: string): void {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description ?? "");
    setPrice(formatPriceToInput(product.price.amount));
    setImageUrl(product.imageUrl ?? "");
    setAvailable(Boolean(product.available));
    setUseStock(Boolean(product.useStock));
    setStock(String(product.stock ?? 0));
    setIsSubmitted(false);
    setSuccessMessage("");
    setUpdateSuccessMessage("");
    setIsProductModalOpen(true);
  }

  function handleCloseProductModal(): void {
    setIsProductModalOpen(false);
    resetProductForm();
  }

  function handleClosePromotionModal(): void {
    setIsPromotionModalOpen(false);
    setEditingPromotionProductId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);
    setSuccessMessage("");
    setUpdateSuccessMessage("");

    if (
      nameError ||
      priceError ||
      stockError ||
      isLoading ||
      isUpdateLoading ||
      !isProductFormValid
    ) {
      return;
    }

    const payload: UpdateProductPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: {
        amount: parsedPrice,
        currency: "BRL",
      },
      imageUrl: imageUrl.trim() || undefined,
      available,
      useStock,
      stock: useStock ? parsedStock : undefined,
    };

    if (editingProductId) {
      const result = await submitUpdate(editingProductId, payload);

      if (result.ok) {
        handleCloseProductModal();
        await reloadProducts();
      }

      return;
    }

    const result = await submitProduct({
      ...payload,
    });

    if (result.ok) {
      handleCloseProductModal();
      await reloadProducts();
    }
  }

  async function handleDeleteProduct(productId: string): Promise<void> {
    setDeleteServerError("");

    const product = products.find((item) => item.id === productId);
    const confirmed = window.confirm(
      `Excluir o produto "${product?.name ?? productId}"? Esta ação não poderá ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingProductId(productId);
    const result = await submitDelete(productId);

    if (result.ok) {
      if (editingProductId === productId) {
        handleCloseProductModal();
      }

      await reloadProducts();
    }

    setDeletingProductId(null);
  }

  async function handlePromotionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPromotionSubmitted(true);
    setPromotionSuccessMessage("");

    const hasPromotionErrors = Boolean(
      promotionProductIdError ||
      promotionPercentageError ||
      promotionAmountError ||
      promotionStockError,
    );

    if (hasPromotionErrors || isPromotionLoading || !isPromotionFormValid) {
      return;
    }

    const payload = {
      active: true,
      type: promotionType,
      percentage:
        promotionType === "percentage" ? parsedPromotionPercentage : undefined,
      amount:
        promotionType === "fixed"
          ? { amount: parsedPromotionAmount, currency: "BRL" }
          : undefined,
      usePromotionStock,
      promotionStock: usePromotionStock ? parsedPromotionStock : undefined,
    };

    const result = await submitPromotion(promotionProductId.trim(), payload);

    if (result.ok) {
      setPromotionProductId("");
      setPromotionType("percentage");
      setPromotionPercentage("0");
      setPromotionAmount("R$ 0,00");
      setUsePromotionStock(false);
      setPromotionStock("");
      setIsPromotionSubmitted(false);
      setIsPromotionModalOpen(false);
      await Promise.all([
        reloadProducts(),
        reloadPromotedProducts(),
        reloadProductsWithoutPromotion(),
      ]);
    }
  }

  async function handleUpdateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<void> {
    try {
      setUpdatingOrderId(orderId);
      setOrderStatusUpdateError("");

      await updateBusinessOrderStatusRequest(orderId, {
        status,
      });

      await reloadOrders();
    } catch {
      setOrderStatusUpdateError(
        "Não foi possível atualizar o status do pedido.",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  return (
    <main className="dashboard-page">
      <DashboardOperations
        products={dashboardProductItems}
        isProductsLoading={isProductsLoading}
        productsError={productsError}
        deleteError={deleteServerError}
        deletingProductId={isDeleteLoading ? deletingProductId : null}
        onReloadProducts={() => {
          void reloadProducts();
        }}
        onOpenProductModal={handleOpenCreateProductModal}
        onEditProduct={handleOpenEditProductModal}
        onDeleteProduct={(productId) => {
          void handleDeleteProduct(productId);
        }}
        onOpenPromotionModal={handleApplyPromotion}
        formatPrice={formatCentsToBrl}
        productFilter={productFilter}
        onProductFilterChange={setProductFilter}
        promotedProducts={promotedProductItems}
        isPromotionsLoading={isPromotionsLoading}
        promotionsError={promotionsError}
        removePromotionError={removePromotionError}
        removingPromotionProductId={removingPromotionProductId}
        onReloadPromotedProducts={() => {
          void reloadPromotedProducts();
        }}
        onRemovePromotion={(productId) => {
          void handleRemovePromotion(productId);
        }}
        onEditPromotion={handleEditPromotion}
        productsWithoutPromotion={withoutPromotionItems}
        isProductsWithoutPromotionLoading={isProductsWithoutPromotionLoading}
        productsWithoutPromotionError={productsWithoutPromotionError}
        onReloadProductsWithoutPromotion={() => {
          void reloadProductsWithoutPromotion();
        }}
        onApplyPromotion={(productId) => handleApplyPromotion(productId)}
        promotionFilter={promotionFilter}
        onPromotionFilterChange={setPromotionFilter}
        orders={orders}
        isOrdersLoading={isOrdersLoading}
        ordersError={ordersError}
        onReloadOrders={() => {
          setOrderStatusUpdateError("");
          void reloadOrders();
        }}
        orderStatusUpdateError={orderStatusUpdateError}
        updatingOrderId={updatingOrderId}
        onUpdateOrderStatus={(orderId, status) => {
          void handleUpdateOrderStatus(orderId, status);
        }}
        orderStatusFilter={orderStatusFilter}
        onOrderStatusFilterChange={setOrderStatusFilter}
        orderLimit={orderLimit}
        onOrderLimitChange={(value) => {
          if (!Number.isFinite(value)) {
            return;
          }

          const normalizedValue = Math.max(1, Math.min(100, Math.trunc(value)));
          setOrderLimit(normalizedValue);
        }}
        overviewStats={overviewStats}
        orderOverviewStats={orderOverviewStats}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        mode={isEditingProduct ? "edit" : "create"}
        isLoading={isEditingProduct ? isUpdateLoading : isLoading}
        serverError={isEditingProduct ? updateServerError : serverError}
        successMessage={
          isEditingProduct ? updateSuccessMessage : successMessage
        }
        name={name}
        description={description}
        price={price}
        imageUrl={imageUrl}
        available={available}
        useStock={useStock}
        stock={stock}
        nameError={nameError}
        priceError={priceError}
        stockError={stockError}
        isProductFormValid={isProductFormValid}
        onClose={handleCloseProductModal}
        onSubmit={handleSubmit}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onPriceChange={(value) => setPrice(formatPriceInput(value))}
        onImageUrlChange={setImageUrl}
        onAvailableChange={setAvailable}
        onUseStockChange={(value) => {
          setUseStock(value);

          if (value && !stock.trim()) {
            setStock("0");
          }
        }}
        onStockChange={setStock}
      />

      <PromotionModal
        isOpen={isPromotionModalOpen}
        isLoading={isPromotionLoading}
        isEditing={Boolean(editingPromotionProductId)}
        serverError={promotionServerError}
        successMessage={promotionSuccessMessage}
        promotionProductId={promotionProductId}
        promotionType={promotionType}
        promotionPercentage={promotionPercentage}
        promotionAmount={promotionAmount}
        usePromotionStock={usePromotionStock}
        promotionStock={promotionStock}
        promotionProductIdError={promotionProductIdError}
        promotionPercentageError={promotionPercentageError}
        promotionAmountError={promotionAmountError}
        promotionStockError={promotionStockError}
        hasRealStockControl={hasRealStockControl}
        selectedPromotionProduct={selectedPromotionProduct}
        discountedPriceInCents={discountedPriceInCents}
        isPromotionFormValid={isPromotionFormValid}
        products={promotionProducts}
        onClose={handleClosePromotionModal}
        onSubmit={handlePromotionSubmit}
        onProductChange={setPromotionProductId}
        onTypeChange={(value) => {
          setPromotionType(value);
          setPromotionPercentage("0");
          setPromotionAmount("R$ 0,00");
        }}
        onPercentageChange={(value) =>
          setPromotionPercentage(formatPercentageInput(value))
        }
        onAmountChange={(value) => setPromotionAmount(formatPriceInput(value))}
        onUsePromotionStockChange={setUsePromotionStock}
        onPromotionStockChange={setPromotionStock}
        formatCentsToBrl={formatCentsToBrl}
      />
    </main>
  );
}
