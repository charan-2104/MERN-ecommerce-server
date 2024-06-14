
import  express  from "express";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateProduct } from "../controllers/product";
import { adminOnly } from "../middlewares/auth";
import { singleUpload } from "../middlewares/multer";

const app = express.Router();

// create New Product - /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct)  

// Get All products with filter - /api/v1/product/all
app.get("/all", getAllProducts)

// Get latest products - /api/v1/product/latest
app.get("/latest", getLatestProducts)

// Get all unique categories - /api/v1/product/categories
app.get("/categories", getAllCategories)

// Get all products  - /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts)

app
    .route("/:id")
        .get(getSingleProduct)
        .put(adminOnly, singleUpload, updateProduct)
        .delete(adminOnly, deleteProduct)

export default app;