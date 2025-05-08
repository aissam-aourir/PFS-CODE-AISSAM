package com.ordex.web;

import com.ordex.entities.Category;
import com.ordex.services.implementations.CategoryService;
import com.ordex.services.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/categories")  // URL specific to categories
@RequiredArgsConstructor
public class CategoryController extends AbstractCrudController<Category, Long> {

    private final ICategoryService categoryService;

    @Override
    protected ICategoryService getService() {
        return categoryService;
    }
}
