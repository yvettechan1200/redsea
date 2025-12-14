
// Web Audio API Engine for The Red Sea
// Pure synthesis, no external assets required.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

// Track active oscillators/nodes to stop them when switching levels
let activeNodes: AudioNode[] = [];
let ambientInterval: number | null = null;

// Initialize Audio Context (Must be called on user interaction)
export const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.4; // Master volume
        masterGain.connect(audioCtx.destination);
    } else if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const stopCurrentAmbience = () => {
    activeNodes.forEach(node => {
        try {
            // @ts-ignore
            if (node.stop) node.stop();
            node.disconnect();
        } catch (e) { /* ignore */ }
    });
    activeNodes = [];
    if (ambientInterval) {
        clearInterval(ambientInterval);
        ambientInterval = null;
    }
};

// --- NOISE GENERATOR UTILITY ---
const createNoiseBuffer = () => {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds of noise
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        // Pink-ish noise approximation
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // Compensate for gain loss
    }
    return buffer;
};
let lastOut = 0;

// --- AMBIENCE ---

export const playAmbient = (levelId: number) => {
    if (!audioCtx || !masterGain) return;
    stopCurrentAmbience();

    const now = audioCtx.currentTime;

    if (levelId === 1) {
        // LEVEL 1: Low Frequency Hum (The Room)
        // Oscillator 1: Deep drone
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.value = 60; // 60Hz hum
        gain1.gain.value = 0.15;
        
        osc1.connect(gain1);
        gain1.connect(masterGain);
        osc1.start();
        activeNodes.push(osc1, gain1);

        // Oscillator 2: Uncomfortable detuned overtone
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = 118; // Slightly off harmonic
        gain2.gain.value = 0.05;

        osc2.connect(gain2);
        gain2.connect(masterGain);
        osc2.start();
        activeNodes.push(osc2, gain2);
    } 
    else if (levelId === 2) {
        // LEVEL 2: Digital High Pitch & Glitches
        // Base high whine
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = 14000; // Very high pitch, almost imperceptible anxiety
        gain.gain.value = 0.02;
        
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        activeNodes.push(osc, gain);

        // Random Glitch Interval
        ambientInterval = window.setInterval(() => {
            if (!audioCtx || !masterGain) return;
            const glitchOsc = audioCtx.createOscillator();
            const glitchGain = audioCtx.createGain();
            
            glitchOsc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
            // Random computer frequencies
            glitchOsc.frequency.value = 800 + Math.random() * 2000; 
            
            glitchGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
            glitchGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

            glitchOsc.connect(glitchGain);
            glitchGain.connect(masterGain);
            
            glitchOsc.start();
            glitchOsc.stop(audioCtx.currentTime + 0.1);
        }, 800 + Math.random() * 2000); // Trigger every 0.8 - 2.8s
    }
    else if (levelId === 3) {
        // LEVEL 3: The Red Sea (Waves/Static)
        const noiseBuffer = createNoiseBuffer();
        if (!noiseBuffer) return;

        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Muffled underwater sound

        const waveGain = audioCtx.createGain();
        waveGain.gain.value = 0.2;

        // LFO to simulate wave motion
        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.15; // Slow waves (6-7 seconds)
        
        // Modulate filter frequency for "whoosh" effect
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 200; 

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        noiseSrc.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(masterGain);

        noiseSrc.start();
        lfo.start();

        activeNodes.push(noiseSrc, filter, waveGain, lfo, lfoGain);
    }
};

// --- SFX ---

export const playThornSFX = () => {
    if (!audioCtx || !masterGain) return;
    const t = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // Sharp, abrasive error sound
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.3); // Quick drop
    
    // Add some dissonance
    osc.detune.setValueAtTime(Math.random() * 100, t);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);
    
    osc.start(t);
    osc.stop(t + 0.3);
};

export const playVoidSFX = () => {
    if (!audioCtx || !masterGain) return;
    const t = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Deep, submerging sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 2.0); // Long slow drop

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 2.0);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 2.0);
};

export const playMaskSFX = () => {
    if (!audioCtx || !masterGain) return;
    const t = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Simple mechanical click
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
};
