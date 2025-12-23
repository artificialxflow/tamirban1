import type { Product } from "../types";
import { getProductsCollection } from "../db";
import { BaseRepository } from "./base-repository";

class ProductsRepository extends BaseRepository<Product> {
  protected collectionPromise = getProductsCollection();

  findByCategory(category: string) {
    return this.findMany({ category, isActive: true });
  }

  findActive() {
    return this.findMany({ isActive: true });
  }

  findBySku(sku: string) {
    return this.findOne({ sku });
  }
}

export const productsRepository = new ProductsRepository();

