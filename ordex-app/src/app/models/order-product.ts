import { Order } from "./order";
import { Product } from "./product";


export interface OrderProduct {
    id:number;
    quantity:number;
    priceAtPurchases:number;
    order:Order;
    product:Product;
}


