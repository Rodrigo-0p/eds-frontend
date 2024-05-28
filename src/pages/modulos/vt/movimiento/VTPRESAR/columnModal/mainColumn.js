
import mainUrl from '../url/mainUrl';

const columnModal = {
  urlValidar : [{ COD_ARTICULO      : mainUrl.url_valida_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_valida_um,
                }],
  urlBuscador: [{ COD_ARTICULO      : mainUrl.url_buscar_articulo,
                  COD_UNIDAD_MEDIDA : mainUrl.url_buscar_um,
                }],
  title      : [{ COD_ARTICULO      : "Articulo",
                  COD_UNIDAD_MEDIDA : "Unidad Medida"   ,
                }],
  COD_ARTICULO: [
    { data: 'COD_ARTICULO'         , title: 'Código'      ,width : 35  , className:'htLeft'  },
    { data: 'DESC_ARTICULO'        , title: 'Descripción' ,width : 100 , className:'htLeft'  },
    // { data: 'COD_UNIDAD_MEDIDA'    , title: 'UM'          ,width : 35  , className:'htLeft'  },
    // { data: 'PRECIO_UNITARIO_C_IVA', title: 'Precio'      ,width : 35  , className:'htRight' }
  ],
  COD_UNIDAD_MEDIDA: [
    { data: 'COD_UNIDAD_MEDIDA'   , title: 'Código'      ,className:'htLeft'  },
    { data: 'DESC_UNIDAD_MEDIDA'  , title: 'Descripción' ,className:'htLeft' 	},
  ],
  config:{    
    COD_ARTICULO:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[
        {id:'COD_LISTA_PRECIO', label:'Lista de Precio' },
        {id:'COD_MONEDA'      , label:'Moneda'          },
        {id:'COD_SUCURSAL'    , label:'Suc. Destino'    },
      ],
    },
    COD_UNIDAD_MEDIDA:{
      depende_de:[{id:'COD_ARTICULO'         , label:'Cod Articulo'}
                 ,{id:'CANTIDAD'             , label:'Cantidad'   , isNull:true}
                 ,{id:'DESCUENTO'            , label:'Descuento'  , isNull:true}
                 ,{id:'PRECIO_UNITARIO_C_IVA', label:'Precio'     , isNull:true}
                ],
      dependencia_de:[],
      depende_ex_cab:[
        {id:'COD_MONEDA'      , label:'Moneda'          },
        {id:'COD_LISTA_PRECIO', label:'Lista de Precio' },
        {id:'DECIMALES'       , label:'Moneda'          },
        {id:'COD_SUCURSAL'    , label:'Suc. Destino'    },
      ],
    },
  }
};
const columnDet = [
  { data: 'COD_ARTICULO'         , title: 'Articulo'     , width : 35  , className: 'htLeft', requerido:true      , readOnly:false       , nextValida:true, filter:false , editModalFocus:true}, 
  { data: 'DESC_ARTICULO'        , title: 'Descripcion'  , width : 130 , readOnly:true      , filter:false        , textWrap:true     }  , 
  { data: 'COD_UNIDAD_MEDIDA'    , title: 'U.M'          , width : 25  , className: 'htLeft', requerido:true      , readOnly:false       , filter:false   , nextValida:true, editModalFocus:true }, 
  { data: 'DESC_UNIDAD_MEDIDA'   , title: 'Descripcion'  , width : 120 , readOnly:true      , filter:false   }    , 
  { data: 'CANTIDAD'             , title: 'Cantidad'     , width : 55  , type:'numeric'     , className:'htRight' , requerido:true       , filter:false   , readOnly:false  , format:{pattern: '0,0'}, validaAllExterno:true},
  { data: 'PRECIO_UNITARIO_C_IVA', title: 'Precio Venta' , width : 55  , type:'numeric'     , requerido:true      , className: 'htRight' , filter:false   , readOnly:false  , format:{pattern: '0,0'}, validaAllExterno:true}, 
  { data: 'DESCUENTO'            , title: 'Descuento'    , width : 55  , type:'numeric'     , requerido:false     , className: 'htRight' , readOnly:false , format:{pattern: '0,0'}, validaAllExterno:true},   
  { data: 'MONTO_TOTAL'          , title: 'Total'        , width : 60  , type:'numeric'     , className:'htRight' , readOnly:true        , filter:false   , format:{pattern: '0,0'}},
]
const columnNavigationEnter = [0,2,4]
// F9
const column_vendor = [
  { data: 'COD_VENDEDOR'        , title: 'Código'      , className:'htreft' },
  { data: 'DESC_VENDEDOR'       , title: 'Descrición'  , className:'htreft' },
]
const column_codVenta = [
  { data: 'COD_CONDICION_VENTA' , title: 'Código'      , className:'htreft' },
  { data: 'DESC_CONDICION_VENTA', title: 'Descrición'  , className:'htreft' },
]
const column_cliente = [
  { data: 'COD_CLIENTE'         , title: 'Código'      , className:'htreft' },
  { data: 'DESC_CLIENTE'        , title: 'Descrición'  , className:'htreft' },
]
const column_moneda = [
  { data: 'COD_MONEDA'          , title: 'Código'      , className:'htreft' },
  { data: 'DESC_MONEDA'         , title: 'Descrición'  , className:'htreft' },
]
const column_listaPrecio = [
  { data: 'COD_LISTA_PRECIO'    , title: 'Código'      , className:'htreft' },
  { data: 'DESC_LISTA_PRECIO'   , title: 'Descrición'  , className:'htreft' },
]


// eslint-disable-next-line 
export default {
  columnDet,
  columnNavigationEnter,
  columnModal,
  column_vendor,
  column_codVenta,
  column_cliente,
  column_moneda,
  column_listaPrecio
}