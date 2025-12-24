# NEURONAS ARCHITECTURE PRESERVATION GUIDE

**MANDATORY READING FOR EVERY UPDATE**

The following features are CORE to the NEURONAS experience and MUST NOT be removed or "placeholder-ized" during logic updates or refactors:

## 1. UI COMPONENTS (MANDATORY IN APP.TSX)
- **SynergyMonitor**: Visualizes DeltaV (Quality/Time efficiency).
- **InteractiveValidationPanel**: The Human-in-the-loop feedback system.
- **D3stibVisualizer**: Shows the semantic jerk (S''') and token salience.
- **RealtimeMetricsMonitor**: Displays Cognitive Flux F(t) and system load.
- **BudgetMonitor**: Tracks API spend.
- **CognitiveDissentDashboard**: Measures persona disagreement levels.
- **MemoryVisualizer**: Visual representation of Tiered Memory.
- **ImageResultDisplay**: Handles before/after comparison for image edits.

## 2. LOGIC PROTOCOLS
- **TTS (Audio Brief)**: The Audio Brief button MUST call `smasService.generateSpeech` using `gemini-2.5-flash-preview-tts`.
- **Image Editing**: File uploads must trigger base64 conversion and call `smasService.editImage`.
- **Grounding extraction**: Every `gemini-3` call must extract and display `groundingMetadata`.
- **Relational-to-Vector Mapping**: L3 knowledge must be indexed in the vector store.
- **Baseline Comparison**: Benchmark runs MUST calculate lift percentages against raw LLM outputs.

## 3. DESIGN PHILOSOPHY
- **Forensic Aesthetic**: Use Indigo/Emerald/Amber glowing elements against high-contrast black/gray backgrounds.
- **Transparency**: Every component must use an `ExecutionStatusIndicator` (EXECUTED, EMULATED, SIMULATED).
- **No Mocking**: Use the real `rawCsvData` and `neuronasDataset` for all context retrieval.
