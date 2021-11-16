const { validarDigitosVerificadoresLinhaDigitavel } = require("../../src/utils/validaBoletoBancario");
const {
  validarCaracteres,
  validarTamanhoDaLinhaDigitavel,
} = require("../../src/utils/validarBoleto");

const {boletoBancario} = require('./mock');

test("não deve aceitar outros caracteres além de números na linha digitável", () => {
  try {
    validarCaracteres(boletoBancario.linhaDigitavelComCaracteresInvalidos);
  } catch (error) {
    expect(error.message).toBe(
      "Linha digitável inválida: digite apenas números"
    );
  }
});

test("deve aceitar somente números", () => {
  validarCaracteres(boletoBancario.linhaDigitavelValida);
  expect(true).toBe(true);
});

test("deve aceitar linhas digitaveis de 47 ou 48 caracteres", () => {
  validarTamanhoDaLinhaDigitavel(boletoBancario.linhaDigitavelValida);
  expect(true).toBe(true);
});

test("não deve aceitar linhas digitaveis diferentes de 47 ou 48 caracteres", () => {
  try {
    validarTamanhoDaLinhaDigitavel(boletoBancario.linhaDigitavelComTamanhoInvalido);
  } catch (error) {
    expect(error.message).toBe("Linha digitável inválida: tamanho incorreto");
  }
});

test("não deve aceitar linhas digitaveis com digitos verificados inválidos", () => {
  try {
    validarDigitosVerificadoresLinhaDigitavel(boletoBancario.linhaDigitavelComTamanhoInvalido);
  } catch (error) {
    expect(error.message).toBe("Dígito verificador inválido");
  }
});
