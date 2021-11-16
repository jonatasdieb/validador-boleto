const boletoBancario = require("./validaBoletoBancario");
const boletoConcessionaria = require("./validaBoletoConcessionaria");

function validarBoleto(linhaDigitavel) {
  validarCaracteres(linhaDigitavel);

  validarTamanhoDaLinhaDigitavel(linhaDigitavel);

  let info;

  if (linhaDigitavel.length == 48) {
    info = boletoConcessionaria.validarLinhaDigitavel(linhaDigitavel);
  } else if (linhaDigitavel.length == 47) {
    info = boletoBancario.validarLinhaDigitavel(linhaDigitavel);
  }

  return info;
}

function validarTamanhoDaLinhaDigitavel(linhaDigitavel) {
  if (linhaDigitavel.length != 47 && linhaDigitavel.length != 48) {
    throw new Error("Linha digitável inválida: tamanho incorreto");
  }
}

function validarCaracteres(linhaDigitavel) {
  let notNumbersRegex = /[^0-9]/g;

  if (linhaDigitavel.match(notNumbersRegex)) {
    throw new Error("Linha digitável inválida: digite apenas números");
  }
}

module.exports = {
  validarBoleto,
  validarCaracteres,
  validarTamanhoDaLinhaDigitavel,
};
