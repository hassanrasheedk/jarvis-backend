var express = require('express');
var router = express.Router();
const { Configuration, OpenAIApi } = require("openai");// 1. Import the OpenAI package
var textToSpeech = require('../helpers/tts');
// 2. Load the OpenAI API key from the environment

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


async function callWhisper(text) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    // prompt: 'suggest me how to find a girlfriend in bavaria',
    prompt: text,
    max_tokens: 50,
    temperature: 0.5,
    top_p: 1
  });
  return response.data.choices[0].text;
}


/* GET home page. */
router.post('/talk', async function(req, res, next) {
  
  const reply = await callWhisper(req.body.text); // Call the function

  textToSpeech(reply, req.body.voice)
  .then(result => {
    res.json(result);    
  })
  .catch(err => {
    res.json({});
  });


});

module.exports = router;
