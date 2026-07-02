import { randomUUID } from "node:crypto";
import { requireText, validateEmail } from "../utils/validators.js";

export class CustomerService {
  constructor(store) {
    this.store = store;
  }

  async createCustomer(input) {
    return this.store.update((data) => {
      const name = requireText(input.name, "nome");
      const email = validateEmail(input.email);
      const phone = requireText(input.phone, "telefone");

      const duplicated = data.customers.some((customer) => customer.email === email);

      if (duplicated) {
        throw new Error(`Cliente com email ${email} ja existe.`);
      }

      const customer = {
        id: randomUUID(),
        name,
        email,
        phone,
        createdAt: new Date().toISOString()
      };

      data.customers.push(customer);
      return customer;
    });
  }

  async listCustomers(searchTerm = "") {
    const data = await this.store.load();
    const search = String(searchTerm).trim().toLowerCase();
    const customers = [];

    for (const customer of data.customers) {
      const matches =
        !search ||
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.toLowerCase().includes(search);

      if (matches) {
        customers.push(customer);
      }
    }

    return customers.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findByEmail(email) {
    const data = await this.store.load();
    const normalized = String(email).trim().toLowerCase();
    return data.customers.find((customer) => customer.email === normalized) ?? null;
  }

  async findById(id) {
    const data = await this.store.load();
    return data.customers.find((customer) => customer.id === id) ?? null;
  }
}
