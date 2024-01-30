// COLUMNAS
const columns_sucursal = [
  { data: 'COD_SUCURSAL'  , title: 'Código'         , className:'htreft' },
  { data: 'DESC_SUCURSAL' , title: 'Descrición'     , className:'htreft' },
]
const columns_motivo = [
  { data: 'COD_MOTIVO'    , title: 'Código'         , className:'htreft' },
  { data: 'DESC_MOTIVO'   , title: 'Descrición'     , className:'htreft' },
  { data: 'IND_ENT_SAL'   , title: 'Tipo'           , className:'htreft' },
  { data: 'AFECTA_COSTO'  , title: 'Afecta Costo'   , className:'htreft' },
]
const columns_deposito = [
  { data: 'COD_DEPOSITO'  , title: 'Código'         , className:'htreft' },
  { data: 'DESC_DEPOSITO' , title: 'Descrición'     , className:'htreft' },
]
const columns_proveedor = [
  { data: 'COD_PROVEEDOR' , title: 'Código'         , className:'htreft' },
  { data: 'DESC_PROVEEDOR', title: 'Descrición'     , className:'htreft' },
]
const columns_moneda = [
  { data: 'COD_MONEDA'    , title: 'Código'         , className:'htreft'                    },
  { data: 'DESC_MONEDA'   , title: 'Descrición'     , className:'htreft'                    },
  { data: 'TIP_CAMBIO'    , title: 'Tip. Cambio'    , className:'htreft'  , type: 'numeric' },
  { data: 'TIP_CAMBIO_US' , title: 'Tip. Cambio Us.', className:'htreft'  , type: 'numeric' },
]

const main = {
  columns_sucursal
, columns_motivo
, columns_deposito
, columns_proveedor
, columns_moneda
}

export default main;