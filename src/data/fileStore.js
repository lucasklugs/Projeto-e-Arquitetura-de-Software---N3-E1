import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_DATA = {
  products: [],
  customers: [],
  orders: []
};

export class FileStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async ensureFile() {
    const directory = path.dirname(this.filePath);
    await mkdir(directory, { recursive: true });

    try {
      await readFile(this.filePath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }

      await this.save(DEFAULT_DATA);
    }
  }

  async load() {
    await this.ensureFile();
    const raw = await readFile(this.filePath, "utf8");

    try {
      const parsed = JSON.parse(raw);

      return {
        products: Array.isArray(parsed.products) ? parsed.products : [],
        customers: Array.isArray(parsed.customers) ? parsed.customers : [],
        orders: Array.isArray(parsed.orders) ? parsed.orders : []
      };
    } catch {
      throw new Error(`Arquivo de dados invalido: ${this.filePath}`);
    }
  }

  async save(data) {
    const payload = JSON.stringify(data, null, 2);
    await writeFile(this.filePath, `${payload}\n`, "utf8");
  }

  async update(mutator) {
    const data = await this.load();
    const result = await mutator(data);
    await this.save(data);
    return result;
  }
}

export function createDefaultStore() {
  const root = process.cwd();
  return new FileStore(path.join(root, "data", "database.json"));
}
