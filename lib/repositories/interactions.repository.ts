import type { CustomerInteraction } from "../types";
import { getInteractionsCollection } from "../db";
import { BaseRepository } from "./base-repository";

class InteractionsRepository extends BaseRepository<CustomerInteraction> {
  protected collectionPromise = getInteractionsCollection();

  findByCustomerId(customerId: string) {
    return this.findMany({ customerId }, { sort: { createdAt: -1 } });
  }

  findByMarketerId(marketerId: string) {
    return this.findMany({ marketerId }, { sort: { createdAt: -1 } });
  }

  findByType(type: CustomerInteraction["type"]) {
    return this.findMany({ type }, { sort: { createdAt: -1 } });
  }
}

export const interactionsRepository = new InteractionsRepository();

