package com.ordex.web;

import com.ordex.entities.Order;
import com.ordex.entities.OrderProduct;
import com.ordex.entities.Product;
import com.ordex.helpers.OrderListResponseDTO;
import com.ordex.helpers.OrderResponseDTO;
import com.ordex.security.entities.Utilisateur;
import com.ordex.security.service.AccountServiceImpl;
import com.ordex.services.interfaces.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;
    private final IOrderProductService orderProductService;
    private final IProductService productService;
    private final AccountServiceImpl accountService;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderResponseDTO dto) {
        try {
            // Validate client
            Utilisateur client = accountService.findById(dto.getClient().getId());
            if (client == null) {
                return ResponseEntity.badRequest().body("Client not found.");
            }

            // Create Order
            Order order = new Order();
            order.setTotal(dto.getTotal());
            order.setStatus(dto.getStatus());
            order.setPhone(dto.getPhone());
            order.setPaymentMethod(dto.getPaymentMethod());
            order.setCreatedAt(dto.getCreatedAt());
            order.setClient(client);

            // Save Order to get ID
            Order savedOrder = orderService.save(order);

            // Map and save OrderProduct entities
            List<OrderProduct> savedOrderProducts = dto.getOrderProducts().stream().map(item -> {
                Product product = productService.getById(item.getProduct().getId());
                if (product == null) {
                    throw new IllegalArgumentException("Product not found: ID " + item.getProduct().getId());
                }

                OrderProduct op = new OrderProduct();
                op.setOrder(savedOrder);
                op.setProduct(product);
                op.setQuantity(item.getQuantity().longValue());
                op.setPriceAtPurchases(item.getPriceAtPurchases());

                return orderProductService.save(op);
            }).collect(Collectors.toList());

            savedOrder.setOrderProducts(savedOrderProducts);

            // ✅ Prepare the response DTO
            OrderResponseDTO response = new OrderResponseDTO();
            response.setId(savedOrder.getId());
            response.setTotal(savedOrder.getTotal());
            response.setStatus(savedOrder.getStatus());
            response.setPhone(savedOrder.getPhone());
            response.setPaymentMethod(savedOrder.getPaymentMethod());
            response.setCreatedAt(savedOrder.getCreatedAt());

            // Map client
            OrderResponseDTO.ClientDTO clientDTO = new OrderResponseDTO.ClientDTO();
            clientDTO.setId(client.getUserId());
            clientDTO.setUsername(client.getUsername());
            clientDTO.setEmail(client.getEmail());
            response.setClient(clientDTO);

            // Map order products
            List<OrderResponseDTO.OrderProductDTO> orderProductDTOs = savedOrderProducts.stream().map(op -> {
                OrderResponseDTO.OrderProductDTO dtoOp = new OrderResponseDTO.OrderProductDTO();
                dtoOp.setQuantity(op.getQuantity());
                dtoOp.setPriceAtPurchases(op.getPriceAtPurchases());

                OrderResponseDTO.OrderProductDTO.ProductDTO productDTO = new OrderResponseDTO.OrderProductDTO.ProductDTO();
                productDTO.setId(op.getProduct().getId());
                productDTO.setName(op.getProduct().getName());

                dtoOp.setProduct(productDTO);
                return dtoOp;
            }).collect(Collectors.toList());

            response.setOrderProducts(orderProductDTOs);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to place order: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OrderListResponseDTO>> getAllOrders() {
        List<OrderListResponseDTO> orderList = orderService.getAll().stream().map(order -> {
            OrderListResponseDTO response = new OrderListResponseDTO();
            response.setId(order.getId());
            response.setTotal(order.getTotal());
            response.setStatus(order.getStatus());
            response.setPhone(order.getPhone());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setCreatedAt(order.getCreatedAt());

            // Map client information (simplified for list view)
            OrderListResponseDTO.ClientDTO clientDTO = new OrderListResponseDTO.ClientDTO();
            clientDTO.setId(order.getClient().getUserId());
            clientDTO.setUsername(order.getClient().getUsername());
            response.setClient(clientDTO);

            // Map order products
            List<OrderListResponseDTO.OrderProductDTO> orderProductDTOList = order.getOrderProducts().stream().map(orderProduct -> {
                OrderListResponseDTO.OrderProductDTO productDTO = new OrderListResponseDTO.OrderProductDTO();
                productDTO.setQuantity(orderProduct.getQuantity());
                productDTO.setPriceAtPurchases(orderProduct.getPriceAtPurchases());

                // Map product details (simplified for list view)
                OrderListResponseDTO.OrderProductDTO.ProductDTO product = new OrderListResponseDTO.OrderProductDTO.ProductDTO();
                product.setId(orderProduct.getProduct().getId());
                product.setName(orderProduct.getProduct().getName());
                productDTO.setProduct(product);

                return productDTO;
            }).collect(Collectors.toList());

            response.setOrderProducts(orderProductDTOList);

            return response;
        }).collect(Collectors.toList());
        // Reverse the list so the last order comes first
        Collections.reverse(orderList);
        return ResponseEntity.ok(orderList);

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            Order order = orderService.getById(id);
            if (order == null) {
                return ResponseEntity.badRequest().body("Order not found.");
            }

            // Update the order status
            order.setStatus(status);
            orderService.save(order);

            // Return the updated order details
            OrderResponseDTO response = new OrderResponseDTO();
            response.setId(order.getId());
            response.setTotal(order.getTotal());
            response.setStatus(order.getStatus());
            response.setPhone(order.getPhone());
            response.setPaymentMethod(order.getPaymentMethod());
            response.setCreatedAt(order.getCreatedAt());

            OrderResponseDTO.ClientDTO clientDTO = new OrderResponseDTO.ClientDTO();
            clientDTO.setId(order.getClient().getUserId());
            clientDTO.setUsername(order.getClient().getUsername());
            clientDTO.setEmail(order.getClient().getEmail());
            response.setClient(clientDTO);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update order status: " + e.getMessage());
        }
    }
}
