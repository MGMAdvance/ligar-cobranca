'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = cobranca;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _superagentPromise = require('superagent-promise');

var _superagentPromise2 = _interopRequireDefault(_superagentPromise);

var txtomp3 = require("./index.js");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var request = (0, _superagentPromise2.default)(_superagent2.default, _bluebird2.default);
var route = function route(path) {
    return 'https://api.totalvoice.com.br' + path;
};

var cobrancaInText = 'PODERÁ SER PROTOCOLADO A PETIÇÃO EXTRA JUDICIAL REFERENTE AO NÃO CUMPRIMENTO DO SEU COMPROMISSO.';

var sms = function sms(to, token) {
    return request.post(route('/sms')).set('Access-Token', token).set('Accept', 'application/json').send({ numero_destino: to, mensagem: cobrancaInText });
};

var call = function call(from, to, token, texto) {
    
    txtomp3.saveMP3(texto, "voz.mp3", function(err, absoluteFilePath){
            if(err){
            console.log(err);
            return absoluteFilePath;
        }
        console.log("Mp3 Salvo: ", absoluteFilePath); //"File saved : /path/voz.mp3"
        
    
        return request.post(route('/composto')).set('Access-Token', token).set('Accept', 'application/json').send({
            numero_destino: to,
            dados: [{
                acao: 'audio',
                acao_dados: {
                    url_audio: absoluteFilePath
                }
            }],
            bina: from
        });
    });
};

function cobranca(args) {
    if (!/^[a-f0-9]{32}$/.test(args.token)) {
        return (0, _bluebird.reject)(new Error('Token inválido. Obtenha um em https://totalvoice.com.br'));
    }

    if (!/^[0-9]{10,11}$/.test(args.para)) {
        return (0, _bluebird.reject)(new Error('Número de telefone inválido'));
    }

    var action = args.sms ? sms(args.para, args.token) : call(args.de, args.para, args.token, args.texto);

    return action.catch(function (err) {
        if (err.status === 405 || err.status === 403) {
            return (0, _bluebird.reject)(new Error((err.body || err.response.body).mensagem));
        }

        return (0, _bluebird.reject)(err);
    });
}