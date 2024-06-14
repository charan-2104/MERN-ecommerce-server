import  express  from "express";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order";
import { adminOnly } from "../middlewares/auth";
const app = express.Router();

// route - /api/v1/order/new
app.post("/new", newOrder)

// route - /api/v1/order/my
app.get("/my", myOrders)

// route - /api/v1/order/all
app.get("/all", adminOnly, allOrders)

// route - /api/v1/order/all
app.route("/:id").get(getSingleOrder).put(adminOnly, processOrder).delete(adminOnly, deleteOrder);



export default app;