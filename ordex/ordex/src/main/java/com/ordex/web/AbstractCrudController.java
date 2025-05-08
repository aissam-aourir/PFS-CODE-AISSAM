package com.ordex.web;

import com.ordex.services.interfaces.ICrudBaseService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class AbstractCrudController<T, ID> {

    protected abstract ICrudBaseService<T, ID> getService();

    @PostMapping
    //@PreAuthorize("hasAuthority('ADMIN')")
    public T create(@RequestBody T entity) {
        return getService().save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable ID id, @RequestBody T entity) {
        return getService().update(id, entity);
    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void delete(@PathVariable ID id) {
        getService().delete(id);
    }

    @GetMapping("/{id}")
    public T getById(@PathVariable ID id) {
        return getService().getById(id);
    }

    @GetMapping
    public List<T> getAll() {
        return getService().getAll();
    }
}
