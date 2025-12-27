
// services/loggingService.ts
import { LogEntry, LogLevel, BatchResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

class LoggingService {
    private logs: LogEntry[] = [];
    private experimentRegistry: Map<string, BatchResult> = new Map();
    private listeners: ((logs: LogEntry[]) => void)[] = [];
    private maxLogs = 3000;

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                this.error('Critical Runtime Error', { msg: event.message, file: event.filename }, event.error?.stack);
            });
        }
    }

    public registerExperiment(result: BatchResult) {
        this.experimentRegistry.set(result.id, result);
        this.info(`[W&B] Experiment Registered: ${result.test.question_id}`, { 
            id: result.id, 
            lift: `${result.valueAnalysis?.scoreDeltaPercent.toFixed(1)}%`,
            experiment_id: result.id
        });
    }

    public getLogsByExperiment(experimentId: string): LogEntry[] {
        return this.logs.filter(log => log.context?.experiment_id === experimentId || log.experiment_id === experimentId);
    }

    private addLog(level: LogLevel, message: string, context?: any, stack?: string) {
        const entry: LogEntry = {
            id: uuidv4(),
            timestamp: Date.now(),
            level,
            message,
            context: context ? JSON.parse(JSON.stringify(context)) : undefined,
            stack,
            experiment_id: context?.experiment_id
        };

        const style = 
            level === 'ERROR' ? 'color: #f87171; font-weight: bold;' : 
            level === 'WARN' ? 'color: #fbbf24;' : 
            level === 'INFO' ? 'color: #60a5fa;' : 'color: #9ca3af;';
        
        console.log(`%c[${level}] %c${message}`, style, 'color: inherit;', context || '');

        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) this.logs.shift();
        this.notifyListeners();
    }

    public info(message: string, context?: any) { this.addLog('INFO', message, context); }
    public warn(message: string, context?: any) { this.addLog('WARN', message, context); }
    public error(message: string, context?: any, stack?: string) { this.addLog('ERROR', message, context, stack); }
    public debug(message: string, context?: any) { this.addLog('DEBUG', message, context); }
    public trace(message: string, context?: any) { this.addLog('TRACE', message, context); }

    public subscribe(listener: (logs: LogEntry[]) => void) {
        this.listeners.push(listener);
        listener([...this.logs]);
        return () => { this.listeners = this.listeners.filter(l => l !== listener); };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l([...this.logs]));
    }
    
    public clearLogs() {
        this.logs = [];
        this.notifyListeners();
    }

    public exportLogsJSON(): string {
        return JSON.stringify({
            logs: this.logs,
            experiments: Array.from(this.experimentRegistry.entries())
        }, null, 2);
    }
}

const loggingService = new LoggingService();
export default loggingService;
