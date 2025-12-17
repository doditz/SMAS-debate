
// services/audioUtils.ts

// Helper to decode base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// Helper to convert raw PCM data to an AudioBuffer
async function pcmToAudioBuffer(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000, // Gemini TTS default
    numChannels: number = 1
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            // Convert 16-bit PCM to float [-1.0, 1.0]
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

class AudioPlayer {
    private audioContext: AudioContext | null = null;
    private currentSource: AudioBufferSourceNode | null = null;
    private isPlaying: boolean = false;

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        return this.audioContext;
    }

    public async play(base64Audio: string, onEnded?: () => void) {
        try {
            // Stop any current playback
            this.stop();

            const ctx = this.getContext();
            
            // Resume context if suspended (browser policy)
            if (ctx.state === 'suspended') {
                await ctx.resume();
            }

            const pcmBytes = base64ToUint8Array(base64Audio);
            const audioBuffer = await pcmToAudioBuffer(pcmBytes, ctx);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            
            source.onended = () => {
                this.isPlaying = false;
                this.currentSource = null;
                if (onEnded) onEnded();
            };

            this.currentSource = source;
            this.isPlaying = true;
            source.start();

        } catch (error) {
            console.error("Error playing audio:", error);
            this.isPlaying = false;
        }
    }

    public stop() {
        if (this.currentSource) {
            try {
                this.currentSource.stop();
            } catch (e) {
                // Ignore errors if already stopped
            }
            this.currentSource = null;
        }
        this.isPlaying = false;
    }

    public get active() {
        return this.isPlaying;
    }
}

export const audioPlayer = new AudioPlayer();
