package com.dotori.dotori.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                // 프로젝트 내부의 static/images 디렉토리에서 이미지 제공
//                .addResourceLocations("file:" + System.getProperty("user.dir") + "/src/main/resources/static/images/")
                // 사용자 홈 디렉토리의 dotori/images 폴더에서 이미지 제공
                .addResourceLocations("file:" + System.getProperty("user.home") + "/dotori/images/")
                .addResourceLocations("file:C:/Users/USER/dotori/images/")
                .setCachePeriod(0); // 캐시 무효화를 위한 설정 (개발 중에는 유용하지만, 프로덕션에서는 적절한 캐시 전략 고려 필요)
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 설정 적용
                .allowedOrigins("http://localhost:3000") // React 애플리케이션의 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 인증 정보 허용
    }
}