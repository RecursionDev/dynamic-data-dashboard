package com.recursiondev.dashboard.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DatasetRecordRequest(

    @NotBlank(message = "Region is required")
    String region,

    @NotBlank(message = "Product is required")
    String product,

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount cannot be negative")
    BigDecimal amount

) {}