// BUSCADOR 
const url_buscar_proveedor	  = '/st/starticu/buscar/proveedor'     ;
const url_buscar_marca	      = '/st/starticu/buscar/marca'         ;
const url_buscar_linea        = '/st/starticu/buscar/linea'         ;
const url_buscar_segmento     = '/st/starticu/buscar/segmento'      ; 
const url_buscar_rubro	      = '/st/starticu/buscar/rubro'         ;
const url_buscar_grupo	      = '/st/starticu/buscar/grupo'         ;
const url_buscar_iva	        = '/st/starticu/buscar/iva'           ;
const url_buscar_um           = '/st/starticu/buscar/um'            ;
// VALIDADORES
const url_valida_proveedor    = '/st/starticu/valida/proveedor'     ;
const url_valida_marca	      = '/st/starticu/valida/marca'         ;
const url_valida_linea        = '/st/starticu/valida/linea'         ;
const url_valida_segmento     = '/st/starticu/valida/segmento'      ; 
const url_valida_rubro	      = '/st/starticu/valida/rubro'         ;
const url_valida_grupo	      = '/st/starticu/valida/grupo'         ;
const url_valida_iva	        = '/st/starticu/valida/iva'           ;
const url_valida_um	          = '/st/starticu/valida/um'            ;

// LIST
const url_list_cab             = '/st/starticu/list/articulo'       ;
const url_list_relaciones      = '/st/starticu/list/relaciones'     ; 
const url_postQueryCab         = '/st/starticu/list/postqueryCab'   ;        
// AUTO NRO_COMPROBANTE 
const url_buscar_cod_articulo  = '/st/starticu/cod_articulo/'       ; 
// ABM
const url_abm                  = '/st/starticu'                     ;
const url_saveImg              = `/st/starticu/saveImg/${sessionStorage.getItem('cod_empresa')}/`    ;

const main ={
  // BUSCADOR
    url_buscar_proveedor
  , url_buscar_cod_articulo 
  , url_buscar_marca
  , url_buscar_linea
  , url_buscar_segmento
  , url_buscar_rubro
  , url_buscar_grupo
  , url_buscar_iva
  , url_buscar_um
  // VALIDADORES
  , url_valida_proveedor
  // LIST
  , url_list_cab
  , url_postQueryCab
  , url_valida_marca
  , url_valida_linea
  , url_valida_segmento
  , url_valida_rubro
  , url_valida_grupo
  , url_valida_iva
  , url_valida_um
  , url_list_relaciones
  // ABM
  , url_abm
  , url_saveImg
}

export default main;