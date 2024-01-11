import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';

const STENSAL = memo(({form,FormName}) => {
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[4, 2]}>
        
        <Main.Col span={12}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Sucursal</label>}>
              <Main.Form.Item name="COD_SUCURSAL" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input 
                  // onKeyDown={handleKeyDown} onChange={handleInputChange} ref={bloqueoArticulo} onKeyUp={handleKeyUp} 
                  />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={12}>            
              <Main.Form.Item className='form-items' name="COD_CLIENTE" type="text" label={<label style={{ marginLeft: '43px' }}>Número</label>} >
                <Main.Input 
                // onKeyUp={handleKeyUp} 
                // onKeyDown={handleKeyDown} 
                // ref={stateRef.bloqueoCliente} 
                className='search_input' name="NRO_COMPROBANTE" 
                />
              </Main.Form.Item>            
          </Main.Col>

          <Main.Col span={12}>

          </Main.Col>


          </Main.Row>
        </Main.Col>
        
        <Main.Col span={12}>
          <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>

          </Main.Row>
        </Main.Col>

      </Main.Row>
    </Main.Form>      
  );
});

export default STENSAL;