import mainUrl  from '../url/mianUrl'

const columnModalDet = {
  urlValidar : [{ COD_ARTICULO      : mainUrl.url_valida_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_um,
                  CANTIDAD          : mainUrl.url_valida_calcCant,
                }],
  urlBuscador: [{ COD_ARTICULO      : mainUrl.url_buscar_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_um
                }],
  title      : [{ COD_ARTICULO      : "Articulo",
                  COD_UNIDAD_MEDIDA : "Unidad Medida"   ,
                }],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO'         , title: 'Código'      ,width : 35  , className:'htLeft'  },
    { data: 'DESC_ARTICULO'        , title: 'Descripción' ,width : 100 , className:'htLeft'  },
  ],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA'   , title: 'Código'      ,className:'htLeft'  },
    { data: 'DESC_UNIDAD_MEDIDA'  , title: 'Descripción' ,className:'htLeft' 	},
  ],
  config:{
    COD_ARTICULO:{
      depende_de:[{id:'COD_UNIDAD_MEDIDA', label:'U.M.'       , isNull:true},
                  {id:'CANTIDAD'         , label:'Cantidad'   , isNull:true}],
      dependencia_de:[],
      depende_ex_cab:[
        {id:'COD_SUCURSAL'        , label :'Sucursal'        },
        {id:'CARGA_DETALLE'       , label :'Carga Detalle'   },
        {id:'PRECIO_VENTA'        , label :'Precio Venta'    },
        {id:'COD_MONEDA'          , label :'Moneda'          },
        {id:'IND_VENTA'           , label :'IND_VENTA'        , isNull:true },
        {id:'COD_CONDICION_VENTA' , label :'Condicion venta' },
        {id:'COD_LISTA_PRECIO'    , label :'Lista de Precio' },     
        {id:'IND_REG_TURISMO'     , label :'IND_REG_TURISMO'  , isNull:true },
      ],
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[{id:'COD_ARTICULO'  , label: 'Articulo'   }],
      dependencia_de:[{id:"PRECIO_UB" , label: 'Precio ub'  }],
      depende_ex_cab:[{id:'DECIMALES' , label :'Decimales'  }],
    },
    CANTIADAD:{
      depende_de:[{id:'MULT' , label: 'MULT'},
                  {id:'DIV'  , label: 'DIV' }],
      dependencia_de:[],
      depende_ex_cab:[],
    }
  }
};

const columnDet = [
  { data: 'COD_ARTICULO'         , title: 'Articulo'        , width : 35  , className: 'htLeft', requerido:true      , readOnly:false       , filter:false }, 
  { data: 'DESC_ARTICULO'        , title: 'Descripcion'     , width : 130 , readOnly:true      , filter:false        , textWrap:true       }, 
  { data: 'NRO_LOTE'             , title: 'Nro. Lote'       , width : 26  , className: 'htLeft', readOnly:false      , filter:false        }, 
  { data: 'FEC_VENCIMIENTO'      , title: 'Fec. Venc'       , width : 46  , className: 'htLeft', readOnly:false      , type:'date'          , hora:false}, 
  { data: 'COD_UNIDAD_MEDIDA'    , title: 'U.M'             , width : 25  , className: 'htLeft', requerido:true      , readOnly:false       , filter:false   , nextValida:true }, 
  { data: 'CANTIDAD'             , title: 'Cantidad'        , width : 55  , type:'numeric'     , className:'htRight' , requerido:true       , format:{pattern: '0,0'}, nextValida:true },
  { data: 'PRECIO_UNITARIO_C_IVA', title: 'Precio Unitario' , width : 55  , type:'numeric'     , className: 'htRight', requerido:true       , format:{pattern: '0,0'}, validaAllExterno:true}, 
  { data: 'TOTAL_IVA'            , title: 'Total I.V.A'     , width : 60  , type:'numeric'     , className:'htRight' , readOnly:true        , filter:false   , format:{pattern: '0,0'}},
  { data: 'MONTO_TOTAL_C_IVA'    , title: 'Monto Total'     , width : 60  , type:'numeric'     , className:'htRight' , readOnly:true        , filter:false   , format:{pattern: '0,0'}},
]
const nextEnter = [0,2,3,4,5,6];
      
// F9
const column_sucursal = [
  { data: 'COD_SUCURSAL'         , title: 'Código'      , className:'htreft' },
  { data: 'DESC_SUCURSAL'        , title: 'Descrición'  , className:'htreft' },
]
const column_cliente = [
  { data: 'COD_CLIENTE'          , title: 'Código'      , className:'htreft' },
  { data: 'DESC_CLIENTE'         , title: 'Descrición'  , className:'htreft' },
]
const column_NroCompRef = [
  { data: 'TIP_COMPROBANTE_REF'  , title: 'Tipo'        , className:'htreft' },
  { data: 'SER_COMPROBANTE_REF'  , title: 'Ser'         , className:'htreft' },
  { data: 'NRO_COMPROBANTE_REF'  , title: 'Comprobante' , className:'htreft' },
]
const column_zona = [
  { data: 'COD_ZONA'             , title: 'Código'      , className:'htreft' },
  { data: 'DESC_ZONA'            , title: 'Descrición'  , className:'htreft' },
]
const column_CondVenta = [
  { data: 'COD_CONDICION_VENTA'  , title: 'Código'      , className:'htreft' },
  { data: 'DESC_CONDICION'       , title: 'Descrición'  , className:'htreft' },
]
const column_Motivoncr = [
  { data: 'COD_MOTIVO_NCR'       , title: 'Código'      , className:'htreft' },
  { data: 'DESC_MOTIVO_NCR'      , title: 'Descrición'  , className:'htreft' },
]
const column_listaPrecio = [
  { data: 'COD_LISTA_PRECIO'     , title: 'Código'      , className:'htreft' },
  { data: 'DESC_LISTA_PRECIO'    , title: 'Descrición'  , className:'htreft' },
]
const column_vendedor = [
  { data: 'COD_VENDEDOR'         , title: 'Código'      , className:'htreft' },
  { data: 'DESC_VENDEDOR'        , title: 'Descrición'  , className:'htreft' },
]
const column_moneda = [
  { data: 'COD_MONEDA'           , title: 'Código'      , className:'htreft' },
  { data: 'DESC_MONEDA'          , title: 'Descrición'  , className:'htreft' },
]


const main = {
  columnModalDet
 , columnDet
 , nextEnter
  // F9
 , column_sucursal
 , column_cliente
 , column_zona
 , column_NroCompRef
 , column_CondVenta
 , column_Motivoncr
 , column_listaPrecio
 , column_vendedor
 , column_moneda
}

export default main