import { OpenAI } from 'openai';
import { writeFileSync, createReadStream, readFileSync } from 'fs';
const openai = new OpenAI(); 

async function createTranscription() {
    const res = await openai.audio.transcriptions.create({
        file: createReadStream('audio_message.mp4'),
        model: 'whisper-1',
        language: 'en',
    });

    console.log(res);
}

async function translate() {
    const res = await openai.audio.translations.create({
        file: createReadStream('FrenchSample.m4a'),
        model: 'whisper-1',
    });

    console.log(res);
}

async function textToSpeech() {
    const sample = "I love my family very much and they are the best.";
    const res = await openai.audio.speech.create({
        input: sample,
        voice: 'onyx',
        model: 'tts-1',
        response_format: 'mp3',
    })
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync('myTestSpeech.mp3', buffer);
}
//translate();
textToSpeech();