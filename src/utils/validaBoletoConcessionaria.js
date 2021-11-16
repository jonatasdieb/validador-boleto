const moment = require("moment");

function validarLinhaDigitavel(linhaDigitavel) {
  let codigoDeBarras = obterCodigoDeBarrasViaLinhaDigitavel(linhaDigitavel);

  //Identificador de Valor Efetivo ou Referência

  if ([6, 7].find((n) => n == linhaDigitavel[2])) {
    validarDigitosVerificadoresModulo10(linhaDigitavel);
    validarDigitoVerificadorGeralModulo10(codigoDeBarras);
  } else if ([8, 9].find((n) => n == linhaDigitavel[2])) {
    validarDigitosVerificadoresModulo11(linhaDigitavel);
    validarDigitoVerificadorGeralModulo11(codigoDeBarras);
  } else {
    throw new Error("Identificador de Valor Efetivo inválido");
  }

  //calcula valor do boleto
  let total = obterValorTotal(codigoDeBarras);

  //calcula data de vencimento
  let vencimento = obterDataVencimento(codigoDeBarras);

  return {
    codigoDeBarras,
    total,
    dataVencimento: vencimento,
  };
}

function obterValorTotal(codigoDeBarras) {
  return parseFloat(codigoDeBarras.substring(4, 15)) / 100;
}

function obterDataVencimento(codigoDeBarras) {
  let vencimento = moment(codigoDeBarras.substring(19, 27), "YYYYMMDD").format(
    "YYYY-MM-DD"
  );

  return vencimento == "Invalid date" ? "" : vencimento;
}

function obterCodigoDeBarrasViaLinhaDigitavel(linhaDigitavel) {
  let codigoDeBarras =
    linhaDigitavel.substring(0, 11) +
    linhaDigitavel.substring(12, 23) +
    linhaDigitavel.substring(24, 35) +
    linhaDigitavel.substring(36, 47);

  return codigoDeBarras;
}

function validarDigitosVerificadoresModulo10(linhaDigitavel) {
  let campo1 = linhaDigitavel.substring(0, 12);
  let campo2 = linhaDigitavel.substring(12, 24);
  let campo3 = linhaDigitavel.substring(24, 36);
  let campo4 = linhaDigitavel.substring(36, 48);

  let camposParaValidacaoDigitoVerificador = [campo1, campo2, campo3, campo4];

  camposParaValidacaoDigitoVerificador.forEach((c) => {
    let campo = c.split("");
    var digitoVerificador = campo.pop();

    /* Multiplicando a sequência dos campos pelos multiplicadores, 
            iniciando por 2 da direita para a esquerda: */

    campo = campo.reverse();

    let multiplicador = 2;
    let somaDoCampoMultiplicado = 0;

    campo.forEach((n) => {
      let resultado = n * multiplicador;
      multiplicador = multiplicador == 1 ? 2 : 1;

      if (resultado > 9) {
        resultado =
          Number(resultado.toString()[0]) + Number(resultado.toString()[1]);
      }

      somaDoCampoMultiplicado += resultado;
    });

    /*
     * A soma dos algarismos do produto
     * é dividida por 10 e o DAC será a diferença entre o divisor ( 10 ) e o resto da divisão:
     */

    let restoDaDivisaoPor10 = somaDoCampoMultiplicado % 10;

    let digitoVerificadorCalculado =
      restoDaDivisaoPor10 == 0 ? 0 : 10 - restoDaDivisaoPor10;

    if (digitoVerificadorCalculado != digitoVerificador) {
      throw new Error("Dígito verificador inválido");
    }
  });
}

function validarDigitosVerificadoresModulo11(linhaDigitavel) {
  let campo1 = linhaDigitavel.substring(0, 12);
  let campo2 = linhaDigitavel.substring(12, 24);
  let campo3 = linhaDigitavel.substring(24, 36);
  let campo4 = linhaDigitavel.substring(36, 48);

  let camposParaValidacaoDigitoVerificador = [campo1, campo2, campo3, campo4];

  camposParaValidacaoDigitoVerificador.forEach((c) => {
    let campo = c.split("");
    var digitoVerificador = campo.pop();

    /* Multiplicando a sequência dos campos pelos multiplicadores, 
            iniciando por 2 da direita para a esquerda: */

    campo = campo.reverse();

    let multiplicador = 2;
    let somaDoCampoMultiplicado = 0;

    campo.forEach((n) => {
      let resultado = n * multiplicador;

      somaDoCampoMultiplicado += resultado;

      multiplicador = multiplicador == 9 ? 2 : ++multiplicador;
    });

    /*
     * A soma dos produtos dessa multiplicação é dividida por 11, obtém-se o resto da divisão,
     * este resto deve ser subtraído de 11, o produto da subtração é o DAC.
     */

    let restoDaDivisaoPor11 = somaDoCampoMultiplicado % 11;

    let digitoVerificadorCalculado = 11 - restoDaDivisaoPor11;

    /* Quando o resto da divisão for igual a 0 ou 1, atribuí-se ao DV o digito “0”,
     * e quando for 10, atribuí-se ao DV o digito “1”.
     */
    if ([0, 1].find((n) => n == restoDaDivisaoPor11)) {
      digitoVerificadorCalculado = 0;
    } else if (restoDaDivisaoPor11 == 10) {
      digitoVerificadorCalculado = 1;
    }

    if (digitoVerificadorCalculado != digitoVerificador) {
      throw new Error("Dígito verificador inválido");
    }
  });
}

function validarDigitoVerificadorGeralModulo10(codigoDeBarras) {
  let codigoAuxiliar =
    codigoDeBarras.substring(0, 3) + codigoDeBarras.substring(4, 44);

  let digitoVerificador = codigoDeBarras[3];

  /* Multiplicando a sequência dos campos pelos multiplicadores, 
          iniciando por 2 da direita para a esquerda: */

  codigoAuxiliar = codigoAuxiliar.split("").reverse();

  let multiplicador = 2;
  let somaDoCampoMultiplicado = 0;

  codigoAuxiliar.forEach((n) => {
    let resultado = n * multiplicador;
    multiplicador = multiplicador == 1 ? 2 : 1;

    if (resultado > 9) {
      resultado =
        Number(resultado.toString()[0]) + Number(resultado.toString()[1]);
    }

    somaDoCampoMultiplicado += resultado;
  });

  let digitoVerificadorCalculado = 10 - (somaDoCampoMultiplicado % 10);

  if (digitoVerificadorCalculado != digitoVerificador) {
    throw new Error("Dígito verificador geral inválido");
  }
}

function validarDigitoVerificadorGeralModulo11(codigoDeBarras) {
  let codigoAuxiliar =
    codigoDeBarras.substring(0, 3) + codigoDeBarras.substring(4, 44);

  let digitoVerificador = codigoDeBarras[3];

  /* Multiplicando a sequência dos campos pelos multiplicadores, 
            iniciando por 2 da direita para a esquerda: */

  codigoAuxiliar = codigoAuxiliar.split("").reverse();

  let multiplicador = 2;
  let somaDoCampoMultiplicado = 0;

  codigoAuxiliar.forEach((n) => {
    let resultado = n * multiplicador;
    somaDoCampoMultiplicado += resultado;
    multiplicador = multiplicador == 9 ? 2 : ++multiplicador;
  });

  /*
   * A soma dos produtos dessa multiplicação é dividida por 11, obtém-se o resto da divisão,
   * este resto deve ser subtraído de 11, o produto da subtração é o DAC.
   */

  let restoDaDivisaoPor11 = somaDoCampoMultiplicado % 11;

  let digitoVerificadorCalculado = 11 - restoDaDivisaoPor11;

  /* Quando o resto da divisão for igual a 0 ou 1, atribuí-se ao DV o digito “0”,
   * e quando for 10, atribuí-se ao DV o digito “1”.
   */
  if ([0, 1].find((n) => n == restoDaDivisaoPor11)) {
    digitoVerificadorCalculado = 0;
  } else if (restoDaDivisaoPor11 == 10) {
    digitoVerificadorCalculado = 1;
  }

  if (digitoVerificadorCalculado != digitoVerificador) {
    throw new Error("Dígito verificador inválido");
  }
}

module.exports = {
  validarLinhaDigitavel,
  obterValorTotal,
  obterDataVencimento,
  obterCodigoDeBarrasViaLinhaDigitavel,
  validarDigitoVerificadorGeralModulo10,
  validarDigitoVerificadorGeralModulo11,
  validarDigitosVerificadoresModulo10,
  validarDigitosVerificadoresModulo11,
};
