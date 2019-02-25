const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_PORT;

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const api = require('./lib/api');
const transformResponseToVoice = require('./lib/transformResponseToVoice');
const app = express();

app.use(bodyParser.json({
    verify: (req, res, buffer) => {
        req.rawBody = buffer.toString('utf8');
    },
}));

app.post('/hello-world', (req, res) => {
    const voiceAudioResponseEngine = _.get(req.body, 'voiceAudioResponse.engine');

    api.getThatThing()
        .then((apiResponse) => {
            if (voiceAudioResponseEngine === 'GOOGLE') {
                const voiceAudioOptions = _.get(req.body, 'voiceAudioResponse.options');

                apiResponse = transformResponseToVoice(req, apiResponse, voiceAudioOptions);
            }

            res.send(apiResponse);
        })
}); 

app.use((err, req, res, next) => {
    res.status(500).json({error: typeof err === 'string' ? err : err.message});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));