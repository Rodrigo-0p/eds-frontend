import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'TIPO_SOCIEDAD',
    url: mainUrl.url_valida_tipo_sociedad,    
    out:[ 'DESC_TIPO_SOCIEDAD'],
    data:[],
    rel:[],
    next: 'COD_SECTOR', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,    
  },
  {
    input: 'COD_SECTOR',
    url: mainUrl.url_valida_sector,    
    out:[ 'DESC_SECTOR'],
    data:[],
    rel:[],
    next: 'COD_PAIS', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,
  },
  {
    input: 'COD_PAIS',
    url: mainUrl.url_valida_pais,
    out:[ 'DESC_PAIS'],
    data:[],
    rel:[],
    next: 'COD_PROVINCIA', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,
  },
  {
    input: 'COD_PROVINCIA',
    url: mainUrl.url_valida_provincia,
    out:[ 'DESC_PROVINCIA'],
    data:['COD_PAIS'],
    rel:[],
    next: 'COD_CIUDAD', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,
  },
  {
    input: 'COD_CIUDAD',
    url: mainUrl.url_valida_ciudad,
    out:[ 'DESC_CIUDAD'],
    data:['COD_PAIS','COD_PROVINCIA'],
    rel:[],
    next: 'COD_BARRIO', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true ,
    idFocus   : false,
    idSelect  : true ,
  },
  {
    input: 'COD_BARRIO',
    url: mainUrl.url_valida_barrio,
    out:[ 'DESC_BARRIO'],
    data:['COD_PAIS','COD_PROVINCIA','COD_CIUDAD'],
    rel:[],
    next: 'DIRECCION', 
    // ---
    requerido : false,
    valor_ant : null ,
    validaNull: false,
    idFocus   : false,
    idSelect  : true ,
  },
  {
    input: 'COD_IDENT',
    url: mainUrl.url_valida_tipo_identificacion,
    out:[ 'DESC_IDENT'],
    data:[],
    rel:[],
    next: 'NRO_DOCUMENTO', 
    // ---
    requerido : true,
    valor_ant : null ,
    validaNull: true,
    idFocus   : false,
    idSelect  : true ,
  },
  {
    input: 'NRO_DOCUMENTO',
    url: mainUrl.url_valida_Documento,
    out:['NRO_DIG_VER','NRO_DOCUMENTO'],
    data:['COD_PERSONA','COD_IDENT'],
    rel:[],
    next: 'NRO_DIG_VER', 
    // ---
    requerido : true,
    valor_ant : null,
    validaNull: true,
    idFocus   : false,
    idSelect  : true,
  },
  {
    input: 'NRO_DIG_VER',
    url: mainUrl.url_valida_Digito,
    out:['NRO_DIG_VER'],
    data:['COD_IDENT','NRO_DOCUMENTO'],
    rel:[],
    next: 'DIREC_ELECTRONICA', 
    // ---
    requerido : true,
    valor_ant : null,
    validaNull: true,
    idFocus   : false,
    idSelect  : true,
  },
  
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
    "COD_PERSONA"    : {title: 'Persona'         , column: mainColumn.columns_persona            , url: mainUrl.url_buscar_persona             }
  , "TIPO_SOCIEDAD"  : {title: 'Tipo Sociedad'   , column: mainColumn.columns_tipoSociedad       , url: mainUrl.url_buscar_tipo_sociedad       }
  , "COD_SECTOR"     : {title: 'Sector Economico', column: mainColumn.columns_sector             , url: mainUrl.url_buscar_sector              }
  , "COD_PAIS"       : {title: 'Pais'            , column: mainColumn.columns_pais               , url: mainUrl.url_buscar_pais                }
  , "COD_PROVINCIA"  : {title: 'Provincia'       , column: mainColumn.columns_provincia          , url: mainUrl.url_buscar_provincia           }
  , "COD_CIUDAD"     : {title: 'Ciudad'          , column: mainColumn.columns_ciudad             , url: mainUrl.url_buscar_ciudad              }
  , "COD_BARRIO"     : {title: 'Barrio'          , column: mainColumn.columns_barrio             , url: mainUrl.url_valida_barrio              }
  , "COD_IDENT"      : {title: 'Identificación'  , column: mainColumn.columns_tipoIdentificacion , url: mainUrl.url_buscar_tipo_identificacion }
}

const main = {
    validaInput
  , restablecerValida
  , ModalF9
}

export default main