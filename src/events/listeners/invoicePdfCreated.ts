import { generateInvoicePdfInWorker } from "../../workers/invoicePdfDispatch.js";
import type { DomainEvents } from "../domainEvents.js";
export const generateInvoicePdf = async (
  event: DomainEvents["OrderCreated"],
) => {
  const path = await generateInvoicePdfInWorker(event);
  console.log(`[invoice] wrote ${path}`);
};
