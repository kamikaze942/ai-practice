import OpenAI from "openai";
import { generateEmbeddings } from "../emb/main";
import { dotProduct } from "../emb/similar";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { CreateEmbeddingResponse } from "openai/resources/embeddings";

const openai = new OpenAI(); 

type movie = {
    title: string,
    description: string,
}

type MovieWithEmbedding = movie & { embedding: number[] };
const data = loadJSONData<movie[]>('Movies.json');

console.log('What movies do you like ?')
console.log('............')

process.stdin.addListener('data', async function (input) {
    const userInput = input.toString().trim();
    await recommendMovies(userInput);
})

async function recommendMovies(input: string) {
    const embedding = await generateEmbeddings(input);

    const descriptionEmbeddings = await getMovieEmbeddings(); 
    const moviesWithEmbeddings: MovieWithEmbedding[] = [];


    for (let i = 0; i < data.length; i++) {
        moviesWithEmbeddings.push({
            title: data[i].title,
            description: data[i].description,
            embedding: descriptionEmbeddings.data[i].embedding
        });
    }

    const similarities: {input: string, similarity: number }[] = [];

    for(const movie of moviesWithEmbeddings){
        const similarity = dotProduct(
            movie.embedding, 
            embedding.data[0].embedding,
        )
        similarities.push({
            input: movie.title,
            similarity
        });
    }

    console.log(`if you like ${input} we recommend: `);
    console.log('..........');

    const sortedSimilarities = similarities.sort((a,b) => b.similarity - a.similarity);
    const topTen = sortedSimilarities.slice(0, 10);
    topTen.forEach(similarity => {
        console.log(`${similarity.input}: ${similarity.similarity}`);
    });
    // sortedSimilarities.forEach(similarity => {
    //     console.log(`${similarity.input}: ${similarity.similarity}`);
    // });
}

async function getMovieEmbeddings(){
    const fileName = 'movieEmbeddings.json';
    const filePath = join(__dirname, fileName);
    if(existsSync(filePath)) {
        const descriptionEmbeddings = loadJSONData<CreateEmbeddingResponse>(fileName);
        return descriptionEmbeddings;
    } else {
        const descriptionEmbeddings = await generateEmbeddings(data.map(d => d.description));
        saveDataToJsonFile(descriptionEmbeddings, fileName);
        return descriptionEmbeddings;
    }
}

function loadJSONData<T>(fileName: string):T{
    const path = join(__dirname, fileName);
    const rawData = readFileSync(path);
    return JSON.parse(rawData.toString());
}

function saveDataToJsonFile(data: any, fileName: string){
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const path = join(__dirname, fileName);
    writeFileSync(path, dataBuffer);
    console.log(`saved data to ${fileName}`);
}
