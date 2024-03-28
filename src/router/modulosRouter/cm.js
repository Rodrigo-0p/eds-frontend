// DEFINICION
import cmprovec from "../../pages/modulos/cm/definiciones/CMPROVEC/CMPROVEC";
// MOVIMIENTO
import cmfactur from "../../pages/modulos/cm/movimiento/CMFACTUR/CMFACTUR";
import cmcoffac from "../../pages/modulos/cm/movimiento/CMCOFFAC/CMCOFFAC";

const Route = [
  // DEFINICION
{ path: '/cm/cmprovec',
  component: cmprovec
},
 // MOVIMIENTO
{ path: '/cm/cmfactur',
  component: cmfactur
},{
  path:'/cm/cmcoffac',
  component: cmcoffac
}
];
export default Route;