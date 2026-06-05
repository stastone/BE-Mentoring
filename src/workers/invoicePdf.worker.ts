import { parentPort, workerData } from "node:worker_threads";
import { createWriteStream } from "node:fs";
import PDFDocument from "pdfkit";
import type { OrderItemType } from "../schemas/Order.schema.js";

const order = workerData;
const path = `./data/invoices/${order.orderId}.pdf`;
const doc = new PDFDocument();
doc.pipe(createWriteStream(path));
doc.text(`Invoice for ${order.orderId}`);
order.items.forEach((i: OrderItemType) =>
  doc.text(`${i.productId} x ${i.quantity}`),
);
doc.end();
doc.on("end", () => parentPort!.postMessage(path));
