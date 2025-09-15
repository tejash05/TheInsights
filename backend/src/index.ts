import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import debugRouter from "./routes/debug";

import tenantsRouter from "./routes/tenants";
import customersRouter from "./routes/customers";
import ordersRouter from "./routes/orders";
import productsRouter from "./routes/products";
import eventsRouter from "./routes/events";
import resyncRouter from "./routes/resync";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Routes
app.use("/tenants", tenantsRouter);
app.use("/customers", customersRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);
app.use("/events", eventsRouter);
app.use("/resync", resyncRouter);
app.use("/debug", debugRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
