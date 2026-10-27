class PCMProcessor extends AudioWorkletProcessor {
    constructor() {
        super();

        this.outputSamples = [];
        this.phase = 0;
        this.targetRate = 16000;
        this.chunkSize = 1600;
    }

    process(inputs) {
        const input = inputs[0];

        if (!input || !input[0]) {
            return true;
        }

        const samples = input[0];

        // Convert the input sample rate to 16 kHz.
        // The phase accumulator supports common browser rates,
        // including 44.1 kHz and 48 kHz.
        for (let i = 0; i < samples.length; i++) {
            this.phase += this.targetRate;

            if (this.phase >= sampleRate) {
                this.phase -= sampleRate;
                this.outputSamples.push(samples[i]);
            }
        }

        while (this.outputSamples.length >= this.chunkSize) {
            const chunk = this.outputSamples.splice(0, this.chunkSize);
            const pcm = new Int16Array(this.chunkSize);

            for (let i = 0; i < chunk.length; i++) {
                const sample = Math.max(-1, Math.min(1, chunk[i]));

                pcm[i] = sample < 0
                    ? sample * 32768
                    : sample * 32767;
            }

            this.port.postMessage(pcm.buffer, [pcm.buffer]);
        }

        return true;
    }
}

registerProcessor("pcm-processor", PCMProcessor);