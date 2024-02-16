import mainUrl    from '../url/mainUrl'
import mainColumn from '../columnModal/mainColumn';

var validaInput = [
  {
    input: 'COD_SUCURSAL',
    url: mainUrl.url_valida_sucursal,  
    out:[ 'DESC_SUCURSAL'],
    data:['COD_EMPRESA'],
    rel:[],
    next: 'COD_MOTIVO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,    
  },{
    input: 'COD_MOTIVO',
    url: mainUrl.url_valida_motivo,
    out:[ 'DESC_MOTIVO'],
    data:['COD_EMPRESA','COD_SUCURSAL'],
    rel:[],
    next: 'COMENTARIO', 
    // ---
    requerido : false ,
    valor_ant : null  ,
    validaNull: true  ,
    idFocus   : true  ,
    idSelect  : false ,
    // nextEjecute:true  ,
  },  
];

const restablecerValida = ()=>{
  // eslint-disable-next-line 
  validaInput.map((items)=>{items.valor_ant = null})
}

const ModalF9 = {
  "COD_SUCURSAL"  : {title: 'Sucursal' , column: mainColumn.columns_sucursal  , url: mainUrl.url_buscar_sucursal  },
  "COD_MOTIVO"    : {title: 'Motivo'   , column: mainColumn.columns_motivo    , url: mainUrl.url_buscar_motivo    },
}

const main = {
  validaInput
, restablecerValida
, ModalF9
}

export default main