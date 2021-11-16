const moment = require("moment");

function validarLinhaDigitavel(linhaDigitavel) {
  validarDigitosVerificadoresLinhaDigitavel(linhaDigitavel);

  let codigoDeBarras = obterCodigoDeBarrasViaLinhaDigitavel(linhaDigitavel);

  validarDigitoVerificadorCodigoDeBarras(codigoDeBarras);

  let total = obterValorTotal(linhaDigitavel);

  let vencimento = obterDataVencimento(linhaDigitavel);

  return { codigoDeBarras, total, dataVencimento: vencimento };
}

function obterCodigoDeBarrasViaLinhaDigitavel(linhaDigitavel) {
  let codigoDeBarras =
    linhaDigitavel.substring(0, 4) +
    linhaDigitavel.substring(32, 47) +
    linhaDigitavel.substring(4, 9) +
    linhaDigitavel.substring(10, 20) +
    linhaDigitavel.substring(21, 31);

  return codigoDeBarras;
}

function obterDataVencimento(linhaDigitavel) {
  let campo5 = linhaDigitavel.substring(33, 47);

  let fatorVencimento = parseInt(campo5.substring(0, 4));
  let dataBase = moment("1997-10-07");
  let vencimento = dataBase.add(fatorVencimento, "days").format("YYYY-MM-DD");

  return vencimento;
}

function obterValorTotal(linhaDigitavel) {
  let campo5 = linhaDigitavel.substring(33, 47);
  let total = parseFloat(campo5.substring(4, 15)) / 100;

  return total;
}

function validarDigitosVerificadoresLinhaDigitavel(linhaDigitavel) {
  let campo1 = linhaDigitavel.substring(0, 10);
  let campo2 = linhaDigitavel.substring(10, 21);
  let campo3 = linhaDigitavel.substring(21, 32);

  let camposParaValidacaoDigitoVerificador = [campo1, campo2, campo3];

  camposParaValidacaoDigitoVerificador.forEach((c) => {
    let campo = c.split("");
    var digitoVerificador = campo.pop();

    /* Multiplicando a sequência dos campos pelos multiplicadores, 
          iniciando por 2 da direita para a esquerda: */

    campo = campo.reverse();

    let multiplicador = 2;

    let campoMultiplicado = campo.map((n) => {
      let resultado = n * multiplicador;
      multiplicador = multiplicador == 1 ? 2 : 1;
      return resultado;
    });

    /*
     * individualmente, os algarismos dos resultados do produtos:
     * caso o resultado da multiplicação seja maior que 9 (nove)
     * deverão ser somados os algarismos do produto,
     * até reduzi-lo a um único algarismo. Exemplo: Resultado igual a 18, então 1+8 = 9.
     */

    let somaDoCampoMultiplicado = 0;

    campoMultiplicado.forEach((n) => {
      if (n > 9) {
        n = Number(n.toString()[0]) + Number(n.toString()[1]);
      }

      somaDoCampoMultiplicado += n;
    });

    /*
     * Divida o total encontrado por 10, a fim de determinar o resto da divisão:
     */

    let restoDaDivisaoPor10 = somaDoCampoMultiplicado % 10;

    /**
     * Subtrair o "resto" apurado pela dezena imediatamente posterior.
     * O resultado será igual ao DV
     */

    let dezenaPosterior = Math.ceil(somaDoCampoMultiplicado / 10) * 10;

    let resultadoSubtracao = (dezenaPosterior - restoDaDivisaoPor10).toString();

    let digitoVerificadorCalculado =
      resultadoSubtracao[resultadoSubtracao.length - 1];

    if (digitoVerificadorCalculado != digitoVerificador) {
      throw new Error("Dígito verificador inválido");
    }
  });
}

function validarDigitoVerificadorCodigoDeBarras(codigoDeBarras) {
  let digitoVerificador = codigoDeBarras[4];

  /* Para calcular o DV considerar 43 posições do Código de Barras
   * sendo da posição 1 a 4 e da posição 6 a 44; */

  let posicoes =
    codigoDeBarras.substring(0, 4) + codigoDeBarras.substring(5, 45);

  /*
      Multiplicar cada algarismo que compõe o número pelo seu 
      respectivo multiplicador (peso), iniciando-se pela 44a posição e saltando a 5a posição;
      Os multiplicadores (pesos) variam de 2 a 9;
      O primeiro dígito da direita para a esquerda deverá ser multiplicado por 2, 
      o segundo por 3 e assim sucessivamente;
      Os resultados das multiplicações devem ser somados;
    */

  posicoes = posicoes.split("").reverse();
  let multiplicador = 2;
  let somaDasPosicoesMultiplicadas = 0;

  posicoes.forEach((p) => {
    let resultado = p * multiplicador;
    multiplicador = multiplicador == 9 ? 2 : ++multiplicador;

    somaDasPosicoesMultiplicadas += resultado;
  });

  /**
   * O total da soma deverá ser dividido por 11:
   * Exemplo: 712/11 = 64. Resto igual a 8;
   * O resto da divisão deverá ser subtraído de 11:
   * Exemplo: 11 - 8 = 3, Portando “3” é o Dígito verificador
   */

  let digitoVerificadorCalculado = 11 - (somaDasPosicoesMultiplicadas % 11);

  /**
   * Se o resultado da subtração for:
   * I - igual a 0.....................D.V. igual a 1
   * II - igual a 10....................D.V. igual a 1
   * III - igual a 11....................D.V. igual a 1
   * IV - diferente de 10 e 11..........D.V. será o próprio dígito, no caso do exemplo “3”
   * O resultado deste cálculo deverá ser incluído na 5a posição do código de barras.
   */

  if ([0, 10, 11].find((x) => x == digitoVerificadorCalculado)) {
    digitoVerificadorCalculado = 1;
  }

  if (digitoVerificadorCalculado != digitoVerificador) {
    throw new Error("Dígito verificador do código de barras é inválido");
  }
}

module.exports = {
  validarLinhaDigitavel,
  obterCodigoDeBarrasViaLinhaDigitavel,
  obterDataVencimento,
  obterValorTotal,
  validarDigitosVerificadoresLinhaDigitavel,
  validarDigitoVerificadorCodigoDeBarras,
};
