import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';
import updateLocale    from "dayjs/plugin/updateLocale";
import mainColumn      from './columnModal/mainColumn';
import locale          from "antd/es/locale/es_ES";
import dayjs           from "dayjs";
import "dayjs/locale/es";
import {ConfigProvider,DatePicker} from 'antd'
dayjs.extend(updateLocale);
dayjs.updateLocale("es", {
  weekStart: 0
});

const view = memo(({form, refGrid, FormName, idComp, handleKeyDown , dataRef ,refIndex
                   ,handleInputChange, validaAllExterno,nextValidaInput, setClickCell
                   ,setfocusRowIndex,setLastFocusNext, handleKeyUp,activateButtonCancelar
                   ,handleInputEstado}) => {
  
  const maxFocus = [{
    id:idComp         ,
    hasta:"DESCUENTO" ,
    newAddRow:true    ,
    nextId:''
  }];
              
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[8, 2]}>

        <Main.Col id={`form-${FormName}`}  onClick={()=>setClickCell('CAB')} span={7}>
          <Main.Row gutter={[8, 2]}>
            
            <Main.Col span={24}>
              <Main.Form.Item className='form-items' type="text" label={<label style={{ marginLeft: '21px' }}>Número</label>} >
                
                <Main.Form.Item name="TIP_COMPROBANTE" style={{width:'50px',  display:'inline-block', marginRight:'4px'}}>
                  <Main.Input className="search_input" readOnly={true} />
                </Main.Form.Item>

                <Main.Form.Item name="NRO_COMPROBANTE" style={{width:'calc(100% - 58px)',  display:'inline-block', marginRight:'4px'}}>
                  <Main.Input 
                  onKeyUp={handleKeyUp} 
                  onKeyDown={handleKeyDown} 
                  className={`search_input ${FormName}_BLOQUEO_NRO_COMP`}  style={{textAlign:'right'}} />
                </Main.Form.Item>
                
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <ConfigProvider locale={locale} >
                <Main.Form.Item name="FEC_COMPROBANTE" label={<label style={{width:'60px'}}>Fecha</label>}>
                 <DatePicker
                  size='small'
                  style={{width:'calc(100% - 5px)',height:'23px',textAlign:'right'}}
                  onKeyDown={(e)=>handleKeyDown(e)}
                  onChange={(e)=>{activateButtonCancelar(e,"FEC_COMPROBANTE")}}
                  format={['DD/MM/YYYY']}
                  key="FEC_COMPROBANTE"
                  placeholder=""
                  className={`${FormName}_FEC_COMPROBANTE`}
                  onClick={(()=>Main.openStart(`${FormName}_FEC_COMPROBANTE`))}
                />
                </Main.Form.Item>
              </ConfigProvider>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{ color: 'red' }}>*</span>Vendedor</label>}>
                <Main.Form.Item name="COD_VENDEDOR" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} 
                        onKeyDown={handleKeyDown} 
                        onChange={handleInputChange} 
                        onKeyUp={handleKeyUp}
                      />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_VENDEDOR" style={{ width: 'calc(100% - 61px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '60px' }}><span style={{ color: 'red' }}>*</span>Cond. Vent.</label>}>
                <Main.Form.Item name="COD_CONDICION_VENTA" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} 
                        onKeyDown={handleKeyDown} 
                        onChange={handleInputChange} 
                        onKeyUp={handleKeyUp}
                      />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_CONDICION_VENTA" style={{ width: 'calc(100% - 61px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>

            <Main.Col span={24}>
              <Main.Fieldset
                anchoContenedor="100%"
                alineacionTitle="left"
                alineacionContenedor="left"
                margenTop="0px"
                tamañoTitle="12px"
                title="Estado"
                contenedor={
                  <>
                    <Main.Row>
                      <Main.Col span={20}>
                        <Main.Form.Item name="ESTADO"
                          onChange={(e)=>{
                          let valor = {target:{}}
                          valor.target.id    = "ESTADO"
                          valor.target.value = e.target.value                                                
                          handleInputEstado(valor);
                        }} 
                        >
                          <Main.Radio.Group className={`${FormName}_ESTADO ${FormName}_BLOQUEO`}>
                            <Main.Radio style={{fontSize:'10px'}} value="P">
                              Pendiente
                            </Main.Radio>
                            <Main.Radio style={{fontSize:'10px'}} value="C">
                              Confirmado
                            </Main.Radio>
                            <Main.Radio style={{fontSize:'10px', marginRight:'-3px'}} value="A">
                              Anulado
                            </Main.Radio>
                          </Main.Radio.Group>
                        </Main.Form.Item>
                      </Main.Col>

                      <Main.Col span={24}>
                        <ConfigProvider locale={locale} >
                          <Main.Form.Item name="FEC_ESTADO">
                            <Main.Input readOnly={true} style={{textAlign:'right'}} />
                          </Main.Form.Item>
                        </ConfigProvider>
                      </Main.Col>

                    </Main.Row>
                  </>
                }
              />
            </Main.Col> 

            </Main.Col>

          </Main.Row>
        </Main.Col>

        <Main.Col id={`form-${FormName}`}  onClick={()=>setClickCell('CAB')} span={10}>
          <Main.Row gutter={[8,2]}>
            
            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '52px' }}><span style={{ color: 'red' }}>*</span>Cliente</label>}>
                <Main.Form.Item name="COD_CLIENTE" style={{ width: '90px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO requerido`} 
                        onKeyDown={handleKeyDown} 
                        onChange={handleInputChange} 
                        onKeyUp={handleKeyUp}
                      />
                </Main.Form.Item>
                <Main.Form.Item name="NOM_CLIENTE" style={{ width: 'calc(100% - 94px)', display: 'inline-block' }}>
                    <Main.Input onChange={handleInputChange} onKeyDown={handleKeyDown}  readOnly={true} />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '52px' }}>Sub Client.</label>}>
                <Main.Form.Item name="COD_SUBCLIENTE" style={{ width: '90px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className={`${FormName}_BLOQUEO`} 
                        onKeyDown={handleKeyDown} 
                        onChange={handleInputChange} 
                        onKeyUp={handleKeyUp}
                      />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_SUBCLIENTE" style={{ width: 'calc(100% - 94px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>

            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item className='form-items' name="DIRECCION" type="text" label={<label style={{ marginLeft: '7px' }}>Dirección</label>} >
                  <Main.Input readOnly={true} className='search_input' />
              </Main.Form.Item>
            </Main.Col>
            
            <Main.Col span={24}>
              <Main.Form.Item className='form-items' name="DIREC_ELECTRONICA" type="text" label={<label style={{ marginLeft: '21px' }}>E-mail</label>} >
                <Main.Input readOnly={true} className='search_input' />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '52px' }}><span style={{ color: 'red' }}>*</span>List. Prec.</label>}>
              <Main.Form.Item name="COD_LISTA_PRECIO" style={{ width: '52px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input className={`${FormName}_BLOQUEO requerido`} 
                      onKeyDown={handleKeyDown} 
                      onChange={handleInputChange} 
                      onKeyUp={handleKeyUp}
                    />
              </Main.Form.Item>
              <Main.Form.Item name="DESC_LISTA_PRECIO" style={{ width: 'calc(100% - 56px)', display: 'inline-block' }}>
                  <Main.Input disabled/>
              </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
            
            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '51px' }}><span style={{ color: 'red' }}>*</span>Moneda</label>}>
                <Main.Form.Item name="COD_MONEDA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeyDown} 
                    //  onChange={handleInputChange}
                    onKeyUp={handleKeyUp}
                    readOnly={true}
                    className={`requerido`} />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled/>
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>
              
            <Main.Col span={12}>
              <Main.Form.Item label={<label style={{width:'49px'}}>Cambio</label>} name="TIP_CAMBIO">
                <Main.NumberFormat 
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}
                  style={{width:'calc(110% - 13px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={12}>
              <Main.Form.Item label={<label style={{width:'70px'}}>Cambio U$</label>} name="TIP_CAMBIO_US">
                <Main.NumberFormat 
                  className="type-numeri"
                  thousandSeparator="."
                  decimalScale={3}
                  decimalSeparator=","
                  disabled={true}        
                  style={{width:'calc(104% - 10px)'}}
                />
              </Main.Form.Item>
            </Main.Col>

          </Main.Row>
        </Main.Col>

        <Main.Col id={`form-${FormName}`}  onClick={()=>setClickCell('CAB')} span={7}>
          <Main.Card className='CARD-VTPRESAR'>
            
            <Main.Row>
              
              <Main.Col span={24} style={{textAlign:'right'}}>
                <Main.Form.Item name="ES_FISICA" valuePropName="checked" readOnly={true}>
                  <Main.Checkbox> ¿Es Fiscal?</Main.Checkbox>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item className='form-items' name="RUC" type="text" label={<label style={{ marginLeft: '20px' }}>R.U.C/CI</label>} >
                  <Main.Input  readOnly={true} onKeyDown={handleKeyDown} className='search_input'/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item className='form-items' name="TELEFONO" type="text" label={<label style={{ marginLeft: '19px' }}>Teléfono</label>} >
                    <Main.Input readOnly={true} onKeyDown={handleKeyDown} className='search_input'/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="SEXO" label={<label style={{ width: '60px' }}>Sexo</label>}>
                  <Main.Select>
                    <Main.Select.Option value="M">Masculino </Main.Select.Option>
                    <Main.Select.Option value="F">Femenino  </Main.Select.Option>                        
                  </Main.Select>
                  </Main.Form.Item>                
              </Main.Col>
              
              <Main.Col span={24}>

                <Main.Fieldset
                  anchoContenedor="100%"
                  alineacionTitle="left"
                  alineacionContenedor="left"
                  margenTop="0px"
                  tamañoTitle="12px"
                  title="Estado Correo"
                  contenedor={
                    <>
                      <Main.Row>
                        <Main.Form.Item name="ESTADO_CORREO" onChange={(e)=>{
                                                            let valor = {target:{}}
                                                            valor.target.id    = "ESTADO_CORREO"
                                                            valor.target.value = e.target.value               
                                                            handleInputEstado(valor);                                                            
                                                          }} 
                        >
                          <Main.Radio.Group className={`${FormName}_ESTADO`}>
                            <Main.Radio style={{fontSize:'10px'}} value="P">
                              Pendiente
                            </Main.Radio>
                            <Main.Radio style={{fontSize:'10px'}} value="E">
                              Enviado
                            </Main.Radio>
                            <Main.Radio style={{fontSize:'10px', marginRight:'-3px'}} value="N">
                              No enviado
                            </Main.Radio>
                          </Main.Radio.Group>
                        </Main.Form.Item>
                      </Main.Row>
                    </>
                  }
                />

              </Main.Col>                      
            </Main.Row> 

          </Main.Card>         
        </Main.Col>
        <Main.Col span={24} onClick={()=>setClickCell('CAB')}>
          <Main.Form.Item label={<label style={{width:'64px'}}>Coment PDF.</label>} name="OBSERVACION_PDF">
            <Main.Input.TextArea className={`${FormName}_OBSERVACION`}/>
          </Main.Form.Item>
        </Main.Col>
        <Main.Col span={24}>

          <Main.HandsontableGrid
            refData={refGrid}
            columns={mainColumn.columnDet}
            columnModal={mainColumn.columnModal}
            FormName={FormName}
            idComp={idComp}// id del componente
            height={230}
            maxFocus={maxFocus}
            setLastFocusNext={setLastFocusNext}
            setfocusRowIndex={setfocusRowIndex}
            columnNavigationEnter={mainColumn.columnNavigationEnter}
            // colorButtom={false}
            dataCabecera={React.useCallback(()=>{
                return dataRef.current.data[refIndex.current.indice]
              // eslint-disable-next-line
            },[dataRef.current.data])}
            executeCab={true}
            nextValidaInput={nextValidaInput}
            validaAllExterno={validaAllExterno}
            setClickCell={setClickCell}
            // focusEditMode={false} // boolean. true/ el valda externo se ejecuta solo cuando se edita el campo
          />       
        </Main.Col>
        <Main.Col span={19} />
        <Main.Col span={5}>
          <Main.Form.Item label={<label style={{width:'50px'}}>Total</label>} name="TOT_COMPROBANTE">
            <Main.NumberFormat name="TOT_COMPROBANTE" readOnly={true} className="type-numeri ant-input ant-input-sm" thousandSeparator="." decimalSeparator="," 
            style={{textAlign:'right',width:'calc(100% - 0px)'}}/>
          </Main.Form.Item>
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

export default view;