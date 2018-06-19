const Alexa = require('alexa-sdk')

const APP_ID = '';

const languageStrings = {
  'de-DE': {
    'translation': {
      'SKILL_NAME': 'Registrierkasse',
      'INTRO_MESSAGE': 'Ich bin bereit. Gib mir etwas zu rechnen oder rufe die Hilfe auf.',
      'HELP_MESSAGE': `Du kannst mit mir Beträge addieren, subtrahieren, multiplizieren und 
                       dividieren. Verwende dazu die Befehle plus, minus, mal und durch und eine Zahl. Sage z.B. einfach plus 4`,
      'HELP_REPROMPT': 'Was möchtest Du wissen?',
      'STOP_MESSAGE': 'Vielen Dank und Tschüss'
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

let result = 0;

const handlers = {
  'LaunchRequest': function () {
    const introMessage = this.t('INTRO_MESSAGE');
    this.response.speak(introMessage).listen('');
    result = 0;
    this.emit(':responseReady');
  },

  'divideIntent': function () {
    const handeled = handleNoNumber(this)
    if (!handeled.message) {
      const value = Number(handeled.value);
      result /= value;
      handeled.message = 'durch ' + value + ' ergibt ' + result;
    }
    this.response.speak(handeled.message).listen('');
    this.emit(':responseReady');
  },

  'multiplyIntent': function () {
    const handeled = handleNoNumber(this)
    if (!handeled.message) {
      const value = Number(handeled.value);
      result *= value;
      handeled.message = 'mal ' + value + ' ergibt ' + result;
    }
    this.response.speak(handeled.message).listen('');
    this.emit(':responseReady');
  },

  'plusIntent': function () {
    const handeled = handleNoNumber(this)
    if (!handeled.message) {
      const value = Number(handeled.value);
      result += value;
      handeled.message = 'plus ' + value + ' ergibt ' + result;
    }
    this.response.speak(handeled.message).listen('');
    this.emit(':responseReady');
  },

  'minusIntent': function () {
    const handeled = handleNoNumber(this)
    if (!handeled.message) {
      const value = Number(handeled.value);
      result -= value;
      handeled.message = 'minus ' + value + ' ergibt ' + result;
    }
    this.response.speak(handeled.message).listen('');
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

  'Unhandled': function () {
    this.emit(':ask', 'Ich habe Dich leider nicht verstanden.');
  },

  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_REPROMPT');
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },

  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  }
};

const handleNoNumber = instance => {
  const value = instance.event.request.intent.slots.numberValue.value
  let message
  if (isNaN(value)) {
    message = `${rawValue} ist keine Zahl. Versuche es nocheinmal.`
  }
  return {value, message}
}