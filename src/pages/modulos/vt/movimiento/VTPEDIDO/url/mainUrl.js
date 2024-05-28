const base_url = '/vt/vtpedido/';
const url_pre_form               = base_url + 'pre_form';
// ! BUSCADOR 
const url_buscar_sucursal        = base_url + 'buscar/sucursal';
const url_buscar_cliente         = base_url + 'buscar/cliente';
const url_buscar_subcliente      = base_url + 'buscar/subcliente';
const url_buscar_vendedor        = base_url + 'buscar/vendedor';
const url_buscar_lista_precio    = base_url + 'buscar/lista_precio';
const url_buscar_moneda          = base_url + 'buscar/moneda';
const url_buscar_condicion_venta = base_url + 'buscar/condicion_venta';
const url_buscar_deposito        = base_url + 'buscar/deposito';
// !
const url_buscar_articulo        = base_url + 'buscar/articulo';
const url_buscar_unidad_medida   = base_url + 'buscar/unidad_medida';
// ! VALIDADORES
const url_valida_sucursal	       = base_url + 'valida/sucursal';
const url_valida_cliente	       = base_url + 'valida/cliente';
const url_valida_subcliente	     = base_url + 'valida/subcliente';
const url_valida_vendedor	       = base_url + 'valida/vendedor';
const url_valida_lista_precio	   = base_url + 'valida/lista_precio';
const url_valida_moneda     	   = base_url + 'valida/moneda';
const url_valida_condicion_venta = base_url + 'valida/condicion_venta';
const url_valida_deposito        = base_url + 'valida/deposito';
// !
const url_valida_articulo        = base_url + 'valida/articulo';
const url_valida_unidad_medida   = base_url + 'valida/unidad_medida';
const url_valida_cantidad        = base_url + 'valida/cantidad';
// ! LISTAR
const url_list_cab               = base_url + 'list/cabecera';
const url_list_detalle           = base_url + 'list/detalle'; 
const url_list_post_query        = base_url + 'list/post_query'; 
// AUTO NRO_COMPROBANTE 
const url_buscar_comp            = base_url; 
const url_buscar_nroOrd          = base_url; 
// ABM
const url_abm                    = '/vt/vtpedido';
// REPORTE
// const url_reporte                = '/vt/vtfactur/reporte/rstenvio';
const main = {
    url_pre_form
  // BUSCADOR
  , url_buscar_sucursal
  , url_buscar_cliente
  , url_buscar_subcliente
  , url_buscar_vendedor
  , url_buscar_lista_precio
  , url_buscar_moneda
  , url_buscar_condicion_venta
  , url_buscar_deposito
  // !
  , url_buscar_articulo
  , url_buscar_unidad_medida
  // , url_buscar_causa
  , url_buscar_comp
  , url_buscar_nroOrd
  // , url_buscar_tipCambio
  // VALIDADORES
  , url_valida_sucursal
  , url_valida_cliente
  , url_valida_subcliente
  , url_valida_vendedor
  , url_valida_lista_precio
  , url_valida_moneda
  , url_valida_condicion_venta
  , url_valida_deposito
  // !
  , url_valida_articulo
  , url_valida_unidad_medida
  , url_valida_cantidad
  // , url_valida_cantidad
  // , url_valida_causa
  // LIST
  , url_list_cab    
  , url_list_detalle 
  , url_list_post_query 
  // ABM
  , url_abm
  // REPORTE
  // , url_reporte
}

export default main;