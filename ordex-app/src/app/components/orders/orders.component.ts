import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastrModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {

  selectedOrder: Order | null = null;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  filters: any = {
    client: '',
    phone: '',
    total: null,
    paymentMethod: '',
    status: '',
    date: ''
  };

  constructor(private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders().subscribe(
      (data: Order[]) => {
        // Normaliser les statuts pour gérer les variantes de "Canceled/Cancelled"
        this.orders = data.map(order => ({
          ...order,
          status: order.status.replace(/cancelled/i, 'Canceled')
        }));
        console.log('Statuts des commandes:', this.orders.map(o => o.status));
        this.filteredOrders = [...this.orders];
        this.applyFilters();
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes', error);
      }
    );
  }

  applyFilters(): void {
    this.currentPage = 1; // Réinitialiser à la première page lors du changement de filtres
    this.filteredOrders = this.orders.filter(order => {
      const clientMatch = this.filters.client
        ? order.client.username.toLowerCase().includes(this.filters.client.toLowerCase().trim())
        : true;
      const phoneMatch = this.filters.phone
        ? order.phone.includes(this.filters.phone.trim())
        : true;
      const totalMatch = this.filters.total !== null && this.filters.total !== ''
        ? Math.abs(order.total - this.filters.total) < 0.01
        : true;
      const paymentMatch = this.filters.paymentMethod
        ? order.paymentMethod.toLowerCase() === this.filters.paymentMethod.toLowerCase().trim()
        : true;
      const statusMatch = this.filters.status
        ? order.status.trim().toLowerCase() === this.filters.status.toLowerCase().trim()
        : true;
      const dateMatch = this.filters.date
        ? new Date(order.createdAt).toISOString().split('T')[0] === this.filters.date
        : true;

      return clientMatch && phoneMatch && totalMatch && paymentMatch && statusMatch && dateMatch;
    });
  }

  resetFilters(): void {
    this.filters = {
      client: '',
      phone: '',
      total: null,
      paymentMethod: '',
      status: '',
      date: ''
    };
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status.trim().toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  viewProducts(order: Order): void {
    this.selectedOrder = order;
  }

  closeProductView(): void {
    this.selectedOrder = null;
  }

  completeOrder(order: any) {
    const confirmed = window.confirm('Voulez-vous vraiment marquer cette commande comme complétée ?');
    if (confirmed) {
      order.status = 'Completed';
      this.updateOrderStatus(order, 'Completed');
    }
  }

  cancelOrder(order: any) {
    const confirmed = window.confirm('Voulez-vous vraiment annuler cette commande ?');
    if (confirmed) {
      order.status = 'Canceled';
      this.updateOrderStatus(order, 'Canceled');
    }
  }

  updateOrderStatus(order: any, status: string) {
    this.orderService.updateOrder(order).subscribe(
      response => {
        console.log('Statut de la commande mis à jour:', response);
        this.fetchOrders();
        if (status === 'Completed') {
          this.toastr.success('Commande complétée avec succès !', 'Commande Complétée', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-success rounded shadow-sm w-72',
          });
        } else if (status === 'Canceled') {
          this.toastr.warning('La commande a été annulée.', 'Commande Annulée', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
            progressBar: true,
            toastClass: 'ngx-toastr toast toast-warning rounded shadow-sm w-72',
          });
        }
      },
      error => {
        console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      }
    );
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
