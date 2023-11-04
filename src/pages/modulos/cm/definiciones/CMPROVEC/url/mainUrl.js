// BUSCADOR 
const url_buscar_persona	           = '/cm/cmprovec/buscar/persona'       ;
const url_buscar_proveedor_fef       = '/cm/cmprovec/buscar/proveedorRef'  ;
const url_buscar_cuenta_contable     = '/cm/cmprovec/buscar/cuentaContable';
const url_buscar_cuenta_cont         = '/cm/cmprovec/buscar/cuentaCont'    ;
const url_buscar_banco               = '/cm/cmprovec/buscar/banco'         ;
const url_buscar_codCompra           = '/cm/cmprovec/buscar/codCompra'     ;
const url_buscar_codMoneda           = '/cm/cmprovec/buscar/moneda'        ;

// VALIDADORES
const url_validar_persona        		 = '/cm/cmprovec/valida/persona'       ;
const url_validar_proveedor_fef      = '/cm/cmprovec/valida/proveedorRef'  ;
const url_validar_cuenta_contable    = '/cm/cmprovec/valida/cuentaContable';
const url_validar_cuenta_cont        = '/cm/cmprovec/valida/cuentaCont'    ;
const url_validar_banco              = '/cm/cmprovec/valida/banco'         ;
const url_validar_codCompra          = '/cm/cmprovec/valida/codCompra'     ;
const url_validar_codMoneda          = '/cm/cmprovec/valida/moneda'        ;
const url_validar_limite_rendicion   = '/cm/cmprovec/valida/limiteRendicion';

// LIST
const url_list_cab                   = '/cm/cmprovec/list/proveedor' ;        
// AUTO COD_PROVEEDOR
const url_buscar_cod_proveedor       = '/cm/cmprovec/cod_proveedor/' ; 
// ABM
const url_abm                        = '/cm/cmprovec'                ;


const main ={
  // BUSCADOR
     url_buscar_persona
  ,  url_buscar_proveedor_fef
  ,  url_buscar_cuenta_contable
  ,  url_buscar_cuenta_cont
  ,  url_buscar_banco
  ,  url_buscar_codCompra
  ,  url_buscar_codMoneda

  // VALIDADORES
  ,  url_validar_persona
  ,  url_validar_proveedor_fef 
  ,  url_validar_cuenta_contable
  ,  url_validar_cuenta_cont
  ,  url_validar_banco
  ,  url_validar_codCompra
  ,  url_validar_codMoneda
  ,  url_validar_limite_rendicion
  // LIST
  , url_list_cab
  , url_buscar_cod_proveedor
  // ABM
  , url_abm
}

export default main;