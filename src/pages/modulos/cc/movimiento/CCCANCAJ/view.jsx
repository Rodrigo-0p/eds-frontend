import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import mainColumn      from './columnModal/mainColumn'

const CCCANCAJ = memo((props) => {
  return (
    <Main.Form size="small" autoComplete="off" form={props.form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[4, 2]}>
        <Main.Col span={24}>

          <Main.Form.Item>
            <Main.Form.Item style={{textAlign:'center'}} name="TIP_COMP" onChange={props.handleRadioChange}>
              <Main.Radio.Group style={{textAlign:'center'}} >
                <Main.Radio style={{paddingRight:'12px'}} value="PED" >Compra Balcón</Main.Radio>
                <Main.Radio style={{paddingRight:'26px'}} value="NCR" >Nota de Crédito</Main.Radio>
              </Main.Radio.Group>
            </Main.Form.Item>
          </Main.Form.Item>

        </Main.Col>
        <Main.Col span={24}>
        <Main.HandsontableGrid
          refData={props.refGrid}
          columns={mainColumn.columns}
          FormName={props.FormName}
          idComp={props.idComp}// id del componente
          height={470}
          buttomAccion={props.buttomAccion}
          validaAllExterno={props.validaRow}
          f7_and_F8={props.handleonkeydown}
        />
        </Main.Col>
        <Main.Col span={24} style={{margenTop:'55px', bottom:'2px', width: '80%', fontSize:'12px' }}>
          <div className='total_registro_pg'>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>
      </Main.Row>
    </Main.Form>
  );
});

export default CCCANCAJ;