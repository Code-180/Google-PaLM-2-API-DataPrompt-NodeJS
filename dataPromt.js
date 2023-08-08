const express = require('express');
require('dotenv').config()
const app = express();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const {
    TextServiceClient,
    DiscussServiceClient
} = require("@google-ai/generativelanguage");
const {
    GoogleAuth
} = require("google-auth-library");
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const API_KEY = process.env.API_KEY;
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// const Word = 'Wrong';
// const promptString = `Find a word or phrase with opposite meaning.
// Word: Strong
// Opposite: Weak
// Word: Thick
// Opposite: Thin
// Word: Sparse
// Opposite: Dense
// Word: Sloppy
// Opposite: Organized
// Word: ${Word}
// Opposite:`;

const Location = 'India ME';
const promptString = `Speak as if you are a travel agent, sharing a general overview without bullets about a location.
Location: Athens
Description: Athens, the capital of Greece, is a city with a rich history and culture. It is home to many ancient ruins, including the Acropolis. The Acropolis is a hilltop citadel that was once the center of ancient Athens. 

Athens is also home to many museums, including the National Archaeological Museum, which is one of the largest museums in Greece. The museum houses a collection of artifacts from ancient Greece, including sculptures, pottery, and jewelry.

Athens is a great city to visit for a weekend getaway or a longer vacation. There is something for everyone in Athens, from history and culture to nightlife and festivals.
Excited Voice: Athens is rich in history and culture! It is home to a ton of ruins, some amazing museums, and some of the coolest artifacts in the world!
Location: Temecula
Description: Temecula is located in the Temecula Valley, which is a popular destination for wine tasting, golfing, and other outdoor activities. 

The city is also home to several historical sites, including the Temecula Valley Museum and the Old Town Temecula Historic District.
Excited Voice: Temecula is an amazing visit while visiting the valley for wine, golf or other outdoor excursions! Check out the historic district, you'll be glad you did.
Location: Troy Michigan
Description: Troy is a diverse city with a population of over 87,000 people. Troy is also home to a number of colleges and universities, including the Carnegie Institute and Walsh College.

Troy is a popular destination for shopping, dining, and entertainment. The city is home to the Somerset Collection, a large shopping mall, and a number of restaurants and bars. 

Troy is also home to a number of theaters, including the Troy Performing Arts Center.
Excited Voice: Troy Michigan is a hub for education and learning, home to many colleges and universities. While you're here to learn, make sure to check out all the great shopping as well!
Location: ${Location}
Description:`;

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const stopSequences = [];
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get('/data-prompt', (req, res) => {
    client.generateText({
        // required, which model to use to generate the result
        model: 'models/text-bison-001',
        // optional, 0.0 always uses the highest-probability result
        temperature: 0.7,
        // optional, how many candidate results to generate
        candidateCount: 1,
        // optional, number of most probable tokens to consider for generation
        top_k: 40,
        // optional, for nucleus sampling decoding strategy
        top_p: 0.95,
        // optional, maximum number of output tokens to generate
        max_output_tokens: 1024,
        // optional, sequences at which to stop model generation
        stop_sequences: stopSequences,
        // optional, safety settings
        safety_settings: [{
            "category": "HARM_CATEGORY_DEROGATORY",
            "threshold": 1
        }, {
            "category": "HARM_CATEGORY_TOXICITY",
            "threshold": 1
        }, {
            "category": "HARM_CATEGORY_VIOLENCE",
            "threshold": 2
        }, {
            "category": "HARM_CATEGORY_SEXUAL",
            "threshold": 2
        }, {
            "category": "HARM_CATEGORY_MEDICAL",
            "threshold": 2
        }, {
            "category": "HARM_CATEGORY_DANGEROUS",
            "threshold": 2
        }],
        prompt: {
            text: promptString,
        },
    }).then(result => {
        console.log(JSON.stringify(result, null, 2));
    });
})
app.listen(3000, () => {
    console.log('Example app listening on port 3000')
})