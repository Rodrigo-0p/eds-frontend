import React    from 'react';
import Main     from '../../../../../componente/util/main';
import urlMain  from './url/mainUrl';
import './styles/CMPROVEC.css'

const columnModal = {
  urlValidar : [{ COD_PERSONA: urlMain.url_validar_persona} ],
  urlBuscador: [{ COD_PERSONA: urlMain.url_buscar_persona} ],
  title      : [{ COD_PERSONA: "Personas" }                ],
  COD_PERSONA: [
    { data: 'COD_PERSONA'  		    , title: 'Codigo'       , className:'htLeft'  },
    { data: 'DESC_PERSONA' 		    , title: 'Descripción'  , className:'htLeft'  },
  ],
  config: {} 
};

const concepto    = [   
  { id:'N' , label:'Ninguno' , isNew:true}, 
  { id:'C' , label:'C.I.F'  }, 
  { id:'F' , label:'F.O.B'  },   
]

export const columns = [
  { data: 'COD_PROVEEDOR' , title: 'código'    , width : 5  , className: 'htLeft'   , readOnly:true   , sorter:false      , searchIcon:true}, 
  { data: 'COD_PERSONA'   , title: 'Persona'   , width : 5  , className: 'htLeft'   , readOnly:true   , filter:true       , searchIcon:true , requerido:true  , sorter: false  },  
  { data: 'DESC_PERSONA'  , title: 'Nombre'    , width : 45 , className: 'htLeft'   , readOnly:true   , filter:true       , searchIcon:true , requerido:true }, 
  { data: 'TIP_FLETE'     , title: 'Tip.Flete' , width : 5  , className: 'htLeft'   , readOnly:false  , filter:false      , options:concepto,  type:'select'},
  { data: 'ESTADO'        , title: 'Estado'    , width : 5  , className: 'htCenter' , type:'checkbox' , checkbox:['A','I'], readOnly:false }, 
]

const columnNavigationEnter = [1,3,4];

const CMPROVE = ({ refs, FormName, form, setfocusRowIndex,nextFocus,idComp ,handleKeydown,handleInputChange ,f6_add}) => {

  React.useEffect(() => {
    // refs.current.hotInstance.loadData(data)
    // eslint-disable-next-line
  }, [])

  const handleCheckbox = (e,options)=>{
    let rowValue = {target:{'id':e.target.id,'value': form.getFieldValue(e.target.id) === true ? options[0] : options[1]}}
    handleInputChange(rowValue)
  }

  return (
   <>
      <Main.HandsontableGrid
        refData={refs}
        columns={columns}
        FormName={FormName}
        idComp={idComp}// id del componente
        height={330}
        setfocusRowIndex={setfocusRowIndex}
        columnNavigationEnter={columnNavigationEnter}
        colorButtom={false}
        nextFocus={nextFocus}
        columBuscador={"COD_PROVEEDOR"}
        columnModal={columnModal}
        f7_and_F8={f6_add}
      />
      <Main.Form autoComplete="off" size="small" form={form} style={{ marginTop: '10px', paddingBottom: '15px' }}>
        <Main.Row>
          

          <Main.Col span={18}>

            <Main.Row gutter={[2,2]}>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '86px' }}>Prov. Principal</label>}>
                  <Main.Form.Item name="COD_PROVEEDOR_REF" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange} />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_PROVEEDOR_REF" style={{ width: 'calc(100% - 105px)', display: 'inline-block' }}>
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Col span={24}>
                  <Main.Form.Item label={<label style={{ width: '85px' }}>Cuent. Contable</label>}>
                    <Main.Form.Item name="COD_CUENTA_CONTABLE" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                        <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange} />
                    </Main.Form.Item>
                      <Main.Form.Item name="DESC_CUENTA_CONTABLE" style={{ width: 'calc(100% - 104px)', display: 'inline-block' }}>
                          <Main.Input disabled />
                      </Main.Form.Item>
                  </Main.Form.Item>
                </Main.Col>
              </Main.Col>
            
              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '86px' }}>Cuent. Cont. Mil.</label>}>
                    <Main.Form.Item name="COD_CUENTA_CONT" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                        <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange} />
                    </Main.Form.Item>
                    <Main.Form.Item name="DESC_CUENTA_REF" style={{ width: 'calc(100% - 104px)', display: 'inline-block' }}>
                        <Main.Input disabled />
                    </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Row>

                  <Main.Col span={16}>
                    <Main.Form.Item label={<label style={{ width: '86px' }}>Banco</label>}>
                      <Main.Form.Item name="COD_BANCO" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                          <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange}/>
                      </Main.Form.Item>
                      <Main.Form.Item name="DESC_BANCO" style={{ width: 'calc(100% - 104px)', display: 'inline-block' }}>
                          <Main.Input disabled />
                      </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>
                  
                  <Main.Col span={8}>
                    <Main.Form.Item name="CUENTA_BANCARIA" label={<label style={{ width: '95px' }}>Cuent. Banc.</label>}>
                        <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange}/>
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={16}>
                    <Main.Form.Item label={<label style={{ width: '86px' }}><span style={{ color: 'red' }}>*</span>Cond. Comp.</label>}>
                      <Main.Form.Item name="COD_CONDICION_COMPRA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                          <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange} className='requerido'/>
                      </Main.Form.Item>
                      <Main.Form.Item name="DESC_CONDICION_COMPRA" style={{ width: 'calc(100% - 104px)', display: 'inline-block' }}>
                          <Main.Input disabled />
                      </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>
                  
                  <Main.Col span={8}>
                    <Main.Form.Item name="CANT_DIA_ANT" label={<label style={{ width: '95px' }}>Límit. Rendición</label>}>
                        <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange}/>
                    </Main.Form.Item>
                  </Main.Col>
                  
                  <Main.Col span={16}>
                    <Main.Form.Item label={<label style={{ width: '85px' }}><span style={{ color: 'red' }}>*</span>Moneda</label>}>
                        <Main.Form.Item name="COD_MONEDA" style={{ width: '100px', display: 'inline-block', marginRight: '4px' }}>
                            <Main.Input onKeyDown={handleKeydown} onChange={handleInputChange} className="requerido" />
                        </Main.Form.Item>
                        <Main.Form.Item name="DESC_MONEDA" style={{ width: 'calc(100% - 104px)', display: 'inline-block' }}>
                            <Main.Input disabled />
                        </Main.Form.Item>
                    </Main.Form.Item>
                  </Main.Col>

                  <Main.Col span={8}>
                    <Main.Form.Item name="IND_PRIORIDAD" label={<label style={{ width: '95px' }}>Prioridad/Compra</label>}>
                      <Main.Select
                        onChange={(e)=>{
                          let value = {target : {id:'IND_PRIORIDAD',value:e}}
                          handleInputChange(value)                        
                        }}
                        >
                        <Main.Select.Option value="N">Ninguna   </Main.Select.Option>
                        <Main.Select.Option value="S">Semanal   </Main.Select.Option>
                        <Main.Select.Option value="Q">Quincenal </Main.Select.Option>
                        <Main.Select.Option value="M">Mensual   </Main.Select.Option>
                        <Main.Select.Option value="A">Anual     </Main.Select.Option>
                    </Main.Select>

                    </Main.Form.Item>
                  </Main.Col>

                </Main.Row>
              </Main.Col>


            </Main.Row>

          </Main.Col>

          {/* --------------------------------------------------------------- */}

          <Main.Col span={6}>
            <Main.Card className='card-proveedor' >
              <Main.Row gutter={[2, 2]}>

                <Main.Col span={24}>
                  <Main.Form.Item name="IND_DIF_PRECIO"
                      valuePropName="checked"
                      onKeyDown={handleKeydown}
                      onChange={(e) => handleCheckbox(e, ["S", "N"])}
                    >
                      <Main.Checkbox> Permite Precio Diferente </Main.Checkbox>
                  </Main.Form.Item>
                </Main.Col>

                <Main.Col span={12}>
                   <Main.Row>
                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="EXENTO"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Exento </Main.Checkbox>
                      </Main.Form.Item>
                    </Main.Col>

                    <Main.Col span={24} />                      

                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_LOCAL"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Local </Main.Checkbox>
                      </Main.Form.Item>
                    </Main.Col>

                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_RETENCION_IVA"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Ret. IVA </Main.Checkbox>
                      </Main.Form.Item>                      
                    </Main.Col>

                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_EXPORTADOR"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox>Exportador </Main.Checkbox>
                      </Main.Form.Item>                      
                    </Main.Col>

                  </Main.Row>                  
                </Main.Col>

                <Main.Col span={12}>
                   <Main.Row>
                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_TRANSPORTISTA"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Transportista </Main.Checkbox>
                      </Main.Form.Item>
                    </Main.Col>

                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_DESPACHANTE"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Despachante </Main.Checkbox>
                      </Main.Form.Item>
                    </Main.Col>

                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_CAJA_CHICA"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Caja Chica </Main.Checkbox>
                      </Main.Form.Item>
                    </Main.Col>

                    <Main.Col span={24} />
                      
                    <Main.Col span={24}>
                      <Main.Form.Item
                          name="IND_ODC"
                          valuePropName="checked"
                          onKeyDown={handleKeydown}
                          onChange={(e) => handleCheckbox(e, ["S", "N"])}
                        >
                          <Main.Checkbox> Exige ODC </Main.Checkbox>
                      </Main.Form.Item>
                    </Main.Col>

                  </Main.Row>                  
                </Main.Col>
             
              </Main.Row>
            </Main.Card>
          </Main.Col>
            
          <Main.Col span={23} style={{ bottom: '-5px', width: '80%',}}>
            <Main.Row>
              <Main.Col span={6}>
                <Main.Form.Item name="COD_USUARIO" label={<label style={{ width: '85px' }}>Creado Por</label>}>
                  <Main.Input className="search_input"  style={{ width: '100%', display: 'inline-block' }} disabled />
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={7}>
                <Main.Form.Item name="FEC_ALTA" label={<label style={{ width: '70px' }}>Fecha Alta</label>}>
                  <Main.Input className="search_input"  style={{ width: '91%', display: 'inline-block' }} disabled />
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Form.Item name="MODIFICADO_POR" label={<label style={{ width: '70px' }}>Mod. por</label>}>
                  <Main.Input className="search_input"  style={{ width: '95%', display: 'inline-block' }} disabled />
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={5}>
                <Main.Form.Item name="FEC_MODIFICACION" label={<label style={{ width: '60px' }}>Fecha Mod.</label>}>
                  <Main.Input className="search_input"  style={{ width: '100%', display: 'inline-block' }} disabled />
                </Main.Form.Item>
              </Main.Col>
            </Main.Row>
          </Main.Col>

        </Main.Row>
        
      </Main.Form>
    </>
  );
};

export default CMPROVE;