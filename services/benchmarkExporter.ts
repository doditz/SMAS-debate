
// services/benchmarkExporter.ts
import { BatchResult, BenchmarkReport } from '../types';

class BenchmarkExporter {
    public downloadQuery(result: BatchResult) {
        const content = this.generateMarkdown([result]);
        this.saveFile(content, `neuronas-case-${result.test.question_id}.md`, 'text/markdown');
    }

    public exportAll(results: BatchResult[], format: 'json' | 'md' | 'txt') {
        let content = "";
        let fileName = `neuronas-benchmark-report-${Date.now()}`;
        let mimeType = "text/plain";

        if (format === 'json') {
            content = JSON.stringify(results, null, 2);
            fileName += ".json";
            mimeType = "application/json";
        } else if (format === 'md') {
            content = this.generateMarkdown(results);
            fileName += ".md";
            mimeType = "text/markdown";
        } else {
            content = this.generateText(results);
            fileName += ".txt";
        }

        this.saveFile(content, fileName, mimeType);
    }

    private generateMarkdown(results: BatchResult[]): string {
        let md = `# NEURONAS V13.0 Benchmark Report\n`;
        md += `Date: ${new Date().toLocaleString()}\n\n`;
        md += `## Executive Summary\n\n`;
        
        const avgSmas = results.reduce((acc, r) => acc + (r.evaluation?.smas.overall_score || 0), 0) / results.length;
        const avgLlm = results.reduce((acc, r) => acc + (r.evaluation?.llm.overall_score || 0), 0) / results.length;
        
        md += `| Metric | Average Score |\n| :--- | :--- |\n`;
        md += `| Baseline LLM | ${avgLlm.toFixed(2)} |\n`;
        md += `| Neuronas Pipeline | ${avgSmas.toFixed(2)} |\n`;
        md += `| Average Gain | **+${(((avgSmas - avgLlm) / (avgLlm || 1)) * 100).toFixed(1)}%** |\n\n`;

        md += `## Detailed Case Analysis\n\n`;

        results.forEach(res => {
            md += `### [${res.test.question_id}] ${res.test.question_text}\n\n`;
            md += `**Domain:** ${res.test.domain || 'N/A'}\n`;
            md += `**Verdict:** ${res.valueAnalysis?.verdict || 'N/A'}\n\n`;
            
            md += `#### Scoring (0-10)\n`;
            md += `| Criterion | Baseline | Neuronas | Delta |\n| :--- | :--- | :--- | :--- |\n`;
            
            const smasC = (res.evaluation?.smas.criteria || {}) as Record<string, number>;
            const llmC = (res.evaluation?.llm.criteria || {}) as Record<string, number>;
            const keys = Object.keys(smasC);
            
            keys.forEach(k => {
                const s = smasC[k] || 0;
                const l = llmC[k] || 0;
                md += `| ${k} | ${l.toFixed(1)} | ${s.toFixed(1)} | ${ (s-l) > 0 ? '+' : ''}${(s-l).toFixed(1)} |\n`;
            });
            md += `| **OVERALL** | **${res.evaluation?.llm.overall_score.toFixed(2)}** | **${res.evaluation?.smas.overall_score.toFixed(2)}** | **+${res.valueAnalysis?.scoreDelta.toFixed(2)}** |\n\n`;

            md += `#### Feedback\n`;
            md += `> **Judge Analysis:** ${res.evaluation?.smas.feedback}\n\n`;
            
            md += `#### Outputs\n`;
            md += `**Baseline:**\n\`\`\`\n${res.outputs?.baseline}\n\`\`\`\n\n`;
            md += `**Neuronas Pipeline:**\n\`\`\`\n${res.outputs?.pipeline}\n\`\`\`\n\n`;
            md += `---\n\n`;
        });

        return md;
    }

    private generateText(results: BatchResult[]): string {
        let txt = `NEURONAS V13.0 FORENSIC BENCHMARK REPORT\n`;
        txt += `========================================\n\n`;
        results.forEach(res => {
            txt += `CASE ID: ${res.test.question_id}\n`;
            txt += `QUERY: ${res.test.question_text}\n`;
            txt += `BASELINE SCORE: ${res.evaluation?.llm.overall_score.toFixed(2)}\n`;
            txt += `NEURONAS SCORE: ${res.evaluation?.smas.overall_score.toFixed(2)}\n`;
            txt += `GAIN: +${res.valueAnalysis?.scoreDeltaPercent.toFixed(1)}%\n`;
            txt += `FEEDBACK: ${res.evaluation?.smas.feedback}\n`;
            txt += `----------------------------------------\n\n`;
        });
        return txt;
    }

    private saveFile(content: string, fileName: string, mimeType: string) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }
}

export const benchmarkExporter = new BenchmarkExporter();
