import * as express from "express"

require("dotenv").config();
const router = express.Router();
import * as HomeController from "../controller/home.controller"

router.get("/", HomeController.HomePage);
 
module.exports = router;