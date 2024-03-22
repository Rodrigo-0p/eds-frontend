import React, { memo } from 'react';
import urlMain         from './url/mainUrl';
import Main            from '../../../../../componente/util/main';

const columnModal = {
  urlValidar : [{ COD_PERSONA: urlMain.url_validar_persona} ],
  urlBuscador: [{ COD_PERSONA: urlMain.url_buscar_persona}  ],
  title      : [{ COD_PERSONA: "Personas" }                 ],
  COD_PERSONA: [
    { data: 'COD_PERSONA'  		    , title: 'Codigo'       , className:'htLeft'  },
    { data: 'DESC_PERSONA' 		    , title: 'Descripción'  , className:'htLeft'  },
  ],
  config: {} 
};

export const columns = [
  { data: 'COD_VENDEDOR'  , title: 'Cod Vendedor', width : 10 , className: 'htLeft'   , readOnly:true   , sorter:false      , searchIcon:true}, 
  { data: 'COD_PERSONA'   , title: 'Persona'     , width : 10 , className: 'htLeft'   , readOnly:false  , filter:true       , searchIcon:true , requerido:true  , sorter: false  },  
  { data: 'DESC_PERSONA'  , title: 'Nombre'      , width : 45 , className: 'htLeft'   , readOnly:true   , filter:true       , searchIcon:true}, 
  { data: 'ACTIVO'        , title: 'Activo'      , width : 5  , className: 'htLeft'   , type:'checkbox' , checkbox:['S','N'], readOnly:false },
  { data: 'ABREVIATURA'   , title: 'Abreviatura' , width : 15 , className: 'htLeft'   , upper:true }, 
]
const columnNavigationEnter = [1,3,4];

const VTVENDE = memo(({FormName,refs,idComp,setLastFocusNext}) => {

  const maxFocus = [{
    id:`${FormName}`    ,
    hasta:"ABREVIATURA" ,
    newAddRow:true      ,
    nextId:''
  }];

  
  return (
    <Main.HandsontableGrid
      refData={refs}
      columns={columns}
      FormName={FormName}
      idComp={idComp}// id del componente
      height={540}
      columnNavigationEnter={columnNavigationEnter}
      colorButtom={false}
      setLastFocusNext={setLastFocusNext}
      maxFocus={maxFocus}
      columBuscador={"COD_VENDEDOR"}
      columnModal={columnModal}
    />
  );
});

export default VTVENDE;