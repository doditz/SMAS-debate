
// services/loggingService.ts
import { LogEntry, LogLevel } from '../types';
import { v4 as uuidv4 } from 'uuid';

class LoggingService {
    private logs: LogEntry[] = [];
    private listeners: ((logs: LogEntry[]) => void)[] = [];
    private maxLogs = 2000; // Retain history

    constructor() {
        // Capture unhandled exceptions globally
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                this.error('Unhandled Runtime Error', { message: event.message, filename: event.filename, lineno: event.lineno }, event.error?.stack);
            });
            window.addEventListener('unhandledrejection', (event) => {
                this.error('Unhandled Promise Rejection', { reason: event.reason });
            });
        }
    }

    private addLog(level: LogLevel, message: string, context?: any, stack?: string) {
        const entry: LogEntry = {
            id: uuidv4(),
            timestamp: Date.now(),
            level,
            message,
            // Deep clone context to prevent reference mutation if the object changes later
            context: context ? JSON.parse(JSON.stringify(context, this.getCircularReplacer())) : undefined,
            stack
        };

        // Mirror to browser console with color coding
        const style = 
            level === 'ERROR' ? 'background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px;' : 
            level === 'WARN' ? 'background: #f59e0b; color: black; padding: 2px 4px; border-radius: 2px;' : 
            level === 'DEBUG' ? 'color: #06b6d4;' : 
            level === 'TRACE' ? 'color: #6b7280;' : 'color: #a3e635;';
        
        console.log(`%c[${level}]`, style, message, context || '');

        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        this.notifyListeners();
    }

    // Helper to handle circular references in JSON
    private getCircularReplacer() {
        const seen = new WeakSet();
        return (key: any, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular]";
                }
                seen.add(value);
            }
            return value;
        };
    }

    public info(message: string, context?: any) {
        this.addLog('INFO', message, context);
    }

    public warn(message: string, context?: any) {
        this.addLog('WARN', message, context);
    }

    public error(message: string, context?: any, stack?: string) {
        this.addLog('ERROR', message, context, stack);
    }

    public debug(message: string, context?: any) {
        this.addLog('DEBUG', message, context);
    }
    
    public trace(message: string, context?: any) {
        this.addLog('TRACE', message, context);
    }

    public getLogs(): LogEntry[] {
        return [...this.logs];
    }

    public clearLogs() {
        this.logs = [];
        this.notifyListeners();
    }

    public subscribe(listener: (logs: LogEntry[]) => void) {
        this.listeners.push(listener);
        listener(this.getLogs());
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.getLogs()));
    }
    
    public exportLogsJSON(): string {
        return JSON.stringify(this.logs, null, 2);
    }
}

const loggingService = new LoggingService();
export default loggingService;
