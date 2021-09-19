import express, { Response, Request } from "express";
import path from "path";
import compression from "compression";
import { Cors } from "./restapi/cors";
import { ApiRes } from "./restapi/status";
const app = express();
// routes
const HomeRoutes = require("../routes/home.route");
// App usages
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// CORS
app.use(Cors);
// routes usages
app.use(HomeRoutes);
app.use("/public", express.static(path.join(__dirname, "public")));

// Error Pages
app.use("/error/500", (req, res, next) => {
  ApiRes(res, <RestApi.ResInterface>{
    status: 500,
    msg: undefined,
    data: undefined,
  });
});
app.use((req: Request, res: Response, next: any) => {
  ApiRes(res, <RestApi.ResInterface>{
    status: 404,
    msg: undefined,
    data: undefined,
  });
});

module.exports = app;
