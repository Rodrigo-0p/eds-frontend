// COLUMNAS
const columns_sucursal = [
  { data: 'COD_SUCURSAL'  , title: 'Código'         , className:'htreft' },
  { data: 'DESC_SUCURSAL' , title: 'Descrición'     , className:'htreft' },
]
const columns_cliente = [
  { data: 'COD_CLIENTE'   , title: 'Código'         , className:'htreft' },
  { data: 'NOM_CLIENTE'   , title: 'Descrición'     , className:'htreft' },
]

const columns_subcliente = [
  { data: 'COD_CLIENTE'   , title: 'Código'         , className:'htreft' },
  { data: 'NOM_SUBCLIENTE'   , title: 'Descrición'     , className:'htreft' },
]

const columns_vendedor = [
  { data: 'COD_VENDEDOR'   , title: 'Código'         , className:'htreft' },
  { data: 'DESC_VENDEDOR'   , title: 'Descrición'     , className:'htreft' },
]

const columns_lista_precio = [
  { data: 'COD_LISTA_PRECIO'   , title: 'Código'         , className:'htreft' },
  { data: 'DESC_LISTA_PRECIO'  , title: 'Descrición'     , className:'htreft' },
]

const columns_moneda = [
  { data: 'COD_MONEDA'   , title: 'Código'         , className:'htreft' },
  { data: 'DESC_MONEDA'  , title: 'Descrición'     , className:'htreft' },
]

const columns_condicion_venta = [
  { data: 'COD_CONDICION_VENTA'   , title: 'Código'         , className:'htreft' },
  { data: 'DESC_CONDICION_VENTA'  , title: 'Descrición'     , className:'htreft' },
]

const columns_deposito = [
  { data: 'COD_DEPOSITO'   , title: 'Código'         , className:'htreft' },
  { data: 'DESC_DEPOSITO'  , title: 'Descrición'     , className:'htreft' },
]


const main = {
  columns_sucursal,
  columns_cliente,
  columns_subcliente,
  columns_vendedor,
  columns_lista_precio,
  columns_moneda,
  columns_condicion_venta,
  columns_deposito
}

export default main;