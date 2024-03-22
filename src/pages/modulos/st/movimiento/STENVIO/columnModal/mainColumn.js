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

const main = {
  columns_sucursal
, columns_motivo
}

export default main;