import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import mainColumn      from '../CMCOFFAC/columnModal/mainColumn';


const CMCOFFAC = memo(({refData, FormName, idComp, buttomAccion,validaRow,handleonkeydown}) => {

  return (
    <Main.HandsontableGrid
      refData={refData}
      columns={mainColumn.columns}
      FormName={FormName}
      idComp={idComp}// id del componente
      height={530}
      buttomAccion={buttomAccion}
      validaAllExterno={validaRow}
      f7_and_F8={handleonkeydown}
    />
  );
});

export default CMCOFFAC;