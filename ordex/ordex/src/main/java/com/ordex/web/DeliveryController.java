package com.ordex.web;

import com.ordex.entities.Delivery;
import com.ordex.services.implementations.DeliveryService;
import com.ordex.services.interfaces.IDeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deliveries")  // URL specific to deliveries
@RequiredArgsConstructor
public class DeliveryController extends AbstractCrudController<Delivery, Long> {

    private final IDeliveryService deliveryService;

    @Override
    protected IDeliveryService getService() {
        return deliveryService;
    }
}
