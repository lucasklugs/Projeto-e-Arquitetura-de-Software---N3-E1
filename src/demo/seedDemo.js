import { printTitle } from "../utils/formatters.js";

const DEMO_PRODUCTS = [
  { name: "Caderno universitario", sku: "CAD-001", category: "Papelaria", price: 24.9, quantity: 80 },
  { name: "Caneta azul", sku: "CAN-AZ", category: "Papelaria", price: 2.5, quantity: 300 },
  { name: "Mochila executiva", sku: "MOC-EX", category: "Acessorios", price: 149.9, quantity: 25 },
  { name: "Calculadora cientifica", sku: "CAL-CI", category: "Eletronicos", price: 89.9, quantity: 18 },
  { name: "Garrafa termica", sku: "GAR-TR", category: "Utilidades", price: 59.9, quantity: 40 }
];

const DEMO_CUSTOMERS = [
  { name: "Ana Ribeiro", email: "ana.ribeiro@example.com", phone: "(11) 99999-1001" },
  { name: "Bruno Lima", email: "bruno.lima@example.com", phone: "(21) 98888-2002" },
  { name: "Carla Mendes", email: "carla.mendes@example.com", phone: "(31) 97777-3003" }
];

export async function seedDemoData({ inventoryService, customerService, orderService }) {
  printTitle("Gerando dados de demonstracao");
  let createdProducts = 0;
  let createdCustomers = 0;

  for (const product of DEMO_PRODUCTS) {
    try {
      await inventoryService.createProduct(product);
      createdProducts += 1;
    } catch (error) {
      if (!error.message.includes("ja existe")) {
        throw error;
      }
    }
  }

  for (const customer of DEMO_CUSTOMERS) {
    try {
      await customerService.createCustomer(customer);
      createdCustomers += 1;
    } catch (error) {
      if (!error.message.includes("ja existe")) {
        throw error;
      }
    }
  }

  const existingOrders = await orderService.listOrders();

  if (existingOrders.length === 0) {
    const firstOrder = await orderService.createOrder({
      customerEmail: "ana.ribeiro@example.com",
      items: [
        { sku: "CAD-001", quantity: 2 },
        { sku: "CAN-AZ", quantity: 5 }
      ]
    });
    const secondOrder = await orderService.createOrder({
      customerEmail: "bruno.lima@example.com",
      items: [
        { sku: "MOC-EX", quantity: 1 },
        { sku: "GAR-TR", quantity: 2 }
      ]
    });

    await orderService.updateStatus(firstOrder.id, "pago");
    await orderService.updateStatus(secondOrder.id, "pago");
  }

  console.log(`Produtos criados: ${createdProducts}`);
  console.log(`Clientes criados: ${createdCustomers}`);
  console.log("Dados salvos em data/database.json");
}
