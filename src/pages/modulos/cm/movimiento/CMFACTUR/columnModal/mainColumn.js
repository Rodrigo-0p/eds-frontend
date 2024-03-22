// COLUMNAS
const columns_sucursal = [
  { data: 'COD_SUCURSAL'         , title: 'Código'      , className:'htreft' },
  { data: 'DESC_SUCURSAL'        , title: 'Descrición'  , className:'htreft' },
]
const columns_proveedor = [
  { data: 'COD_PROVEEDOR'        , title: 'Código'      , className:'htreft' },
  { data: 'DESC_PROVEEDOR'       , title: 'Descrición'  , className:'htreft' },
]
const columns_proveedor_ant = [
  { data: 'COD_PROVEEDOR_ANT'    , title: 'Código'      ,  className:'htreft' },
  { data: 'DESC_PROVEEDOR_ANT'   , title: 'Descrición'  ,  className:'htreft' },
]
const columns_cond_compra = [
  { data: 'COD_CONDICION_COMPRA' , title: 'Código'      ,  className:'htreft' },
  { data: 'DESC_CONDICION_COMPRA', title: 'Descrición'  ,  className:'htreft' },
]
const columns_cod_moneda = [
  { data: 'COD_MONEDA'          , title: 'Código'       ,  className:'htreft' },
  { data: 'DESC_MONEDA'         , title: 'Descrición'   ,  className:'htreft' },
]
const columns_cod_deposito = [
  { data: 'COD_DEPOSITO'        , title: 'Código'       ,  className:'htreft' },
  { data: 'DESC_DEPOSITO'       , title: 'Descrición'   ,  className:'htreft' },
]

const main = {
  columns_sucursal
, columns_proveedor
, columns_proveedor_ant
, columns_cond_compra
, columns_cod_moneda
, columns_cod_deposito
}

export default main;