import Main from "../../../../../../../componente/util/main" 

export const objetoInicialCab = { 
  COD_EMPRESA	      : sessionStorage.getItem('cod_empresa')  ,
  COD_SUCURSAL	    : sessionStorage.getItem('cod_sucursal') ,
  COD_LISTA_PRECIO	: '' ,
  DESCRIPCION	      : '' ,
  COD_MONEDA	      : '' ,
  ESTADO	          : 'A' ,
  PORC_DESCUENTO	  : '' ,
  // ---
  FEC_ALTA          : '',
  FEC_MODI          : '',
  COD_USUARIO       : '',
  COD_MODI          : '',
  insertDefault     : true,
}


export const objetoInicialDet = { 
  COD_EMPRESA	      : sessionStorage.getItem('cod_empresa')  ,
  COD_SUCURSAL	    : sessionStorage.getItem('cod_sucursal') ,
  COD_LISTA_PRECIO	: '',  
  COD_UNIDAD_MEDIDA	: '',
  COD_ARTICULO	    : '',
  FEC_VIGENCIA	    : Main.moment().format('DD/MM/YYYY HH:mm'),		
  PRECIO_FIJO	      : '',		
  PRECIO_MINIMO	    : '',		
  NRO_ORDEN	      	: '',		
  // --
  insertDefault     : true,
}