import { logger } from './logger.js';

export interface RetryOptions {
    maxAttempts?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    errorTypes?: Array<new (...args: any[]) => Error>;
    timeoutMs?: number;
}

function isError(error: unknown): error is Error {
    return error instanceof Error;
}

export async function retry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 3,
        initialDelayMs = 1000,
        maxDelayMs = 10000,
        errorTypes,
        timeoutMs
    } = options;

    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            if (timeoutMs) {
                return await Promise.race([
                    operation(),
                    new Promise<T>((_, reject) => 
                        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
                    )
                ]);
            }
            return await operation();
        } catch (error: unknown) {
            if (!isError(error)) {
                throw new Error('Unknown error occurred');
            }
            
            lastError = error;
            
            // Check if we should retry based on error type
            if (errorTypes && !errorTypes.some(type => error instanceof type)) {
                throw error;
            }

            if (attempt < maxAttempts) {
                // Calculate delay with exponential backoff
                const delay = Math.min(
                    initialDelayMs * Math.pow(2, attempt - 1),
                    maxDelayMs
                );
                
                logger.warn(
                    `Attempt ${attempt} failed with error: ${error.message}. Retrying in ${delay}ms...`
                );
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw new Error(
        `Operation failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`
    );
} 