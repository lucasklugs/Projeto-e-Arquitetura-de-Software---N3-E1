import { randomUUID } from "node:crypto";
import { formatCurrency } from "../utils/formatters.js";
import { parseNonNegativeInteger, requireChoice, requireText } from "../utils/validators.js";

const ORDER_STATUS = ["aberto", "pago", "cancelado"];

export class OrderService {
  constructor(store) {
    this.store = store;
  }

  async createOrder(input) {
    return this.store.update((data) => {
      const customerEmail = requireText(input.customerEmail, "email do cliente").toLowerCase();
      const customer = data.customers.find((item) => item.email === customerEmail);

      if (!customer) {
        throw new Error(`Cliente ${customerEmail} nao encontrado.`);
      }

      const requestedItems = Array.isArray(input.items) ? input.items : [];

      if (requestedItems.length === 0) {
        throw new Error("Pedido precisa ter pelo menos um item.");
      }

      const items = [];
      let total = 0;

      for (const requestedItem of requestedItems) {
        const sku = requireText(requestedItem.sku, "sku").toUpperCase();
        const quantity = parseNonNegativeInteger(requestedItem.quantity, "quantidade");
        const product = data.products.find((item) => item.sku === sku && item.active);

        if (quantity === 0) {
          throw new Error("Quantidade do item deve ser maior que zero.");
        }

        if (!product) {
          throw new Error(`Produto ativo ${sku} nao encontrado.`);
        }

        if (product.quantity < quantity) {
          throw new Error(`Estoque insuficiente para ${product.name}. Disponivel: ${product.quantity}.`);
        }

        product.quantity -= quantity;

        const subtotal = quantity * product.price;
        total += subtotal;
        items.push({
          sku: product.sku,
          name: product.name,
          quantity,
          unitPrice: product.price,
          subtotal
        });
      }

      const order = {
        id: randomUUID(),
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items,
        total,
        status: "aberto",
        createdAt: new Date().toISOString()
      };

      data.orders.push(order);
      return order;
    });
  }

  async listOrders(filters = {}) {
    const data = await this.store.load();
    const status = filters.status ? requireChoice(filters.status, ORDER_STATUS, "status") : "";
    const customer = String(filters.customer ?? "").trim().toLowerCase();
    const orders = [];

    for (const order of data.orders) {
      const matchesStatus = !status || order.status === status;
      const matchesCustomer =
        !customer ||
        order.customerName.toLowerCase().includes(customer) ||
        order.customerEmail.toLowerCase().includes(customer);

      if (matchesStatus && matchesCustomer) {
        orders.push(order);
      }
    }

    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async updateStatus(orderId, status) {
    return this.store.update((data) => {
      const parsedStatus = requireChoice(status, ORDER_STATUS, "status");
      const order = data.orders.find((item) => item.id === orderId);

      if (!order) {
        throw new Error(`Pedido ${orderId} nao encontrado.`);
      }

      if (order.status === "cancelado") {
        throw new Error("Pedido cancelado nao pode ter status alterado.");
      }

      if (parsedStatus === "cancelado") {
        this.restoreStock(data.products, order.items);
      }

      order.status = parsedStatus;
      order.updatedAt = new Date().toISOString();
      return order;
    });
  }

  restoreStock(products, orderItems) {
    for (const orderItem of orderItems) {
      const product = products.find((item) => item.sku === orderItem.sku);

      if (product) {
        product.quantity += orderItem.quantity;
        product.updatedAt = new Date().toISOString();
      }
    }
  }

  async buildSalesReport() {
    const data = await this.store.load();
    const report = {
      totalOrders: data.orders.length,
      paidOrders: 0,
      openOrders: 0,
      canceledOrders: 0,
      grossRevenue: 0,
      bestSellingProducts: []
    };
    const productMap = new Map();

    for (const order of data.orders) {
      if (order.status === "pago") {
        report.paidOrders += 1;
        report.grossRevenue += order.total;
      } else if (order.status === "aberto") {
        report.openOrders += 1;
      } else if (order.status === "cancelado") {
        report.canceledOrders += 1;
      }

      if (order.status !== "cancelado") {
        for (const item of order.items) {
          const current = productMap.get(item.sku) ?? {
            sku: item.sku,
            name: item.name,
            quantity: 0,
            revenue: 0
          };

          current.quantity += item.quantity;
          current.revenue += item.subtotal;
          productMap.set(item.sku, current);
        }
      }
    }

    report.bestSellingProducts = [...productMap.values()]
      .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
      .slice(0, 5)
      .map((product) => ({
        ...product,
        revenueLabel: formatCurrency(product.revenue)
      }));

    return report;
  }
}
