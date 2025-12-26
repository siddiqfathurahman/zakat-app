import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx", "resources/css/app.css"],
            refresh: false,
        }),
        react(),
        tailwindcss(),
    ],
    // server: {
    //     host: "0.0.0.0",
    //     port: 5173,
    //     hmr: {
    //         host: "caylee-galactic-unstructurally.ngrok-free.dev",
    //         protocol: "wss",
    //         clientPort: 443,
    //     },
    // },
});
