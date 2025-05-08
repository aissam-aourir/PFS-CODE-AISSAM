import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product'; // Import the Product interface
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
