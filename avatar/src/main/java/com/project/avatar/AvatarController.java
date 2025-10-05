package com.project.avatar.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Random;

@RestController
@RequestMapping("/api/avatar")
public class AvatarController {

    private static final int FINAL_SIZE = 230;
    private static final int GRID_SIZE = 10;

    /**
     * Generate alien-style avatar bytes (deterministic if seed provided)
     */
    private byte[] generateAlienAvatar(String seed) throws IOException {
        Random random = (seed == null || seed.isEmpty())
                ? new Random()
                : new Random(seed.hashCode()); // same seed => same avatar

        // Two random colors
        Color color1 = new Color(random.nextInt(256), random.nextInt(256), random.nextInt(256));
        Color color2 = new Color(random.nextInt(256), random.nextInt(256), random.nextInt(256));
        Color background = Color.BLACK;

        // Small pixel grid
        BufferedImage gridImage = new BufferedImage(GRID_SIZE, GRID_SIZE, BufferedImage.TYPE_INT_RGB);

        for (int y = 0; y < GRID_SIZE; y++) {
            for (int x = 0; x < GRID_SIZE / 2; x++) {
                boolean filled = random.nextBoolean();
                Color chosen = filled ? (random.nextBoolean() ? color1 : color2) : background;

                // Mirror horizontally for alien-like symmetry
                gridImage.setRGB(x, y, chosen.getRGB());
                gridImage.setRGB(GRID_SIZE - 1 - x, y, chosen.getRGB());
            }
        }

        // Scale to final size (pixelated look)
        BufferedImage finalImage = new BufferedImage(FINAL_SIZE, FINAL_SIZE, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = finalImage.createGraphics();
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
        g2d.drawImage(gridImage, 0, 0, FINAL_SIZE, FINAL_SIZE, null);
        g2d.dispose();

        // Convert to PNG bytes
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(finalImage, "png", baos);
        return baos.toByteArray();
    }

    /**
     * Inline preview (used for <img src="...">)
     */
    @GetMapping
    public ResponseEntity<byte[]> getAvatar(@RequestParam(required = false) String seed) throws IOException {
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(generateAlienAvatar(seed));
    }

    /**
     * Force browser download
     */
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadAvatar(@RequestParam(required = false) String seed) throws IOException {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=avatar.png")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(generateAlienAvatar(seed));
    }
}
