

import { OpenAI } from 'openai'
import { encoding_for_model } from 'tiktoken'
const openai = new OpenAI(); 

async function main() {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            //{
            //     role: 'system',
            //     content: 'You respond like a cool person, and you return json format with 2 properties: ' +
            //     '1. coolness level: 1- 100, 2. answer: the answer'
            // },
            // {
            //     role: 'user',
            //     content: 'How tall is mount ev'
            // }
            {
                role: 'user',
                content: 'Say something cool in 200 words or less',
            }
        ],
        // n: 2,
        max_tokens: 100,
    });

    console.log(response.choices[0].message.content);
}

function encodePrompt () {
    const prompt = 'How are you today?';
    const encodder = encoding_for_model('gpt-3.5-turbo');
    const words = encodder.encode(prompt);
    console.log(words);
}
//encodePrompt();
main();