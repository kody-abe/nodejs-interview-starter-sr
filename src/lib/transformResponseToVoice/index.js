const GOOGLE_VOICE_OPTIONS_DEFAULT = {
    voice: {
        languageCode: 'en-US',
        ssmlGender: 'FEMALE',
        name: 'en-US-Wavenet-F',
    },
    audioConfig: {
        audioEncoding: 'MP3',
    },
};

const AUDIO_ENCODING_TO_FILE_EXTENSION_MAPPER = {
    LINEAR16: 'wav',
    MP3: 'mp3',
    OGG_OPUS: 'ogg',
};
const AUDIO_FILE_EXPIRATION_DEFAULT = 300;

const _ = require('lodash');
const synthesizeSpeech = require('../synthesizeSpeech');

module.exports = (req, response, options) => {
    const baseOptions = _.merge({}, GOOGLE_VOICE_OPTIONS_DEFAULT, options);
    const audioFileExtension = AUDIO_ENCODING_TO_FILE_EXTENSION_MAPPER[baseOptions.audioConfig.audioEncoding];
    const voiceAudioBaseUrl = `${req.protocol}://${req.get('host')}/voiceAudio`;

    const promises = response.messages.map((messageData) => {
        const synthesizeSpeechOptions = Object.assign({}, baseOptions);

        synthesizeSpeechOptions.input = {
            text: messageData.payload.voice || messageData.payload.text,
        };

        console.log(synthesizeSpeechOptions)

        return synthesizeSpeech(synthesizeSpeechOptions);
    });

    return Promise.all(promises)
        .then((responses) => {
            responses.forEach((resp, idx) => {
                const fileId = 'test-id';
                const redisKey = `channel-connector:custom-channel:voice-file:${fileId}.${audioFileExtension}`;

                response.messages[idx].payload.voiceAudioUrl = `${voiceAudioBaseUrl}/${fileId}.${audioFileExtension}`;
            });

            return response;
        });
}