package com.ordex.services.implementations;

import com.ordex.entities.OrderProduct;
import com.ordex.repository.OrderProductRepository;
import com.ordex.services.interfaces.IOrderProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderProductService implements IOrderProductService {

    private final OrderProductRepository orderProductRepository;

    @Override
    public OrderProduct save(OrderProduct orderProduct) {
        return orderProductRepository.save(orderProduct);
    }

    @Override
    public OrderProduct update(Long id, OrderProduct orderProduct) {
        OrderProduct existing = orderProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderProduct not found"));
        existing.setQuantity(orderProduct.getQuantity());
        existing.setPriceAtPurchases(orderProduct.getPriceAtPurchases());
        existing.setOrder(orderProduct.getOrder());
        existing.setProduct(orderProduct.getProduct());
        return orderProductRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        orderProductRepository.deleteById(id);
    }

    @Override
    public OrderProduct getById(Long id) {
        return orderProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderProduct not found"));
    }

    @Override
    public List<OrderProduct> getAll() {
        return orderProductRepository.findAll();
    }
}
