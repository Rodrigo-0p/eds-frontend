// DEFINICION
import starticu  from "../../pages/modulos/st/definicion/STARTICULO/STARTICU";

// MOVIMIENTO
import stentsal  from "../../pages/modulos/st/movimiento/STENTSAL/STENTSAL";

const Route = [
  // DEFINICION
  { path: '/st/starticu',
    component: starticu
  }
  // MOVIMIENTO
  ,{
    path: '/st/stentsal',
    component: stentsal
  }
];
export default Route;