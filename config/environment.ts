import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    baseURL: process.env.BASE_URL || 'http://localhost:3000', // fallback URL if not specified
    // Add other environment variables here as needed
}; 