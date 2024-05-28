import React, { memo } from 'react';
import Main            from '../../../../../../componente/util/main';
import locale          from "antd/es/locale/es_ES";
import mainColumn      from './columnModal/mainColumna';
import {ConfigProvider,DatePicker} from 'antd'
import "dayjs/locale/es";

const CCRENAGR = memo(({refGrid         , form            , FormName, idComp,  handleCheckbox,
                        setClickCell    , handleKeyDown   , activateButtonCancelar, buscarButton,
                        setfocusRowIndex, validaAllExterno, f7_and_F8
                      }) => {
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[4, 2]}>
        
      <Main.Col span={10} onClick={()=>setClickCell('CAB')}>
        <Main.Row id={`form-cab-${FormName}`} gutter={[2,2]}>
          
          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}>Sucursal</label>}>
              <Main.Form.Item name="COD_SUCURSAL" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={Main.onKeyDownBloqueo} readOnly={true} />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_SUCURSAL" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}>Cobrador</label>}>
              <Main.Form.Item name="COD_COBRADOR" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={Main.onKeyDownBloqueo} readOnly={true} />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_COBRADOR" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>
            
          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}>Cliente</label>}>
              <Main.Form.Item name="COD_CLIENTE" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_CLIENTE" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>
          
          <Main.Col span={10}>
            <ConfigProvider locale={locale} >
              <Main.Form.Item name="FECHA_DESDE" label={<label style={{width:'82px'}}>Periodo</label>}>
                <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FECHA_DESDE")}}
                  format={['DD/MM/YYYY']}
                  key="FECHA_DESDE"
                  placeholder=""
                  className={`${FormName}_FECHA_DESDE`}
                  onClick={(()=>Main.openStart(`${FormName}_FECHA_DESDE`,0))}
                />
              </Main.Form.Item>
            </ConfigProvider>
          </Main.Col>
          <Main.Col span={7}>
            <ConfigProvider locale={locale} >
              <Main.Form.Item name="FECHA_HASTA">
                <DatePicker
                  style={{width:'100%',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FECHA_HASTA")}}
                  format={['DD/MM/YYYY']}
                  key="FECHA_HASTA"
                  placeholder=""
                  className={`${FormName}_FECHA_HASTA`}
                  onClick={(()=>Main.openStart(`${FormName}_FECHA_HASTA`,0))}
                />
              </Main.Form.Item>
            </ConfigProvider>
          </Main.Col>

          <Main.Col span={7}>
            <Main.Form.Item name="NRO_PLANILLA" label={<label style={{ width: '40px' }}>Planilla</label>}>
              <Main.Input readOnly={true} />              
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={24}>
            <Main.Form.Item label={<label style={{ width: '82px' }}>Cuenta</label>}>
              <Main.Form.Item name="NRO_CUENTA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onKeyDown={handleKeyDown} />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_CUENTA" style={{ width: 'calc(100% - 57px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
            </Main.Form.Item>
          </Main.Col>
          
        </Main.Row>
      </Main.Col>
      <Main.Col span={14} onClick={()=>setClickCell('CAB')}>
        <Main.Row>
          <Main.Col span={12}>

          <Main.Fieldset
            anchoContenedor="100%"
            alineacionTitle="left"
            alineacionContenedor="left"
            margenTop="-1px"
            tamañoTitle="13px"
            title="Filtro"
            contenedor={
              <Main.Row>
                <Main.Col span={12}>
                  <Main.Form.Item name="FCO" valuePropName="checked" onKeyDown={handleKeyDown}>
                    <Main.Checkbox onChange={(e) => handleCheckbox(e, ["S", "N"])}> Factura Contado </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>

                <Main.Col span={12}>
                  <Main.Form.Item name="TAR" valuePropName="checked" onKeyDown={handleKeyDown}>
                    <Main.Checkbox onChange={(e) => handleCheckbox(e, ["S", "N"])}> Saldo Tarjeta </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>
            
                <Main.Col span={12}>
                  <Main.Form.Item name="FCR" valuePropName="checked" onKeyDown={handleKeyDown}>
                      <Main.Checkbox onChange={(e) => handleCheckbox(e, ["S", "N"])}> Factuta Crédito </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>

                <Main.Col span={12}>
                  <Main.Form.Item name="ND" valuePropName="checked" onKeyDown={handleKeyDown}>
                    <Main.Checkbox onChange={(e) => handleCheckbox(e, ["S", "N"])}> Notas Débito </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>

                <Main.Col span={24}>
                  <Main.Form.Item name="VEN" valuePropName="checked" onKeyDown={handleKeyDown}>
                      <Main.Checkbox onChange={(e) => handleCheckbox(e, ["S", "N"])}> Factura Balcón </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>

                <Main.Col span={24} style={{paddingBottom:'7px'}}>
                  <Main.Form.Item name="CHE" valuePropName="checked" onKeyDown={handleKeyDown}>
                    <Main.Checkbox onChange={(e) => handleCheckbox(e, ["S", "N"])}> Cheques </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>

              </Main.Row>
            }/>
            
          </Main.Col>

          <Main.Col span={12}>
            <Main.Button id='BUTTOMBUSCAR' onClick={()=>buscarButton()} className={'Button_'+FormName} type='primary'>
              Buscar Registros
            </Main.Button>            
          </Main.Col>

        </Main.Row>
      </Main.Col>

      <Main.Col span={24}>
        
        <Main.HandsontableGrid
          refData={refGrid}
          columns={mainColumn.columnDet}
          FormName={FormName}
          modalClick={true}
          idComp={idComp}// id del componente
          height={342}
          setfocusRowIndex={setfocusRowIndex}
          columnNavigationEnter={mainColumn.columnNavigationEnter}
          validaAllExterno={validaAllExterno}
          setClickCell={setClickCell}
          f7_and_F8={f7_and_F8}
        />       
      </Main.Col>
      
      <Main.Col span={6}>
        <Main.Form.Item name="DESC_CLIENTE_DET"  label={<label style={{width:'35px'}}>Cliente</label>}>
          <Main.Input style={{width:'100%', display:'inline-block'}} readOnly={true}/>
        </Main.Form.Item>
      </Main.Col>
      <Main.Col span={13} />
      <Main.Col span={5}>
        <Main.Form.Item label={<label style={{width:'70px'}}>Total a Cobrar</label>} name="TOT_COMPROBANTE">
          <Main.NumberFormat name="TOT_COMPROBANTE" onKeyDown={Main.onKeyDownBloqueo} readOnly={true} className="type-numeri ant-input ant-input-sm" thousandSeparator="." decimalSeparator="," 
          style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
        </Main.Form.Item>
      </Main.Col>
      </Main.Row>

      <Main.Col span={24} style={{marginTop:'11px', bottom:'2px', fontSize:'12px' }}>
        <div className='total_registro_pg'>
          Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
        </div>
      </Main.Col>

    </Main.Form>
  );
});

export default CCRENAGR;