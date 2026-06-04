package com.myfin.admin.config;


import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        // Define a unique identifier name for your security scheme
        final String securitySchemeName = "bearerAuth";
        
        return new OpenAPI()
                // Applies the security scheme lock to all API endpoints globally in Swagger UI
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                // Defines what kind of security scheme it is (HTTP Bearer JWT Token)
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
