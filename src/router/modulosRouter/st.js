// DEFINICION
import starticu  from "../../pages/modulos/st/definicion/STARTICULO/STARTICU";

// MOVIMIENTO
import stentsal  from "../../pages/modulos/st/movimiento/STENTSAL/STENTSAL";
import stenvio  from "../../pages/modulos/st/movimiento/STENVIO/STENVIO";

const Route = [
  // DEFINICION
  { path: '/st/starticu',
    component: starticu
  }
  // MOVIMIENTO
  ,{
    path: '/st/stentsal',
    component: stentsal
  },{
    path: '/st/stenvio',
    component: stenvio
  }
];
export default Route;