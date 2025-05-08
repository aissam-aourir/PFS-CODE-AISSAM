package com.ordex.services.interfaces;

import java.util.List;

public interface ICrudBaseService <T, ID> {
    T save(T entity);
    T update(ID id, T entity);
    void delete(ID id);
    T getById(ID id);
    List<T> getAll();
}
