
// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ChatMessage } from './components/ChatMessage';
import { UserProfile } from './components/UserProfile';
import { DebateVisualizer } from './components/DebateVisualizer';
import { SmasConfigControls } from './components/SmasConfigControls';
import { AssessmentControls } from './components/AssessmentControls';
import { QueryHistory } from './components/QueryHistory';
import { DevelopmentTestRunner } from './components/BenchmarkRunner'; 
import { RealtimeMetricsMonitor } from './components/RealtimeMetricsMonitor';
import { EthicalGovernanceMonitor } from './components/EthicalGovernanceMonitor';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { WhitepaperModal } from './components/WhitepaperModal';
import { developmentTests } from './data/benchmarkQueries'; 
import smasService from './services/smasService';
import realtimeMetricsService from './services/realtimeMetricsService';
import memorySystemService from './services/memorySystemService'; 
import { audioPlayer } from './services/audioUtils';

import type {
    AppStatus, User, SmasConfig, Assessment, 
    DebateState, QueryHistoryItem, DevelopmentTest, BatchResult, RealtimeMetrics, ConnectionStatus, HomeostasisConfig, AttachedImage, AutoOptimizerConfig, ExecutionState
} from './types';
import { FactCheckDisplay } from './components/FactCheckDisplay';
import { SynergyMonitor } from './components/SynergyMonitor';
import { InteractiveValidationPanel } from './components/InteractiveValidationPanel';
import { TestRunSummaryModal } from './components/BenchmarkSummaryModal'; 
import DebateFlow from './components/DebateFlow';
import { ArchitectsLabNotebook } from './components/ArchitectsLabNotebook';
import CognitiveDegradationMonitor from './components/CognitiveDegradationMonitor';
import { CognitiveArchitectControls } from './components/CognitiveArchitectControls';
import { ModeToggle } from './components/ModeToggle';
import { D3stibVisualizer } from './components/D3stibVisualizer';
import { ImageResultDisplay } from './components/ImageResultDisplay';
import { CognitiveDissentDashboard } from './components/CognitiveDissentDashboard';
import { AutoOptimizerControls } from './components/AutoOptimizerControls';
import { ArchitectureOptimizationLab } from './components/ArchitectureOptimizationLab';
import { Bars3Icon, SpeakerWaveIcon, StopIcon, SignalIcon, ExclamationTriangleIcon, HandThumbUpIcon } from './components/Icons';


const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the mime type part: 'data:image/png;base64,'
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });

const DEFAULT_SMAS_CONFIG: SmasConfig = { maxPersonas: 5, debateRounds: 3, hemisphereWeights: { alpha: 0.33, beta: 0.33, gamma: 0.34 }};
const DEFAULT_ASSESSMENT: Assessment = { semanticFidelity: 0.85, reasoningScore: 0.9, creativityScore: 0.75 };

const App: React.FC = () => {
    const [status, setStatus] = useState<AppStatus>('idle');
    const [query, setQuery] = useState('');
    const [user, setUser] = useState<User | null>(null);
    
    // Initialize from LocalStorage or defaults
    const [smasConfig, setSmasConfig] = useState<SmasConfig>(() => {
        const saved = localStorage.getItem('neuronas_smasConfig');
        return saved ? JSON.parse(saved) : DEFAULT_SMAS_CONFIG;
    });

    const [assessment, setAssessment] = useState<Assessment>(() => {
        const saved = localStorage.getItem('neuronas_assessment');
        return saved ? JSON.parse(saved) : DEFAULT_ASSESSMENT;
    });
    
    const [history, setHistory] = useState<QueryHistoryItem[]>(() => {
        const saved = localStorage.getItem('neuronas_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [homeostasisConfig, setHomeostasisConfig] = useState<HomeostasisConfig>({ efficiencyVsDepth: 0.6, pruningAggressiveness: 0.5, ethicalFloor: 0.58 });
    const [autoOptimizerConfig, setAutoOptimizerConfig] = useState<AutoOptimizerConfig>({ enabled: true, d2Modulation: 0.5 });


    const [debateState, setDebateState] = useState<DebateState | null>(null);
    const [finalResponse, setFinalResponse] = useState<string | null>(null);
    const [valueAnalysis, setValueAnalysis] = useState<BatchResult['valueAnalysis'] | null>(null);

    const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);

    // Audio State
    const [audioData, setAudioData] = useState<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
    const [isTestSummaryOpen, setIsTestSummaryOpen] = useState(false); 
    const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
    
    const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

    const [mode, setMode] = useState<'user' | 'architect'>('user');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSimulationMode, setIsSimulationMode] = useState(smasService.isSimulationMode);
    
    // Check if key is physically present
    const hasApiKey = smasService.hasApiKey;

    const isBusy = status === 'loading' || status === 'batch_running';

    // Determined Global Execution Mode for UI Tags
    const executionMode: ExecutionState = isSimulationMode ? 'SIMULATED' : 'EXECUTED';

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('neuronas_smasConfig', JSON.stringify(smasConfig));
    }, [smasConfig]);

    useEffect(() => {
        localStorage.setItem('neuronas_assessment', JSON.stringify(assessment));
    }, [assessment]);

    useEffect(() => {
        localStorage.setItem('neuronas_history', JSON.stringify(history));
    }, [history]);

    // Reactive Hooks for Real-time Services
    useEffect(() => {
        // Push Config changes to the Metrics Simulator to make it reactive
        realtimeMetricsService.updateConfig(smasConfig);
    }, [smasConfig]);

    useEffect(() => {
        // Push Debate Analysis concepts to the Memory Simulator
        if (debateState?.d3stibAnalysis?.tokens) {
            const concepts = debateState.d3stibAnalysis.tokens
                .filter(t => t.priority === 'FULL')
                .map(t => t.token);
            
            if (concepts.length > 0) {
                memorySystemService.ingestConcepts(concepts);
            }
        }
    }, [debateState?.d3stibAnalysis]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { // Tailwind's 'lg' breakpoint
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        realtimeMetricsService.startMonitoring({
            onMetrics: setMetrics,
            onStatusChange: setConnectionStatus,
        });
        return () => realtimeMetricsService.stopMonitoring();
    }, []);

    const resetState = useCallback(() => {
        setStatus('idle');
        setDebateState(null);
        setFinalResponse(null);
        setValueAnalysis(null);
        setQuery('');
        setAttachedImage(null);
        setEditedImage(null);
        // Reset Audio
        setAudioData(null);
        setIsGeneratingAudio(false);
        setIsPlayingAudio(false);
        audioPlayer.stop();
    }, []);

    const handleFileUpload = async (file: File) => {
        if (file.type.startsWith('image/')) {
            const base64 = await fileToBase64(file);
            setAttachedImage({ base64, file });
            setEditedImage(null);
            setFinalResponse(null);
            setDebateState(null);
        } else {
            alert('Please upload an image file.');
        }
    };

    const handleSend = async () => {
        if (!query.trim() || isBusy) return;
        
        resetState();
        setStatus('loading');

        try {
            if (attachedImage) {
                const result = await smasService.editImage(query, { base64: attachedImage.base64, mimeType: attachedImage.file.type });
                setEditedImage(result);
            } else {
                // Optimistic History Add (updated later)
                const newHistoryItem: QueryHistoryItem = {
                    id: new Date().toISOString(),
                    query,
                    timestamp: Date.now(),
                    assessment,
                    smasConfig,
                };
                setHistory(prev => [newHistoryItem, ...prev]);

                const finalState = await smasService.runSmasDebate(
                    query, 
                    smasConfig, 
                    assessment, 
                    (update) => {
                        setDebateState(prev => ({ ...prev, ...update } as DebateState));
                    },
                    autoOptimizerConfig,
                    !!attachedImage // Pass attachment status for Stop and Ask check
                );
                
                // Check if we hit a STOP_AND_ASK state
                if (finalState.status === 'stop_and_ask') {
                    setStatus('stopped');
                    // We don't set finalResponse, we let the visualizer or a modal handle it
                } else {
                    setFinalResponse(finalState.synthesis || "No synthesis was generated.");
                    setStatus('idle');
                }
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            setFinalResponse("An error occurred during the process. Please try again.");
        } finally {
            if (status !== 'stopped') setStatus('idle');
        }
    };

    const handleSelectHistory = (item: QueryHistoryItem) => {
        resetState();
        setQuery(item.query);
        setSmasConfig(item.smasConfig);
        setAssessment(item.assessment);
    };

    const handleSelectTest = (test: DevelopmentTest) => { 
        resetState();
        setQuery(test.question_text);
    };
    
    const handleRunAllTests = async () => { 
        setStatus('batch_running');
        setBatchResults([]);
        setIsTestSummaryOpen(true);
        for (const test of developmentTests) {
            const result = await smasService.runDevelopmentTest(test, smasConfig);
            setBatchResults(prev => [...prev, { test: test, ...result }]);
        }
        setStatus('idle');
    };

    const handleFeedback = (feedback: 'positive' | 'negative') => {
        console.log(`User feedback for current session: ${feedback}`);
    };

    const handleAudioAction = async () => {
        if (isPlayingAudio) {
            audioPlayer.stop();
            setIsPlayingAudio(false);
            return;
        }

        if (audioData) {
            setIsPlayingAudio(true);
            await audioPlayer.play(audioData, () => setIsPlayingAudio(false));
            return;
        }

        if (finalResponse && !isGeneratingAudio) {
            setIsGeneratingAudio(true);
            try {
                const audio = await smasService.generateSynthesisAudio(finalResponse);
                setAudioData(audio);
                setIsPlayingAudio(true);
                await audioPlayer.play(audio, () => setIsPlayingAudio(false));
            } catch (e) {
                console.error("Failed to generate audio", e);
                alert("Failed to generate audio briefing.");
            } finally {
                setIsGeneratingAudio(false);
            }
        }
    };

    const toggleSimulationMode = () => {
        if (!hasApiKey) {
            alert("No API Key detected! The system is running in simulation mode. Please add your key to the project environment variables.");
            return;
        }
        const newState = !isSimulationMode;
        setIsSimulationMode(newState);
        smasService.setSimulationMode(newState);
    };


    return (
        <div className="bg-gray-900 h-screen text-gray-200 font-sans flex flex-col">
            <div className="w-full max-w-screen-2xl mx-auto flex flex-col flex-1 p-4 overflow-hidden">
                <header className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center space-x-2">
                         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-indigo-400">NEURONAS AI</h1>
                        <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full hidden sm:inline">High-Fidelity Emulation</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={toggleSimulationMode}
                            disabled={!hasApiKey}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                !hasApiKey 
                                ? 'bg-red-500/10 text-red-400 border-red-500/50 opacity-70 cursor-not-allowed'
                                : isSimulationMode 
                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/20' 
                                    : 'bg-green-500/10 text-green-400 border-green-500/50 hover:bg-green-500/20'
                            }`}
                            title={!hasApiKey ? "API Key Missing - Simulation Only" : "Toggle Online/Simulation Mode"}
                        >
                            {!hasApiKey ? <ExclamationTriangleIcon className="w-3 h-3" /> : <SignalIcon className="w-3 h-3" />}
                            <span>{!hasApiKey ? 'No API Key' : (isSimulationMode ? 'Simulation Active' : 'Online Mode')}</span>
                        </button>
                        <ModeToggle mode={mode} setMode={setMode}/>
                        <button onClick={() => setIsWhitepaperOpen(true)} className="text-sm text-gray-400 hover:text-white">Whitepaper</button>
                        <UserProfile user={user} onLogin={setUser} onLogout={() => setUser(null)} />
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden gap-4">
                    {/* Collapsible Sidebar */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.aside
                                key="sidebar"
                                initial={{ width: 0, opacity: 0, x: -50 }}
                                animate={{ width: 320, opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: -50 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="w-80 flex-shrink-0"
                            >
                                <div className="h-full overflow-y-auto space-y-4 pr-2">
                                    {mode === 'user' ? (
                                        <>
                                            <AssessmentControls assessment={assessment} setAssessment={setAssessment} disabled={isBusy} />
                                            <SmasConfigControls config={smasConfig} setConfig={setSmasConfig} disabled={isBusy} />
                                            <QueryHistory history={history} onSelect={handleSelectHistory} onClear={() => setHistory([])} disabled={isBusy} />
                                            <DevelopmentTestRunner tests={developmentTests} onSelect={handleSelectTest} onRunAll={handleRunAllTests} disabled={isBusy} />
                                            <RealtimeMetricsMonitor metrics={metrics} connectionStatus={connectionStatus} executionMode={executionMode} />
                                            <EthicalGovernanceMonitor governance={debateState?.governance} executionMode={executionMode} />
                                            <MemoryVisualizer executionMode={executionMode} />
                                        </>
                                    ) : (
                                        <>
                                            <CognitiveArchitectControls 
                                                smasConfig={smasConfig} setSmasConfig={setSmasConfig}
                                                homeostasisConfig={homeostasisConfig} setHomeostasisConfig={setHomeostasisConfig}
                                                disabled={isBusy}
                                            />
                                            <AutoOptimizerControls 
                                                config={autoOptimizerConfig} 
                                                setConfig={setAutoOptimizerConfig}
                                                disabled={isBusy}
                                            />
                                            <ArchitectsLabNotebook disabled={isBusy} />
                                            <DevelopmentTestRunner tests={developmentTests} onSelect={handleSelectTest} onRunAll={handleRunAllTests} disabled={isBusy} />
                                            <DebateFlow debateState={debateState} executionMode={executionMode} />
                                            <CognitiveDegradationMonitor debateState={debateState} executionMode={executionMode} />
                                        </>
                                    )}
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>
                    
                    {/* Main Content */}
                    <main className="flex-1 flex flex-col min-w-0">
                        <div className="bg-gray-800 rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                {debateState?.status === 'stop_and_ask' ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-8 bg-red-900/10 rounded-lg border border-red-500/30">
                                        <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
                                        <h2 className="text-2xl font-bold text-red-400">Protocol 7.1 Violation</h2>
                                        <p className="text-lg text-gray-300 font-mono bg-black/30 p-4 rounded-md border border-gray-700">
                                            {debateState.stopAndAskReason}
                                        </p>
                                        <div className="bg-gray-800 p-4 rounded-lg text-left text-sm text-gray-400 max-w-lg">
                                            <p className="font-semibold text-gray-200 mb-2">SYSTEM HALT: Missing Resource Detected</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>The prompt references a file or specific context that is not available.</li>
                                                <li>To prevent hallucination, the system has triggered a hard stop.</li>
                                                <li><strong>Action:</strong> Please upload the required file or clarify the context.</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {mode === 'architect' && !debateState && !attachedImage && !finalResponse ? (
                                            <ArchitectureOptimizationLab executionMode={executionMode} />
                                        ) : (
                                            <>
                                                {!attachedImage && <DebateVisualizer debateState={debateState} onClear={resetState} />}
                                                {!attachedImage && (
                                                    <D3stibVisualizer 
                                                        analysis={debateState?.d3stibAnalysis || null} 
                                                        metrics={debateState?.complexityMetrics}
                                                        userConfig={smasConfig}
                                                        effectiveConfig={debateState?.effectiveConfig} 
                                                        activeHyperparameters={debateState?.activeHyperparameters}
                                                        executionMode={executionMode}
                                                    />
                                                )}
                                                
                                                {attachedImage && !editedImage && (
                                                    <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                                                        <h3 className="font-semibold text-indigo-300 mb-2">Image Ready for Editing</h3>
                                                        <img src={`data:${attachedImage.file?.type};base64,${attachedImage.base64}`} alt="To be edited" className="rounded-lg max-h-80 mx-auto" />
                                                    </div>
                                                )}
                                                {editedImage && attachedImage && (
                                                    <ImageResultDisplay original={attachedImage.base64} edited={editedImage} originalMimeType={attachedImage.file?.type} />
                                                )}

                                                {!attachedImage && !finalResponse && !editedImage && (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <p>Attach an image to start editing.</p>
                                                        <p className="text-sm mt-2">Use the paperclip icon in the message bar below.</p>
                                                    </div>
                                                )}

                                                {!attachedImage && <SynergyMonitor analysis={valueAnalysis} executionMode={executionMode} />}
                                                {debateState?.validation && !attachedImage && <CognitiveDissentDashboard validation={debateState.validation} executionMode={executionMode} />}
                                                {finalResponse && !attachedImage && (
                                                     <div className="bg-gray-900/50 rounded-lg p-4 border border-indigo-500/20">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="font-semibold text-indigo-300">Final Synthesized Response</h3>
                                                            <button 
                                                                onClick={handleAudioAction}
                                                                disabled={isGeneratingAudio}
                                                                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                                    isPlayingAudio ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' : 
                                                                    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 hover:bg-indigo-500/30'
                                                                } disabled:opacity-50`}
                                                            >
                                                                {isGeneratingAudio ? (
                                                                    <span className="animate-pulse">Generating...</span>
                                                                ) : isPlayingAudio ? (
                                                                    <>
                                                                        <StopIcon className="w-3 h-3" />
                                                                        <span>Stop Briefing</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <SpeakerWaveIcon className="w-3 h-3" />
                                                                        <span>Audio Briefing</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                        <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: finalResponse.replace(/\n/g, '<br />') }} />
                                                     </div>
                                                )}
                                                {debateState?.factCheckSources && debateState.factCheckSources.length > 0 && <FactCheckDisplay sources={debateState.factCheckSources} executionMode={executionMode} />}
                                                {finalResponse && <InteractiveValidationPanel disabled={isBusy} onFeedback={handleFeedback} />}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <ChatMessage 
                                query={query} setQuery={setQuery} 
                                onSend={handleSend} onReset={resetState} 
                                disabled={isBusy} status={status}
                                attachedImage={attachedImage}
                                onFileUpload={handleFileUpload}
                                onRemoveImage={() => setAttachedImage(null)}
                            />
                        </div>
                    </main>
                </div>
            </div>

            <WhitepaperModal isOpen={isWhitepaperOpen} onClose={() => setIsWhitepaperOpen(false)} />
            <TestRunSummaryModal isOpen={isTestSummaryOpen} onClose={() => setIsTestSummaryOpen(false)} results={batchResults} />
        </div>
    );
};

export default App;
