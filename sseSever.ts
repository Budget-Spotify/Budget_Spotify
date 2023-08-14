import express from 'express';
import SSERouter from './sseRouter'; // Import mã cấu hình SSE

const sseApp = express();
const SSE_PORT = 8100; // Cổng riêng cho SSE

sseApp.use('/', SSERouter); // Sử dụng router SSE

sseApp.listen(SSE_PORT, () => {
    console.log(`SSE Server listening on port ${SSE_PORT}`);
});