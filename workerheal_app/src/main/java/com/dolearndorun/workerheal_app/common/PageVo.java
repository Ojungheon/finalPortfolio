package com.dolearndorun.workerheal_app.common;

import lombok.Data;
import java.util.List;

@Data
public class PageVo<T> {
    private List<T> content;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int pageSize;
}