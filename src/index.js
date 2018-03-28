'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = '';

const languageStrings = {
    'de-DE': {
        'translation': {
            'SKILL_NAME': 'registrierkasse',
            'INTRO_MESSAGE': 'Ich bin bereit. Gib mir Zahlen oder rufe die Hilfe auf.',
            'HELP_MESSAGE': "Du kannst mit mir Beträge addieren und subtrahieren.",
            'HELP_REPROMPT': "Was möchtest Du wissen?",
            'STOP_MESSAGE': 'Tschüss'
        }
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var result = 0;

const handlers = {
    'LaunchRequest': function () {
        const introMessage = this.t('INTRO_MESSAGE');
        this.response.speak(introMessage).listen('');
        result = 0;
        this.emit(':responseReady');
    },

    'divideIntent': function () {
        const value = Number(this.event.request.intent.slots.numberValue.value);
        result /= value;
        const message = 'durch ' + value + ' ergibt ' + result;
        this.response.speak(message).listen('');

        this.emit(':responseReady');
    },

    'multiplyIntent': function () {
        const value = Number(this.event.request.intent.slots.numberValue.value);
        result *= value;
        const message = 'mal ' + value + ' ergibt ' + result;
        this.response.speak(message).listen('');

        this.emit(':responseReady');
    },

    'plusIntent': function () {
        const value = Number(this.event.request.intent.slots.numberValue.value);
        result += value;
        const message = 'plus ' + value + ' ergibt ' + result;
        this.response.speak(message).listen('');

        this.emit(':responseReady');
    },

    'minusIntent': function () {
        const value = Number(this.event.request.intent.slots.numberValue.value);
        result -= value;
        const message = 'minus ' + value + ' ergibt ' + result;
        this.response.speak(message).listen('');

        this.emit(':responseReady');
    },

    'resultIntent': function () {
        const message = 'Das Ergbnis ist ' + result;
        this.response.speak(message).listen('');

        this.emit(':responseReady');
    },

    'newIntent': function () {
        result = 0;
        this.response.speak('Okay, fangen wir wieder bei Null an.').listen('');

        this.emit(':responseReady');
    },

    'Unhandled': function() {
        this.emit(':ask', 'Ich habe Dich leider nicht verstanden.');
    },

    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t(HELP_MESSAGE);
        const reprompt = this.t(HELP_REPROMPT);
        this.emit(':ask', speechOutput, reprompt);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE));
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t(STOP_MESSAGE));
    }
};
