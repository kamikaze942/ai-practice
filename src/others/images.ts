import { OpenAI } from 'openai';
import { writeFileSync, createReadStream, readFileSync } from 'fs';
const openai = new OpenAI(); 

async function generateCheapImage() {
    const res = await openai.images.generate({
        prompt: 'A photo of the card for mega gengar ex from the recent pokemon mega evolutions set in japan.', 
        model: 'dall-e-2',
        // style: 'vivid',
        size:  '256x256',
        // quality: 'standard',
        n: 1
    });
    console.log(res);
}

async function generateCheapLocalImage() {
    const res = await openai.images.generate({
        prompt: 'A photo of the Mega Gengar ex card from the pokemon set MBG out of japan.', 
        model: 'dall-e-2',
        // style: 'vivid',
        size:  '256x256',
        // quality: 'standard',
        n: 1,
        response_format: 'b64_json'
    });
    // const rawImage = res?.data?[0].b64_json;
    const rawImage = res?.data?.[0].b64_json;
    if (rawImage) {
        writeFileSync('gengar.png', Buffer.from(rawImage, 'base64'));
    }
}

async function generateAdvancedImage() {
    const res = await openai.images.generate({
        prompt: 'A photo of the Mega Gengar ex card from the pokemon set MBG out of japan.', 
        model: 'dall-e-3',
        style: 'vivid',
        size:  '1024x1024',
        quality: 'hd',
        response_format: 'b64_json'
    });
    // const rawImage = res?.data?[0].b64_json;
    const rawImage = res?.data?.[0].b64_json;
    if (rawImage) {
        writeFileSync('gengarHD.png', Buffer.from(rawImage, 'base64'));
    }
}

async function generateImageVariation() {
    const res = await openai.images.createVariation({
        image: createReadStream('gengar.png'),
        // prompt: 'A photo of the Mega Gengar ex card from the pokemon set MBG out of japan.', 
        model: 'dall-e-2',
        // style: 'vivid',
        // size:  '1024x1024',
        //quality: 'hd',
        response_format: 'b64_json',
        n: 1
    });
    // const rawImage = res?.data?[0].b64_json;
    const rawImage = res?.data?.[0].b64_json;
    if (rawImage) {
        writeFileSync('gengarVariation.png', Buffer.from(rawImage, 'base64'));
    }
}
function makeFile(path: string) {
  const buffer = readFileSync(path);
  return new File([buffer], path.split("/").pop()!, { type: "image/png" });
}

async function editImage() {
    const res = await openai.images.edit({
        image: makeFile('gengar.png'),
        mask: makeFile('gengarMask.png'),
        prompt: 'Remove the human hand from the image, rotate the card so its straight up an down, and then change the name of the card to "Mark\'s Gengar"', 
        model: 'dall-e-2',
        // style: 'vivid',
        // size:  '1024x1024',
        //quality: 'hd',
        response_format: 'b64_json',
        n: 1
    });

    const rawImage = res?.data?.[0].b64_json;
    if (rawImage) {
        writeFileSync('gengarFixed.png', Buffer.from(rawImage, 'base64'));
    }
}
//generateCheapImage();
// generateCheapLocalImage();
// generateAdvancedImage();
// generateImageVariation();

editImage();