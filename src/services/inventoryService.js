import { randomUUID } from "node:crypto";
import { parseNonNegativeInteger, parsePositiveNumber, requireText } from "../utils/validators.js";
import { toSlug } from "../utils/formatters.js";

export class InventoryService {
  constructor(store) {
    this.store = store;
  }

  async createProduct(input) {
    return this.store.update((data) => {
      const name = requireText(input.name, "nome");
      const sku = input.sku ? requireText(input.sku, "sku").toUpperCase() : toSlug(name).toUpperCase();
      const category = requireText(input.category, "categoria");
      const price = parsePositiveNumber(input.price, "preco");
      const quantity = parseNonNegativeInteger(input.quantity, "quantidade");

      const exists = data.products.some((product) => product.sku === sku);

      if (exists) {
        throw new Error(`Produto com SKU ${sku} ja existe.`);
      }

      const product = {
        id: randomUUID(),
        sku,
        name,
        category,
        price,
        quantity,
        active: true,
        createdAt: new Date().toISOString()
      };

      data.products.push(product);
      return product;
    });
  }

  async listProducts(filters = {}) {
    const data = await this.store.load();
    const search = String(filters.search ?? "").trim().toLowerCase();
    const onlyActive = filters.onlyActive !== false;
    const lowStockLimit = Number(filters.lowStockLimit ?? 0);
    const products = [];

    for (const product of data.products) {
      const matchesText =
        !search ||
        product.name.toLowerCase().includes(search) ||
        product.sku.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const matchesStatus = !onlyActive || product.active;
      const matchesStock = lowStockLimit <= 0 || product.quantity <= lowStockLimit;

      if (matchesText && matchesStatus && matchesStock) {
        products.push(product);
      }
    }

    return products.sort((a, b) => a.name.localeCompare(b.name));
  }

  async adjustStock(sku, amount, reason) {
    return this.store.update((data) => {
      const product = data.products.find((item) => item.sku === String(sku).toUpperCase());
      const parsedAmount = Number(amount);

      if (!product) {
        throw new Error(`Produto ${sku} nao encontrado.`);
      }

      if (!Number.isInteger(parsedAmount) || parsedAmount === 0) {
        throw new Error("Ajuste de estoque deve ser um inteiro diferente de zero.");
      }

      const nextQuantity = product.quantity + parsedAmount;

      if (nextQuantity < 0) {
        throw new Error("Ajuste deixaria o estoque negativo.");
      }

      product.quantity = nextQuantity;
      product.updatedAt = new Date().toISOString();
      product.lastStockReason = reason ? String(reason).trim() : "ajuste manual";

      return product;
    });
  }

  async findBySku(sku) {
    const data = await this.store.load();
    return data.products.find((product) => product.sku === String(sku).toUpperCase()) ?? null;
  }

  async deactivateProduct(sku) {
    return this.store.update((data) => {
      const product = data.products.find((item) => item.sku === String(sku).toUpperCase());

      if (!product) {
        throw new Error(`Produto ${sku} nao encontrado.`);
      }

      product.active = false;
      product.updatedAt = new Date().toISOString();
      return product;
    });
  }
}
