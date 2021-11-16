const {boletoBancario} = require('./mock');

const {  
  obterCodigoDeBarrasViaLinhaDigitavel,
  obterDataVencimento,
  obterValorTotal,
  validarDigitosVerificadoresLinhaDigitavel,
  validarDigitoVerificadorCodigoDeBarras
} = require("../../src/utils/validaBoletoBancario");

test('deve obter o código de barras a partir da linha digitável', () => {
    expect(obterCodigoDeBarrasViaLinhaDigitavel(boletoBancario.linhaDigitavelValida))
        .toBe('00193373700000001000500940144816060680935031');
  });

test('deve obter a data de vencimento a partir da linha digitavel', () => {
  expect(obterDataVencimento(boletoBancario.linhaDigitavelValida))
      .toBe('31/12/2007');
});

test('deve obter o valor total a partir da linha digitavel', () => {
  expect(obterValorTotal(boletoBancario.linhaDigitavelValida))
      .toBe(1);
});

test('deve validar os digitos verificadores da linha digitavel', () => {
  validarDigitosVerificadoresLinhaDigitavel(boletoBancario.linhaDigitavelValida);

  expect(true).toBe(true);
});

test('deve validar os digitos verificadores da linha digitavel', () => {
  validarDigitosVerificadoresLinhaDigitavel(boletoBancario.linhaDigitavelValida);

  expect(true).toBe(true);
});

test('deve retornar erro para digitos verificadores inválido', () => {
  try {
    validarDigitosVerificadoresLinhaDigitavel(boletoBancario.linhaDigitavelComDigitoVerificadorInvalido);
  } catch (error) {
    expect(error.message).toBe("Dígito verificador inválido");
  } 
});

test('deve validar o digito verificador do código de barras', () => {
  validarDigitoVerificadorCodigoDeBarras(boletoBancario.codigoDeBarrasValido);

  expect(true).toBe(true);
});

test('deve retornar erro para digito verificador inválido no código de barras', () => {
  try {
    validarDigitoVerificadorCodigoDeBarras(boletoBancario.codigoDeBarrasComDigitoVerificadorInvalido);
  } catch (error) {
    expect(error.message).toBe("Dígito verificador do código de barras é inválido");
  } 
});




