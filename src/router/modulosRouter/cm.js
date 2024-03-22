// DEFINICION
import cmprovec from "../../pages/modulos/cm/definiciones/CMPROVEC/CMPROVEC";
// MOVIMIENTO
import cmfactur from "../../pages/modulos/cm/movimiento/CMFACTUR/CMFACTUR";

const Route = [
  // DEFINICION
{ path: '/cm/cmprovec',
  component: cmprovec
},
 // MOVIMIENTO
{ path: '/cm/cmfactur',
  component: cmfactur
},
];
export default Route;