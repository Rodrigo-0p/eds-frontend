import React   from 'react';
import Main    from '../../../../../../componente/util/main';
import mainUrl from './url/mainUrl';

const columnModal = {
  urlValidar : [{ 
                  COD_LISTA_PRECIO : mainUrl.url_valida_listPrec ,
                  COD_PAIS         : mainUrl.url_valida_pais     ,
                  COD_PROVINCIA    : mainUrl.url_valida_provincia,
                  COD_CIUDAD       : mainUrl.url_valida_ciudad   ,
                }],
  urlBuscador: [{ 
                  COD_LISTA_PRECIO : mainUrl.url_buscar_listPrec ,
                  COD_PAIS         : mainUrl.url_buscar_pais     ,
                  COD_PROVINCIA    : mainUrl.url_buscar_provincia,
                  COD_CIUDAD       : mainUrl.url_buscar_ciudad
                }],
  title      : [{ 
                  COD_LISTA_PRECIO : "Lista de Precio"   ,
                  COD_PAIS         : "Pais"              ,
                  COD_PROVINCIA    : "Provincia"         ,
                  COD_CIUDAD       : "Ciudad" 
                }],
  COD_LISTA_PRECIO: [
    { data: 'COD_LISTA_PRECIO' , title: 'Codigo'       , className:'htLeft'  },
    { data: 'DESC_LISTA_PRECIO', title: 'Descripción'  , className:'htLeft'  },
  ],
  COD_PAIS: [
    { data: 'COD_PAIS'       , title: 'Codigo'       , className:'htLeft'  },
    { data: 'DESC_PAIS'      , title: 'Descripción'  , className:'htLeft'  },
  ],
  COD_PROVINCIA: [
    { data: 'COD_PROVINCIA'  , title: 'Codigo'       , className:'htLeft'  },
    { data: 'DESC_PROVINCIA' , title: 'Descripción'  , className:'htLeft'  },
  ],
  COD_CIUDAD: [
    { data: 'COD_CIUDAD'  , title: 'Codigo'       , className:'htLeft'  },
    { data: 'DESC_CIUDAD' , title: 'Descripción'  , className:'htLeft'  },
  ],

  config:{
    COD_SUBCLIENTE:{
      depende_de:[],
      dependencia_de:[],
      depende_ex_cab:[
        {id: 'COD_CLIENTE' ,label: 'Cliente'}
      ],
    },
    COD_PAIS:{
      depende_de:[],
      dependencia_de:[{id:'COD_PROVINCIA',label: 'Dpto.' ,  remove:true},
                      {id:'COD_CIUDAD'   ,label: 'Ciudad',  remove:true}
                      ],
      depende_ex_cab:[],
    },
    COD_PROVINCIA:{
      depende_de    :[{id:'COD_PAIS'    ,label: 'Dpto.' , remove:true}],
      dependencia_de:[{id:'COD_CIUDAD'  ,label: 'Ciudad', remove:true}],
      depende_ex_cab:[],
    },
    COD_CIUDAD:{
      depende_de    :[{id:'COD_PAIS'     ,label: 'Dpto.', remove:true},
                      {id:'COD_PROVINCIA',label: 'Dpto.', remove:true}
                     ],
      dependencia_de:[],
      depende_ex_cab:[],
    },
  },
};

export const columns = [
  { data: 'COD_SUBCLIENTE'  , title: 'Sub Cliente'    , width : 20  , type:'numeric'        , className: 'htLeft'                 , readOnly:true }, 
  { data: 'DESCRIPCION'     , title: 'Descripción'    , width : 130 , readOnly:false        , filter:false    , textWrap:true     , requerido:true , upper:true}, 
  { data: 'COD_LISTA_PRECIO', title: 'Lista de Precio', width : 20  , className: 'htLeft'   , readOnly:false  , sorter:false      , requerido:true}, 
  { data: 'COD_PAIS'        , title: 'Pais'           , width : 20  , className: 'htLeft'   , readOnly:false  , filter:false      , requerido:true , sorter: false ,upper:true },  
  { data: 'COD_PROVINCIA'   , title: 'Dpto.'          , width : 20  , className: 'htLeft'   , readOnly:false  , filter:false      , requerido:true , upper:true}, 
  { data: 'COD_CIUDAD'      , title: 'Ciudad'         , width : 20  , className: 'htLeft'   , readOnly:false  , filter:false      , requerido:true , upper:true},
  { data: 'ACTIVO'          , title: 'Activo'         , width : 20  , className: 'htCenter' , type:'checkbox' , checkbox:['S','N'], readOnly:false }, 
  { data: 'ES_CLIENTE_PRI'  , title: 'Princ.'         , width : 20  , className: 'htCenter' , type:'checkbox' , checkbox:['S','N'], readOnly:false }, 
]
const columnNavigationEnter = [1,2,3,4,5,6,7];

const VTCLIENT = ({ form     , refGrid  , FormName         , idComp                  , handleKeyDown  , handleKeyUp, handleInputChangeDet, 
                    form_det , stateRef , handleInputChange, handleInputChangeNumber , handleCheckbox , dataRef    , setfocusRowIndex,onKeyDownDet,setLastFocusNext  }) => {
  return (    
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[8, 2]}>

      <Main.Col id={`form-${FormName}`} span={17}>
        <Main.Row gutter={[8, 2]}>
          
          <Main.Col span={10}>
            <Main.Form.Item className='form-items' name="COD_CLIENTE" type="text" label={<label style={{ marginLeft: '50px' }}>Cliente</label>} >
              <Main.Input 
              onKeyUp={handleKeyUp} 
              onKeyDown={handleKeyDown} 
              ref={stateRef.bloqueoCliente} 
              className='search_input' name="COD_CLIENTE" />
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={9}>
            <Main.Form.Item className='form-items' name="COD_PERSONA" type="text" label={<label style={{ marginLeft: '5px' }}><span style={{ color: 'red' }}>*</span>Persona</label>} >
              <Main.Input 
              onKeyUp={handleKeyUp} 
              onChange={handleInputChange} 
              onKeyDown={handleKeyDown} 
              ref={stateRef.bloqueoPersona} 
              className='search_input requerido' name="COD_PERSONA" />
            </Main.Form.Item>
          </Main.Col>

          <Main.Col span={5}>
            <Main.Form.Item name="IND_SUB_CLIENTE"
                valuePropName="checked"
                onKeyDown={handleKeyDown}
                onChange={(e) => handleCheckbox(e, ["S", "N"])}
                >
                <Main.Checkbox> Tiene subcliente </Main.Checkbox>
            </Main.Form.Item>
          </Main.Col>
          
          <Main.Col span={19}>
            <Main.Row>

              <Main.Col span={24}>
                <Main.Form.Item className='form-items' name="NOMBRE" type="text" label={<label style={{ marginLeft: '43px' }}>Nombre</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item className='form-items' name="NOMB_FANTASIA" type="text" label={<label style={{ marginLeft: '2px' }}>Nombre Fantasia</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item className='form-items' name="DIRECCION_CAB" type="text" label={<label style={{ marginLeft: '38px' }}>Dirección</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="PAIS" type="text" label={<label style={{ marginLeft: '64px' }}>País</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="NRO_DOCUMENTO" type="text" label={<label style={{ marginLeft: '17px' }}>Nro. Doc</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>
              
              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="PROVINCIA" type="text" label={<label style={{ marginLeft: '58px' }}>Dpto</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="NRO_DIG_VER" type="text" label={<label style={{ marginLeft: '16px' }}>Dig. Verif</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="CIUDAD" type="text" label={<label style={{ marginLeft: '48px' }}>Ciudad</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>            

              <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="TELEFONO" type="text" label={<label style={{ marginLeft: '18px' }}>Teléfono</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item name="ESTADO" label={<label style={{width:'83px'}}>Estado</label>}>
                  <Main.Select 
                    onChange={(e)=>{
                      let value = {target : {id:'ESTADO',value:e}}
                      handleInputChange(value)                        
                    }} className="ESTADO" allowClear placeholder="" >
                    <Main.Select.Option value="A">Activo</Main.Select.Option>
                    <Main.Select.Option value="I">Inactivo</Main.Select.Option>
                    <Main.Select.Option value="M">Moroso</Main.Select.Option>
                  </Main.Select>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}/>
              {/* <Main.Col span={12}>
                <Main.Form.Item className='form-items' name="TELEFONO2" type="text" label={<label style={{ marginLeft: '10px' }}>Teléfono 2</label>} >
                  <Main.Input disabled className='search_input' />
                </Main.Form.Item>
              </Main.Col> */}
            
              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '82px' }}><span style={{ color: 'red' }}>*</span>Con. Venta</label>}>
                  <Main.Form.Item name="COD_CONDICION_VENTA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} className='requerido' />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_CONDICION_VENTA" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '82px' }}>Causal Bloqueo</label>}>
                  <Main.Form.Item name="COD_CAUSAL" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_CAUSAL" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '82px' }}>Cadena Cliente</label>}>
                  <Main.Form.Item name="COD_GRUPO_CLIENTE" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                      <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange}/>
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_GRUPO_CLIENTE" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                      <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>
          </Main.Col>

          <Main.Col span={5}/>

          <Main.Col span={12}>
          </Main.Col>

        </Main.Row>
      </Main.Col>

      <Main.Col id={`form-${FormName}`} span={7}>
        <Main.Row gutter={[8, 2]}>

        <Main.Fieldset
            anchoContenedor="100%"
            alineacionTitle="left"
            alineacionContenedor="left"
            margenTop="0px"
            tamañoTitle="13px"
            title="Limite de Crédito"
            contenedor={
              <Main.Row>

                <Main.Col span={24}>
                  <Main.Form.Item className='form-items' name="LIMITE_CREDITO" type="text" label={<label style={{ marginLeft: '46px' }}><span style={{ color: 'red' }}>*</span>Monto</label>} >
                    <Main.NumberFormat 
                      className="type-numeri requerido"
                      thousandSeparator="."
                      decimalScale={3}
                      decimalSeparator=","
                      onChange={(e)=>handleInputChangeNumber(e)}
                      onKeyDown={handleKeyDown} 
                      style={{width:'calc(104% - 13px)'}}
                    />
                  </Main.Form.Item>
                </Main.Col>

                <Main.Col span={24}>
                  <Main.Form.Item label={<label style={{ width: '85px' }}><span style={{ color: 'red' }}>*</span>Moneda</label>}>
                    <Main.Form.Item name="COD_MONEDA_LIMITE" style={{ width: '50px', display: 'inline-block', marginRight: '4px' }}>
                        <Main.Input onKeyDown={handleKeyDown} onChange={handleInputChange} className='requerido'
                        />
                    </Main.Form.Item>
                    <Main.Form.Item name="DESC_MONEDA_LIMITE" style={{ width: 'calc(100% - 55px)', display: 'inline-block' }}>
                        <Main.Input disabled />
                    </Main.Form.Item>
                  </Main.Form.Item>
                </Main.Col>

                
                <Main.Col span={24}>
                  <Main.Form.Item className='form-items' name="SALDO" type="text" label={<label style={{ marginLeft: '0px' }}>Factura / Pedidos</label>} >
                    <Main.NumberFormat 
                      className="type-numeri"
                      thousandSeparator="."
                      decimalScale={3}
                      decimalSeparator=","
                      onChange={(e)=>handleInputChangeNumber(e)}
                      onKeyDown={handleKeyDown} 
                      style={{width:'calc(104% - 13px)'}}
                      disabled
                    />
                  </Main.Form.Item>
                </Main.Col>

                
                <Main.Col span={24}>
                  <Main.Form.Item className='form-items' name="VALORES" type="text" label={<label style={{ marginLeft: '42px' }}>Cheques</label>} >
                    <Main.NumberFormat 
                      className="type-numeri"
                      thousandSeparator="."
                      decimalScale={3}
                      decimalSeparator=","
                      onChange={(e)=>handleInputChangeNumber(e)}
                      onKeyDown={handleKeyDown} 
                      style={{width:'calc(104% - 13px)'}}
                      disabled
                    />
                  </Main.Form.Item>
                </Main.Col>

                
                <Main.Col span={24}>
                  <Main.Form.Item className='form-items' name="POSIBLE" type="text" label={<label style={{ marginLeft: '10px' }}>Factura posible</label>} >
                    <Main.NumberFormat 
                      className="type-numeri"
                      thousandSeparator="."
                      decimalScale={3}
                      decimalSeparator=","
                      onChange={(e)=>handleInputChangeNumber(e)}
                      onKeyDown={handleKeyDown} 
                      style={{width:'calc(104% - 13px)'}}
                      disabled
                    />
                  </Main.Form.Item>
                </Main.Col>
                  
              </Main.Row>
            }
          />
        </Main.Row>
      </Main.Col>      

      <Main.Col span={24}>

        <Main.Tabs activeKey={'FORM1'} type="card" size={"small"}>
          <Main.TabPane tab="Sub-Cliente" key="FORM1">
            <Main.HandsontableGrid
              refData={refGrid}
              columns={columns}
              FormName={FormName}
              idComp={idComp}// id del componente
              height={120}
              setfocusRowIndex={setfocusRowIndex}
              columnNavigationEnter={columnNavigationEnter}
              colorButtom={false}
              dataCabecera={dataRef}
              columBuscador={"COD_PROVEEDOR"}
              columnModal={columnModal}
              setLastFocusNext={setLastFocusNext}
            />
          </Main.TabPane>
        </Main.Tabs>

      </Main.Col>
      
      <Main.Col span={8}>
        <Main.Row>

          <Main.Col span={24}>
            <Main.Form.Item className='form-items' name="DESC_CIUDAD" type="text" label={<label style={{ marginLeft: '11px' }}>Ciudad</label>} >
            <Main.Input  onKeyUp={handleKeyUp} disabled className='search_input'/>
            </Main.Form.Item>    
          </Main.Col>
                  
          <Main.Col span={24}>
            <Main.Form.Item className='form-items' name="BARRIO" type="text" label={<label style={{ marginLeft: '17px' }}>Barrio</label>}  >
              <Main.Input 
                onKeyUp={handleKeyUp}                 
                onChange={handleInputChangeDet}
                onKeyDown={onKeyDownDet}
                className='search_input' name="BARRIO" />
              </Main.Form.Item>
          </Main.Col>  

          <Main.Col span={24}>
            <Main.Form.Item className='form-items' name="DIRECCION" type="text" label={<label style={{ marginLeft: '2x' }}>Dirección</label>} >
              <Main.Input 
                onKeyUp={handleKeyUp} 
                onChange={handleInputChangeDet}              
                onKeyDown={onKeyDownDet}
                className='search_input' name="DIRECCION" />
            </Main.Form.Item>
          </Main.Col>
          
        </Main.Row>
      </Main.Col>
      
      <Main.Col span={9}>
        <Main.Row>
            <Main.Col span={24}>
              <Main.Form.Item className='form-items' name="EMAIL" type="text" label={<label style={{ marginLeft: '63px' }}>Email</label>} >
                <Main.Input 
                  onKeyUp={handleKeyUp} 
                  onChange={handleInputChangeDet}
                  onKeyDown={onKeyDownDet}
                  className='search_input' name="EMAIL" />
              </Main.Form.Item>
            </Main.Col>
        
            <Main.Col span={24}>
              <Main.Form.Item className='form-items' name="DESC_LISTA_PRECIO" type="text" label={<label style={{ marginLeft: '19px' }}>Lista de Precio</label>} >
                <Main.Input 
                  onKeyUp={handleKeyUp} 
                  onKeyDown={onKeyDownDet}
                  disabled
                  className='search_input' name="DESC_LISTA_PRECIO" />
              </Main.Form.Item>
            </Main.Col>

        </Main.Row>
      </Main.Col>
          
      <Main.Col span={7}/>
      {/* <Main.Col span={7}>
        <Main.Form.Item className='form-items' name="SALDO" type="text" label={<label style={{ marginLeft: '134px' }}>Saldo</label>} >
          <Main.NumberFormat 
            className="type-numeri"
            thousandSeparator="."
            decimalScale={3}
            decimalSeparator=","
            disabled
            style={{width:'calc(100% - 3px)'}}
          />
        </Main.Form.Item>      
      </Main.Col> */}
      
      {/* <Main.Col span={8}>
        <Main.Row>


        </Main.Row>
      </Main.Col> */}
        
      <Main.Col span={24} style={{ marginBottom:'7px', width: '80%', fontSize:'12px' }} >
        <div className='total_registro_pg'>
          Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
        </div>
      </Main.Col>
      </Main.Row>
    </Main.Form>
  );
};

export default VTCLIENT;