import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { formatCurrency, formatDate, printTable, printTitle } from "../utils/formatters.js";

export class Menu {
  constructor({ inventoryService, customerService, orderService }) {
    this.inventoryService = inventoryService;
    this.customerService = customerService;
    this.orderService = orderService;
    this.reader = readline.createInterface({ input, output });
  }

  async start() {
    printTitle("Sistema de Estoque e Pedidos");

    let running = true;

    while (running) {
      console.log("\n1. Cadastrar produto");
      console.log("2. Listar produtos");
      console.log("3. Ajustar estoque");
      console.log("4. Cadastrar cliente");
      console.log("5. Listar clientes");
      console.log("6. Criar pedido");
      console.log("7. Listar pedidos");
      console.log("8. Alterar status do pedido");
      console.log("9. Relatorio de vendas");
      console.log("0. Sair");

      const option = await this.ask("Escolha uma opcao: ");

      try {
        if (option === "1") {
          await this.createProduct();
        } else if (option === "2") {
          await this.listProducts();
        } else if (option === "3") {
          await this.adjustStock();
        } else if (option === "4") {
          await this.createCustomer();
        } else if (option === "5") {
          await this.listCustomers();
        } else if (option === "6") {
          await this.createOrder();
        } else if (option === "7") {
          await this.listOrders();
        } else if (option === "8") {
          await this.updateOrderStatus();
        } else if (option === "9") {
          await this.showSalesReport();
        } else if (option === "0") {
          running = false;
        } else {
          console.log("Opcao invalida.");
        }
      } catch (error) {
        console.log(`Erro: ${error.message}`);
      }
    }

    this.reader.close();
  }

  async ask(question) {
    const answer = await this.reader.question(question);
    return answer.trim();
  }

  async createProduct() {
    printTitle("Cadastrar produto");
    const product = await this.inventoryService.createProduct({
      name: await this.ask("Nome: "),
      sku: await this.ask("SKU (opcional): "),
      category: await this.ask("Categoria: "),
      price: await this.ask("Preco: "),
      quantity: await this.ask("Quantidade inicial: ")
    });

    console.log(`Produto cadastrado: ${product.name} (${product.sku})`);
  }

  async listProducts() {
    printTitle("Produtos");
    const search = await this.ask("Buscar por texto (enter para todos): ");
    const lowStock = await this.ask("Limite de estoque baixo (enter para ignorar): ");
    const products = await this.inventoryService.listProducts({
      search,
      lowStockLimit: lowStock ? Number(lowStock) : 0
    });

    if (products.length === 0) {
      console.log("Nenhum produto encontrado.");
      return;
    }

    printTable(
      ["SKU", "Nome", "Categoria", "Preco", "Qtd", "Ativo"],
      products.map((product) => [
        product.sku,
        product.name,
        product.category,
        formatCurrency(product.price),
        product.quantity,
        product.active ? "sim" : "nao"
      ])
    );
  }

  async adjustStock() {
    printTitle("Ajustar estoque");
    const product = await this.inventoryService.adjustStock(
      await this.ask("SKU: "),
      await this.ask("Quantidade (+ entrada, - saida): "),
      await this.ask("Motivo: ")
    );

    console.log(`Novo estoque de ${product.name}: ${product.quantity}`);
  }

  async createCustomer() {
    printTitle("Cadastrar cliente");
    const customer = await this.customerService.createCustomer({
      name: await this.ask("Nome: "),
      email: await this.ask("Email: "),
      phone: await this.ask("Telefone: ")
    });

    console.log(`Cliente cadastrado: ${customer.name}`);
  }

  async listCustomers() {
    printTitle("Clientes");
    const search = await this.ask("Buscar por texto (enter para todos): ");
    const customers = await this.customerService.listCustomers(search);

    if (customers.length === 0) {
      console.log("Nenhum cliente encontrado.");
      return;
    }

    printTable(
      ["Nome", "Email", "Telefone", "Cadastro"],
      customers.map((customer) => [
        customer.name,
        customer.email,
        customer.phone,
        formatDate(customer.createdAt)
      ])
    );
  }

  async createOrder() {
    printTitle("Criar pedido");
    const customerEmail = await this.ask("Email do cliente: ");
    const items = [];
    let adding = true;

    while (adding) {
      const sku = await this.ask("SKU do produto: ");
      const quantity = await this.ask("Quantidade: ");
      items.push({ sku, quantity });

      const more = (await this.ask("Adicionar outro item? (s/n): ")).toLowerCase();
      adding = more === "s" || more === "sim";
    }

    const order = await this.orderService.createOrder({ customerEmail, items });
    console.log(`Pedido criado com total ${formatCurrency(order.total)}.`);
  }

  async listOrders() {
    printTitle("Pedidos");
    const status = await this.ask("Status (aberto/pago/cancelado ou enter): ");
    const orders = await this.orderService.listOrders({ status });

    if (orders.length === 0) {
      console.log("Nenhum pedido encontrado.");
      return;
    }

    printTable(
      ["ID", "Cliente", "Status", "Total", "Criado em"],
      orders.map((order) => [
        order.id.slice(0, 8),
        order.customerName,
        order.status,
        formatCurrency(order.total),
        formatDate(order.createdAt)
      ])
    );
  }

  async updateOrderStatus() {
    printTitle("Alterar status");
    const partialId = await this.ask("Inicio do ID do pedido: ");
    const status = await this.ask("Novo status (aberto/pago/cancelado): ");
    const orders = await this.orderService.listOrders();
    const order = orders.find((item) => item.id.startsWith(partialId));

    if (!order) {
      throw new Error("Pedido nao encontrado pelo inicio do ID informado.");
    }

    const updated = await this.orderService.updateStatus(order.id, status);
    console.log(`Pedido ${updated.id.slice(0, 8)} agora esta ${updated.status}.`);
  }

  async showSalesReport() {
    printTitle("Relatorio de vendas");
    const report = await this.orderService.buildSalesReport();

    console.log(`Pedidos totais: ${report.totalOrders}`);
    console.log(`Pedidos pagos: ${report.paidOrders}`);
    console.log(`Pedidos abertos: ${report.openOrders}`);
    console.log(`Pedidos cancelados: ${report.canceledOrders}`);
    console.log(`Receita bruta: ${formatCurrency(report.grossRevenue)}`);

    if (report.bestSellingProducts.length > 0) {
      console.log("\nProdutos mais vendidos:");
      printTable(
        ["SKU", "Nome", "Qtd", "Receita"],
        report.bestSellingProducts.map((product) => [
          product.sku,
          product.name,
          product.quantity,
          product.revenueLabel
        ])
      );
    }
  }
}
