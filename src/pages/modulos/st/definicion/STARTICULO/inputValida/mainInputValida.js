import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_PROVEEDOR_DFLT',
    url: mainUrl.url_valida_proveedor,  
    out:[ 'DESC_PROVEEDOR'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_MARCA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_MARCA',
    url: mainUrl.url_valida_marca,  
    out:[ 'DESC_MARCA'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_LINEA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_LINEA',
    url: mainUrl.url_valida_linea,  
    out:[ 'DESC_LINEA'],
    data:['COD_EMPRESA','COD_MARCA'],
    rel:[],
    next: 'COD_CATEGORIA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_CATEGORIA',
    url: mainUrl.url_valida_segmento,  
    out:[ 'DESC_CATEGORIA'],
    data:['COD_EMPRESA','COD_LINEA'],
    rel:[],
    next: 'COD_RUBRO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },
  {
    input: 'COD_RUBRO',
    url: mainUrl.url_valida_rubro,  
    out:[ 'DESC_RUBRO'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_GRUPO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_GRUPO',
    url: mainUrl.url_valida_grupo,  
    out:[ 'DESC_GRUPO'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_IVA', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_IVA',
    url: mainUrl.url_valida_iva,  
    out:[ 'DESC_IVA'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'MANEJA_COSTO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  }
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_PROVEEDOR_DFLT" : {title: 'Proveedor' , column: mainColumn.columns_proveedor , url: mainUrl.url_buscar_proveedor  },
  "COD_MARCA"          : {title: 'Marca'     , column: mainColumn.columns_marca     , url: mainUrl.url_buscar_marca      },
  "COD_LINEA"          : {title: 'Linea'     , column: mainColumn.columns_linea     , url: mainUrl.url_buscar_linea      },
  "COD_CATEGORIA"      : {title: 'Segmento'  , column: mainColumn.column_segmento   , url: mainUrl.url_buscar_segmento   },
  "COD_RUBRO"          : {title: 'Rubro'     , column: mainColumn.columns_rubro     , url: mainUrl.url_buscar_rubro      },
  "COD_GRUPO"          : {title: 'Grupo'     , column: mainColumn.columns_grupo     , url: mainUrl.url_buscar_grupo      },
  "COD_IVA"            : {title: 'Iva'       , column: mainColumn.columns_iva       , url: mainUrl.url_buscar_iva        },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main