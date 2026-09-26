import express, { Request, Response, NextFunction } from "express";
 
// 1. Leer la configuración desde variables de entorno
const PORT = process.env.PORT;
 
if (!PORT) {
  console.error("ERROR: la variable de entorno PORT no está definida");
  process.exit(1);
}
 
// 2. Crear la aplicación Express
const app = express();
app.use(express.json());
 
// 3. Middleware de log: cada petición quedará visible en "docker logs"
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});
 
// 4. Datos de ejemplo (en memoria, no hay base de datos)
interface Product {
  id: number;
  name: string;
  price: number;
}
 
const products: Product[] = [
  { id: 1, name: "Teclado mecánico", price: 250000 },
  { id: 2, name: "Mouse inalámbrico", price: 90000 },
  { id: 3, name: "Monitor", price: 780000 },
];
 
// 5. Rutas
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "backend-api",
    version: "1.0.0",
    description: "API REST de productos dockerizada con Nginx como reverse proxy",
    endpoints: ["/health", "/api/products", "/api/products/:id"],
  });
});
 
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "backend-api" });
});
 
app.get("/api/products", (_req: Request, res: Response) => {
  res.json(products);
});
 
app.get("/api/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);
 
  if (!product) {
    res.status(404).json({ error: `Producto con id ${req.params.id} no encontrado` });
    return;
  }
  res.json(product);
});
 
// 6. Arrancar el servidor escuchando en todas las interfaces (0.0.0.0)
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`backend-api escuchando en el puerto ${PORT}`);
});
