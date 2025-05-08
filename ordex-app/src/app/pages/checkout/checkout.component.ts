import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout-page',
  standalone:true,
  imports:[CommonModule,FormsModule,RouterModule,ToastrModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutPageComponent implements OnInit {
  cart: Product[] = [];
  phone: string = '';
  paymentMethod: string = '';
  orderSubmitted: boolean = false;

  constructor(private authService: AuthService,
     private router: Router,
     private toastr: ToastrService,
     private orderService:OrderService
    ) {}

  ngOnInit(): void {
    const storedCart = localStorage.getItem(`cart-${this.authService.username}`);
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }

  get totalItems(): number {
    return this.cart.reduce((sum, product) => sum + (product.quantity || 1), 0);
  }

  get totalPrice(): number {
    return this.cart.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
  }

  submitOrder(): void {

    console.log('Submitting order with userId:', this.authService.userId);

    const orderPayload = {
      total: this.totalPrice,
      status: 'PENDING',
      phone: this.phone,
      paymentMethod: this.paymentMethod,
      createdAt: new Date(),
      client: {
        id: this.authService.userId // Assuming this is stored on login
      },
      orderProducts: this.cart.map(p => ({
        quantity: p.quantity || 1,
        priceAtPurchases: p.price,
        product: { id: p.id }
      }))
    };
  
    this.orderService.placeOrder(orderPayload).subscribe({
      next: (resp) => {
        this.toastr.success("🎉 Your order has been sent to the supplier!", "Order Placed", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
        });
        console.log(resp);
        localStorage.removeItem(`cart-${this.authService.username}`);
        this.orderSubmitted = true;
        this.router.navigateByUrl('/home/main');
      },
      error: () => {
        this.toastr.error("❌ Failed to submit order", "Error", {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          progressBar: true,
          toastClass: 'ngx-toastr toast toast-danger rounded shadow-sm w-72',
        });
      }
    });
  }
  
}
