// DEFINICION
import starticu  from "../../pages/modulos/st/definicion/STARTICULO/STARTICU";

// MOVIMIENTO
import stensal   from "../../pages/modulos/st/movimiento/STENSAL/STENSAL";

const Route = [
  // DEFINICION
  { path: '/st/starticu',
    component: starticu
  }
  // MOVIMIENTO
  ,{
    path: '/st/stensal',
    component: stensal
  }
];
export default Route;