import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { User } from '../../models/user';  // Assuming User model exists
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clients',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: User[] = [];
  paginatedClients: User[] = [];
  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAll().subscribe((clients) => {
      this.clients = clients;
      this.totalPages = Math.ceil(this.clients.length / this.pageSize);
      this.paginateClients();
    });
  }

  approveClient(clientId: number): void {
    // Your logic to approve the client
    console.log('Approving client with ID:', clientId);
  }

  blockClient(clientId: number): void {
    // Your logic to block the client
    console.log('Blocking client with ID:', clientId);
  }
  loadMoreClients(): void {
    // Logic to load more clients if paginated
    console.log('Loading more clients...');
  }

  deleteClient(clientId: number): void {
    // Your logic to delete the client
    console.log('Deleting client with ID:', clientId);
    // Example of how to call the clientService to delete a client:
    // this.clientService.delete(clientId).subscribe(() => {
    //   this.loadClients(); // Reload clients after deletion
    // });
  }

  paginateClients() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedClients = this.clients.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateClients();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateClients();
    }
  }

  searchClients() {
    if (this.searchQuery.trim()) {
      this.clients = this.clients.filter(
        (client) =>
          client.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadClients(); // Re-fetch all clients if search is cleared
    }
    this.paginateClients();
  }
}
