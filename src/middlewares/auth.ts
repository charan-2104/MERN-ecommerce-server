import { getSystemErrorMap } from "util";
import { User } from "../models/user";
import ErrorHandler from "../utils/utility-class";
import { TryCatch } from "./error";


// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async(req,res,next) => {
    const { id } = req.query;

    if(!id){
        return next(new ErrorHandler("Please do login",401))
    }

    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler("INvalid User",401));
    }

    if(user.role !== "admin"){
        return next(new ErrorHandler("Unauthorized access",401));
    }

    next();
})