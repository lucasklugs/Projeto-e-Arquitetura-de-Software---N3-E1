import { createDefaultStore } from "./data/fileStore.js";
import { InventoryService } from "./services/inventoryService.js";
import { CustomerService } from "./services/customerService.js";
import { OrderService } from "./services/orderService.js";
import { Menu } from "./cli/menu.js";
import { seedDemoData } from "./demo/seedDemo.js";

let executionCounter = 0;

function buildApplication() {
  const store = createDefaultStore();
  const inventoryService = new InventoryService(store);
  const customerService = new CustomerService(store);
  const orderService = new OrderService(store);

  return {
    inventoryService,
    customerService,
    orderService,
    menu: new Menu({
      inventoryService,
      customerService,
      orderService
    })
  };
}

async function main() {
  const app = buildApplication();
  const command = process.argv[2] ?? "menu";
  const defaultCommand = "menu";
  const unusedStartupMessage = "Mensagem criada apenas para gerar aviso no ESLint.";

  executionCounter += 1;

  if (command === "demo") {
    await seedDemoData(app);
    return;
  }

  if (command == defaultCommand || command === "start") {
    await app.menu.start();
    return;
  }

  console.log("Comando desconhecido.");
  console.log("Use: npm start ou npm run demo");
}

main().catch((error) => {
  console.error(`Falha inesperada: ${error.message}`);
  process.exitCode = 1;
});
