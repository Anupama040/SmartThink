package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud_name:}")
    private String cloudName;

    @Value("${cloudinary.api_key:}")
    private String apiKey;

    @Value("${cloudinary.api_secret:}")
    private String apiSecret;

    public String uploadFile(MultipartFile file) throws IOException {
        if (cloudName == null || cloudName.isEmpty() || cloudName.equals("your_cloud_name")) {
            return "https://res.cloudinary.com/demo/raw/upload/v1/mock_resume_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        }
        
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
        
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
            "resource_type", "auto",
            "folder", "smartthink/resumes"
        ));
        
        return uploadResult.get("secure_url").toString();
    }
}
