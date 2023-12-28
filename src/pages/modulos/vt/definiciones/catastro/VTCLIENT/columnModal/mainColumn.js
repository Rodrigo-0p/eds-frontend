const columns_persona = [
  { data: 'COD_PERSONA'          , title: 'Código'     },
  { data: 'NOMBRE'               , title: 'Descrición' },
]
const columns_condVent = [
  { data: 'COD_CONDICION_VENTA'  , title: 'Código'     },
  { data: 'DESC_CONDICION_VENTA' , title: 'Descrición' },
]
const columns_causal = [
  { data: 'COD_CAUSAL'           , title: 'Código'     },
  { data: 'DESC_CAUSAL'          , title: 'Descrición' },
]
const columns_grupo_cliente = [
  { data: 'COD_GRUPO_CLIENTE'    , title: 'Código'     },
  { data: 'DESC_GRUPO_CLIENTE'   , title: 'Descrición' },
]
const columns_monedas_limite = [
  { data: 'COD_MONEDA_LIMITE'    , title: 'Código'     },
  { data: 'DESC_MONEDA_LIMITE'   , title: 'Descrición' },
]

const main = {
    columns_persona
  , columns_condVent
  , columns_causal
  , columns_grupo_cliente
  , columns_monedas_limite
}

export default main;