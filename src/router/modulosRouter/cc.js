// DEFINICION
// MOVIMIENTO
import CCRENAGR from "../../pages/modulos/cc/movimiento/cobranza/CCRENAGR/CCRENAGR";
import CCNCRDEF from "../../pages/modulos/cc/movimiento/notaDeCredito/CCNCRDEF/CCNCRDEF";
import CCCANCAJ from "../../pages/modulos/cc/movimiento/CCCANCAJ/CCCANCAJ";
// COBRANZA
import CCMOVCAJ from "../../pages/modulos/cc/movimiento/cobranza/CCMOVCAJ/CCMOVCAJ";

const Route = [
 // DEFINICION
 // MOVIMIENTO
  { path: '/cc/ccrenagr',
    component: CCRENAGR
  },
  { path: '/cc/ccncrdef',
    component: CCNCRDEF
  },
  { path: '/cc/cccancaj',
    component: CCCANCAJ
  },
  // CCMOVCAJ
  { path: '/cc/ccmovcaj',
    component: CCMOVCAJ
  }
];
export default Route;