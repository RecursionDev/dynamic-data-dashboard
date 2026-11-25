package com.recursiondev.dashboard.entity;

import jakarta.persistence.*;
import jakarta.persistence.GeneratedValue;

public class Workspace {
    @Entity
    @Table(name = "workspaces")
    public class workspace {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;

        private String description;

    }
}
