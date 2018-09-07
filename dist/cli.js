#!/usr/bin/env node

'use strict';

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _safe = require('colors/safe');

var _ramda = require('ramda');

var _cobranca = require('./cobranca');

var _cobranca2 = _interopRequireDefault(_cobranca);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var emitSuccess = function emitSuccess(message) {
    return console.log((0, _safe.green)(' Ligando: ' + message));
};
var emitError = function emitError(message) {
    return console.log((0, _safe.red)(' \u2717 Erro: ' + message));
};

function cli(args) {
		(0, _cobranca2.default)(args).then(function () {
	    emitSuccess(args.sms ? 'sms enviado!' : 'chamada efetuada!');
		}).catch((0, _ramda.pipe)((0, _ramda.prop)('message'), emitError));
}


cli(_yargs2.default.usage('Uso: ligar-cobranca --de=<de> --para=<para> --texto="<texto>"').option('token', {
    describe: 'Token do TotalVoice',
    type: 'string'
}).option('de', {
    describe: 'Que número deve ligar?',
    type: 'string'
}).option('para', {
    describe: 'Qual o número da vítima?',
    type: 'string'
}).option('sms', {
    describe: 'Se definido, será enviado um SMS ao invés de uma chamada',
    type: 'boolean'
}).option('texto', {
    describe: 'Adicione um texto "Parem de me ligar!"',
    type: 'string'
}).demandOption(['para', 'token', 'texto']).locale('pt_BR').strict().help().version().argv);