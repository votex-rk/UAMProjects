/* js/logger.js */
export const Logger = {
    levels: {
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR',
        SECURITY: 'SEC_EVENT'
    },

    log: (level, message, metadata = {}) => {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}`;
        
        console.log(logEntry, metadata);

        // Optional: Send critical security logs to a separate Firebase collection
        if (level === 'SEC_EVENT' || level === 'ERROR') {
            // firestore.collection('audit_logs').add({ ... })
        }
    }
};