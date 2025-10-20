import express from "express";
import cors from "cors";
import {createProxyMiddleware} from "http-proxy-middleware";

const app = express();
app.use(cors({
    origin: "*",  // or specify your frontend URL
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// === AUTH SERVICE ===
// everything under /auth/* -> http://auth-service:4000/*
app.use(
    "/auth",
    createProxyMiddleware({
        target: "http://auth-service:4000",
        changeOrigin: true,
        pathRewrite: {"^/auth": ""}
    })
);

// === FILE SERVICE ===
// everything under /files/* -> http://file-service:5000/*
app.use(
    "/files",
    createProxyMiddleware({
        target: "http://file-service:5000",
        changeOrigin: true,
    })
);

app.get("/", (req, res) => {
    res.json({message: "API Gateway is running"});
});

const PORT = 3000;
app.listen(PORT, () => console.log("🚪 Gateway running on port " + PORT));