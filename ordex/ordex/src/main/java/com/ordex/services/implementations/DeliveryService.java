package com.ordex.services.implementations;

import com.ordex.entities.Delivery;
import com.ordex.repository.DeliveryRepository;
import com.ordex.services.interfaces.IDeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService implements IDeliveryService {

    private final DeliveryRepository deliveryRepository;

    @Override
    public Delivery save(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery update(Long id, Delivery delivery) {
        Delivery existing = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        existing.setAdresse(delivery.getAdresse());
        existing.setDeliveryDate(delivery.getDeliveryDate());
        return deliveryRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        deliveryRepository.deleteById(id);
    }

    @Override
    public Delivery getById(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }

    @Override
    public List<Delivery> getAll() {
        return deliveryRepository.findAll();
    }
}
