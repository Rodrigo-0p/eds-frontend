const columns_proveedor_ref = [
  { data: 'COD_PROVEEDOR_REF'     , title: 'Código'     },
  { data: 'DESC_PROVEEDOR_REF'    , title: 'Descrición' },
]
const columnCuentaContable = [
  { data: 'COD_CUENTA_CONTABLE'   , title: 'Código'     },
  { data: 'DESC_CUENTA_CONTABLE'  , title: 'Descrición' },
];
const columnCuentaCont = [
  { data: 'COD_CUENTA_CONT'       , title: 'Código'     },
  { data: 'DESC_CUENTA_REF'       , title: 'Descrición' },
];
const columnBanco = [
  { data: 'COD_BANCO'             , title: 'Código'     },
  { data: 'DESC_BANCO'            , title: 'Descrición' },
];
const columnRubro = [
  { data: 'COD_RUBRO'             , title: 'Código'     },
  { data: 'DESC_RUBRO'            , title: 'Descrición' },
];
const columnCondicionCompra = [
  { data: 'COD_CONDICION_COMPRA'  , title: 'Código'      },
  { data: 'DESC_CONDICION_COMPRA' , title: 'Descrición'  },
];
const columnMoneda = [
  { data: 'COD_MONEDA'            , title: 'Código'      },
  { data: 'DESC_MONEDA'           , title: 'Descrición'  },
];

const main = {
    columns_proveedor_ref
  , columnCuentaContable
  , columnCuentaCont
  , columnBanco
  , columnRubro
  , columnCondicionCompra
  , columnMoneda
}

export default main;