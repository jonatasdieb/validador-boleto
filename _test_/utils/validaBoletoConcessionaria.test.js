const { boletoConcessionaria } = require("./mock");

const {
  obterValorTotal,
  obterDataVencimento,
  obterCodigoDeBarrasViaLinhaDigitavel,
  validarDigitoVerificadorGeralModulo11,
  validarDigitosVerificadoresModulo11,
  validarDigitosVerificadoresModulo10,
} = require("../../src/utils/validaBoletoConcessionaria");

test("deve obter o código de barras a partir da linha digitável", () => {
  expect(
    obterCodigoDeBarrasViaLinhaDigitavel(
      boletoConcessionaria.linhaDigitavelValida
    )
  ).toBe("83890000003412400310100343519570700051464539");
});

test("deve obter a data de vencimento a partir da linha digitavel", () => {
  expect(obterDataVencimento(boletoConcessionaria.linhaDigitavelValida)).toBe(
    ""
  );
});

test("deve obter o valor total a partir do código de barras", () => {
  expect(obterValorTotal(boletoConcessionaria.codigoDeBarrasValido)).toBe(
    341.24
  );
});

test("deve validar o digito verificador geral do código de barras modulo 11", () => {
  validarDigitoVerificadorGeralModulo11(
    boletoConcessionaria.codigoDeBarrasValido
  );

  expect(true).toBe(true);
});

test("deve apresentar erro para digito verificador geral inválido do código de barras modulo 11", () => {
  try {
    validarDigitoVerificadorGeralModulo11(
      boletoConcessionaria.codigoDeBarrasComDigitoVerificadorInvalido
    );
  } catch (error) {
    expect(error.message).toBe('Dígito verificador inválido');
    
  }
});

test("deve validar o digitos verificadores da linha digitável modulo 11", () => {
  validarDigitosVerificadoresModulo11(
    boletoConcessionaria.linhaDigitavelValida
  );

  expect(true).toBe(true);
});

test("deve apresentar erro para digitos verificadores inválidos da linha digitável modulo 11", () => {
  try {
    validarDigitosVerificadoresModulo11(
      boletoConcessionaria.linhaDigitavelComDigitoVerificadorInvalido
    );
  } catch (error) {
    expect(error.message).toBe('Dígito verificador inválido');
    
  }
});
