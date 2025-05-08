package com.ordex.services.implementations;

import com.ordex.entities.Order;
import com.ordex.repository.OrderRepository;
import com.ordex.services.interfaces.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;

    @Override
    public Order save(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order update(Long id, Order order) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        existing.setTotal(order.getTotal());
        existing.setStatus(order.getStatus());
        existing.setClient(order.getClient());
        existing.setOrderProducts(order.getOrderProducts());
        return orderRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    @Override
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getAll() {
        return orderRepository.findAll();
    }
}
