const { Router } = require("express");
const { validarBoleto } = require("../utils/validarBoleto");

const router = Router();

router.get("/boleto/:linhaDigitavel", (req, res) => {
  try {
    let info = validarBoleto(req.params.linhaDigitavel);

    res.status(200).send({
      barCode: info.codigoDeBarras,
      amount: info.total,
      expirationDate: info.dataVencimento,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
