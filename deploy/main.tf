provider "azurerm" {
  version = "~>2.18"
  features {}
}

variable "app_name" {
  type = string
}

variable "location" {
  type = string
}

variable "environment" {
  type = string
}

locals {
  prefix = "${var.app_name}${var.environment}"
}

resource "azurerm_resource_group" "static_site" {
  name     = local.prefix
  location = var.location
  tags = {
    CreatorEmail = ""
  }
}

resource "azurerm_log_analytics_workspace" "static_site" {
  name                = "${local.prefix}-log-analytics"
  location            = var.location
  resource_group_name = azurerm_resource_group.static_site.name
  sku                 = "PerGB2018"
  retention_in_days   = 90
}

resource "azurerm_application_insights" "static_site" {
  name                = "${local.prefix}-appinsights"
  location            = var.location
  resource_group_name = azurerm_resource_group.static_site.name
  application_type    = "Node.JS"
}

resource "azurerm_storage_account" "static_site" {
  name                = "${local.prefix}sa"
  resource_group_name = azurerm_resource_group.static_site.name

  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }
}

resource "azurerm_storage_account" "profiles" {
  name                = "${local.prefix}psa"
  resource_group_name = azurerm_resource_group.static_site.name

  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
}

resource "azurerm_storage_container" "profiles" {
  name                  = "profiles"
  storage_account_name  = azurerm_storage_account.profiles.name
  container_access_type = "private"
}

resource "azurerm_app_service_plan" "static_site" {
  name                = "${local.prefix}-app-service-plan"
  location            = var.location
  resource_group_name = azurerm_resource_group.static_site.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Dynamic"
    size = "Y1"
  }

  lifecycle {
    ignore_changes = [kind]
  }
}

resource "azurerm_function_app" "static_site" {
  name                      = "${local.prefix}-function-app"
  location                  = var.location
  resource_group_name       = azurerm_resource_group.static_site.name
  app_service_plan_id       = azurerm_app_service_plan.static_site.id
  storage_connection_string = azurerm_storage_account.static_site.primary_connection_string
  os_type                   = "linux"
  https_only                = true
  enable_builtin_logging    = false

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME       = "node"
    WEBSITE_NODE_DEFAULT_VERSION   = "~12"
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.static_site.instrumentation_key
    WEBSITE_RUN_FROM_PACKAGE       = "1"
    PROFILES_STORAGE_CONNECTION    = azurerm_storage_account.profiles.primary_connection_string
  }

  site_config {
    ftps_state = "Disabled"
  }

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_frontdoor" "static_site" {
  name                                         = "${local.prefix}-front-door"
  resource_group_name                          = azurerm_resource_group.static_site.name
  enforce_backend_pools_certificate_name_check = false

  routing_rule {
    name               = "static-content"
    accepted_protocols = ["Http", "Https"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["${local.prefix}-frontend"]
    forwarding_configuration {
      forwarding_protocol = "MatchRequest"
      backend_pool_name   = "blob"
    }
  }

  routing_rule {
    name               = "api"
    accepted_protocols = ["Http", "Https"]
    patterns_to_match  = ["/api/*"]
    frontend_endpoints = ["${local.prefix}-frontend"]
    forwarding_configuration {
      forwarding_protocol = "MatchRequest"
      backend_pool_name   = "function"
    }
  }

  backend_pool_load_balancing {
    name = "${local.prefix}-load-balancing"
  }

  backend_pool_health_probe {
    name = "${local.prefix}-health-probe"
  }

  backend_pool {
    name = "blob"
    backend {
      host_header = trimprefix(trimsuffix(azurerm_storage_account.static_site.primary_web_endpoint, "/"), "https://")
      address     = trimprefix(trimsuffix(azurerm_storage_account.static_site.primary_web_endpoint, "/"), "https://")
      http_port   = 80
      https_port  = 443
    }

    load_balancing_name = "${local.prefix}-load-balancing"
    health_probe_name   = "${local.prefix}-health-probe"
  }

  backend_pool {
    name = "function"
    backend {
      host_header = azurerm_function_app.static_site.default_hostname
      address     = azurerm_function_app.static_site.default_hostname
      http_port   = 80
      https_port  = 443
    }

    load_balancing_name = "${local.prefix}-load-balancing"
    health_probe_name   = "${local.prefix}-health-probe"
  }

  frontend_endpoint {
    name                              = "${local.prefix}-frontend"
    host_name                         = "${local.prefix}-front-door.azurefd.net"
    custom_https_provisioning_enabled = false
  }
}
