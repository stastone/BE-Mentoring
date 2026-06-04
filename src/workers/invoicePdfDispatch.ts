import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import type { OrderCreatedPayload } from "../../microservices/notifications_service/types.js";

const workerPath = fileURLToPath(
  new URL("./invoicePdf.worker.js", import.meta.url),
);

export const generateInvoicePdfInWorker = (data: OrderCreatedPayload) =>
  new Promise<string>((resolve, reject) => {
    const worker = new Worker(workerPath, { workerData: data });
    worker.once("message", resolve);
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0) reject(new Error(`worker exit ${code}`));
    });
  });
