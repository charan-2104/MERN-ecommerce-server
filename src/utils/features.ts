import mongoose, { Document } from "mongoose"
import { InvalidateCacheProps, OrderItemType } from "../types/types";
import { myCache } from "../app";
import { Product } from "../models/product";
import { Order } from "../models/order";


export const connectDB = (uri: string)=>{
    mongoose.connect(uri,{
        dbName: "Ecommerce_24"
    }).then(c=>console.log(`DB Connceted to ${c.connection.host}`)).
    catch((e)=>console.log(e));

}


export const invalidateCache = ({products, order, admin, userId, orderId, productId}: InvalidateCacheProps) => {

    if(products){
        const productKeys: string[] = ["latest-products","categories","all-products",]
        if(typeof productId === "string") productKeys.push(`product-${productId}`);
        if(typeof productId === "object") productId.forEach((i) => productKeys.push(`product-${i}`));
        myCache.del(productKeys)
    }

    if(order){
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];
        myCache.del(orderKeys);
    }
    if(admin){
        myCache.del(["admin-stats", "admin-pie-charts", "admin-bar-charts", "admin-line-charts"])
    }
}



export const reduceStock = async (orderItems:OrderItemType[]) => {

    for(let i = 0; i < orderItems.length; i++){
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product) throw new Error("Product Not Found");
        product.stock -= order.quantity;
        await product.save();
    }
}



export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
    if(lastMonth === 0) return thisMonth * 100;
    const percent = ((thisMonth) / lastMonth) * 100;
    return Number(percent.toFixed(0))
}

interface myDocument extends Document {
    createdAt: Date;
    discount?: number,
    total?: number,
}

type FuncProps = {
    length: number, 
    docArr:myDocument[],
    today: Date,
    property?: "discount" | "total"
}

export const getChartData = ({length, docArr, today, property}: FuncProps) => {
    const data: number[] = new Array(length).fill(0);

    docArr.forEach((i)=>{
       const creationDate = i.createdAt;
       const montDiff = ( today.getMonth() - creationDate.getMonth() + 12 ) % 12;

       if(montDiff < length){
        if(property){
            data[length - montDiff - 1] += i[property]!
        }
        else{
            data[length - montDiff - 1] += 1
        }
       }
    })
    return data;
}