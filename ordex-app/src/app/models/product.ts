import { Category } from "./category";

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number; // Represents the stock in the store
  quantity?: number; // New field for quantity (representing the number of items user wants to buy)
  imageURL: string;
  createdAt?: string; // use string for dates
  category: Category;
  isValidByAdmin:boolean;
  supplier?: { userId: string | null, username?: string }; 
}
