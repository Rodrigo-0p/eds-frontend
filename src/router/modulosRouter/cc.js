// DEFINICION
// MOVIMIENTO
import CCRENAGR from "../../pages/modulos/cc/movimiento/cobranza/CCRENAGR/CCRENAGR";
import CCNCRDEF from "../../pages/modulos/cc/movimiento/notaDeCredito/CCNCRDEF/CCNCRDEF";

const Route = [
 // DEFINICION
 // MOVIMIENTO
  { path: '/cc/ccrenagr',
    component: CCRENAGR
  },
  { path: '/cc/ccncrdef',
    component: CCNCRDEF
  }
];
export default Route;