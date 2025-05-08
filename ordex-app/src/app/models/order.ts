import { Delivery } from "./delivery";
import { OrderProduct } from "./order-product";
import { User } from "./user";


export interface Order {
  id: number;
  total: number;
  status: string;
  phone:string;
  createdAt: string; 
  paymentMethod: string;
  client: { username: string };
  orderProducts: OrderProduct[];
}