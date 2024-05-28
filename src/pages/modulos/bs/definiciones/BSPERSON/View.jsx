import React, { memo } from 'react';
import Main            from '../../../../../componente/util/main';

const BSPERSON = memo(({handleKeyDow  , handleKeyUp , handleInputChange,  form, refs }) => {
  
  
  return (

    <div className='conatainer-form'>
  
      <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>

        <Main.Row gutter={[8, 2]}>
          <Main.Col span={4}>
            <Main.Form.Item className='form-items' name="COD_PERSONA" type="text" label={<label style={{ marginLeft: '5px' }}>Codigo</label>} >
              <Main.Input onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} ref={refs.refCodPersona} className='search_input' name="COD_PERSONA" />
            </Main.Form.Item>
          </Main.Col>
          <Main.Col span={12}>

            <Main.Row gutter={[2, 2]}>

              <Main.Col span={24}>
                <Main.Form.Item  className='form-items' name="NOMBRE" type="text" label={<label style={{ marginLeft: '41px' }}><span style={{ color: 'red' }}>*</span>Nombre</label>} >
                  <Main.Input onInput={Main.mayuscula} onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow}  className='search_input requerido' />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item className='form-items' name="NOMB_FANTASIA" type="text" label={<label style={{ marginLeft: '3px' }}>Nombre Fantasia</label>} >
                  <Main.Input  onInput={Main.mayuscula} onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} className='search_input' />
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>

          </Main.Col>
          <Main.Col span={7}>
            <Main.Card>
              <Main.Form.Item name="ES_FISICA">                                  
              
                <Main.Radio.Group onChange={handleInputChange} id="ES_FISICA" name='ES_FISICA' >
                  <Main.Radio value={'S'}>Fisica</Main.Radio>
                  <Main.Radio value={'N'}>Juridica</Main.Radio>
                </Main.Radio.Group>
                        
              </Main.Form.Item>            
            </Main.Card>
          </Main.Col>
        </Main.Row>

        <Main.Row gutter={[8, 2]}>

          <Main.Col span={8} style={{ marginTop: '20px' }}>

            <Main.Row>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Tip. Sociedad</label>}>
                  <Main.Form.Item name="TIPO_SOCIEDAD" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} min={0} className="search_input requerido" />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_TIPO_SOCIEDAD" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }}>
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Sector</label>}>
                  <Main.Form.Item name="COD_SECTOR" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} min={0} className="search_input requerido" />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_SECTOR" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }} >
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Pais</label>}>
                  <Main.Form.Item onInput={Main.mayuscula} onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} name="COD_PAIS" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className="search_input requerido" />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_PAIS" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }} >
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Dpto.</label>}>
                  <Main.Form.Item onInput={Main.mayuscula} onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} name="COD_PROVINCIA" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className="search_input requerido" />
                  </Main.Form.Item>
                  <Main.Form.Item  name="DESC_PROVINCIA" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }} >
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Ciudad</label>}>
                  <Main.Form.Item  onInput={Main.mayuscula} onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} name="COD_CIUDAD" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className="search_input requerido" />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_CIUDAD" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }} >
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item label={<label style={{ width: '90px' }}>Barrio</label>}>
                  <Main.Form.Item min={0} onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} name="COD_BARRIO" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                    <Main.Input className="search_input" />
                  </Main.Form.Item>
                  <Main.Form.Item name="DESC_BARRIO" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }} >
                    <Main.Input disabled />
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="DIRECCION" label={<label style={{ width: '90px' }}>Dirección</label>}>
                  <Main.Input  onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} className="search_input" />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="TELEFONO" label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Teléfono</label>}>
                  <Main.Input  onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} className="search_input requerido" />
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>

          </Main.Col>

          <Main.Col span={8}>
            <Main.Divider orientation="left">Identificación</Main.Divider>

            <Main.Col span={24}>
              <Main.Form.Item label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Tipo</label>}>
                <Main.Form.Item onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} name="COD_IDENT" style={{ width: '80px', display: 'inline-block', marginRight: '4px' }}>
                  <Main.Input onInput={Main.mayuscula} className="search_input requerido" />
                </Main.Form.Item>
                <Main.Form.Item name="DESC_IDENT" style={{ width: 'calc(100% - 84px)', display: 'inline-block' }} >
                  <Main.Input disabled />
                </Main.Form.Item>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item name="NRO_DOCUMENTO" label={<label style={{ width: '90px' }}><span style={{ color: 'red' }}>*</span>Documento</label>}>
                <Main.Input onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} ref={refs.refNroDocumen} className="search_input requerido" />
              </Main.Form.Item>
            </Main.Col>


            <Main.Col span={24}>
              <Main.Form.Item name="NRO_DIG_VER" label={<label style={{ width: '90px' }}>Digito Verif.</label>}>
                <Main.Input onKeyUp={handleKeyUp} ref={refs.refDigVerif} onChange={handleInputChange} onKeyDown={handleKeyDow} className="search_input" />
              </Main.Form.Item>
            </Main.Col>


            <Main.Col span={24}>
              <Main.Form.Item name="DIREC_ELECTRONICA" label={<label style={{ width: '90px' }}>Email</label>}>
                <Main.Input onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} type='mail' className="search_input" />
              </Main.Form.Item>
            </Main.Col>


            <Main.Col span={24}>
              <Main.Form.Item name="PAGINA_WEB" label={<label style={{ width: '90px' }}>Web</label>}>
                <Main.Input onKeyUp={handleKeyUp} onChange={handleInputChange} onKeyDown={handleKeyDow} className="search_input" />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24}>
              <Main.Form.Item name="SEXO" label={<label style={{ width: '90px' }}>Sexo</label>}>
                <Main.Select 
                  onChange={(e)=>{
                    let value = {target : {id:'SEXO',value:e}}
                    handleInputChange(value)                        
                  }} >
                  <Main.Select.Option value="M">Masculino  </Main.Select.Option>
                  <Main.Select.Option value="F">Femenino   </Main.Select.Option>                        
                </Main.Select>
                </Main.Form.Item>                
            </Main.Col>


          </Main.Col>

          <Main.Col span={8}>
            <Main.Divider orientation="left">La persona esta definida como</Main.Divider>

          </Main.Col>

          <Main.Col span={24} style={{ position: 'absolute', bottom: '40px', width: '80%',}}>
            <Main.Row>
              <Main.Col span={6}>
                <Main.Form.Item name="ALTA_POR" label={<label style={{ width: '100px' }}>Creado Por</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Form.Item name="FEC_ALTA" label={<label style={{ width: '100px' }}>Fecha Alta</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Form.Item name="ACTUALIZADO_POR" label={<label style={{ width: '100px' }}>Modificado por</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Form.Item name="FEC_ACTUALIZACION" label={<label style={{ width: '100px' }}>Fecha Modificado</label>}>
                  <Main.Input className="search_input" disabled />
                </Main.Form.Item>
              </Main.Col>
            </Main.Row>
          </Main.Col>

          <Main.Col span={24} style={{ position: 'absolute', bottom:'20px', width: '80%', fontSize:'12px' }} >
            <div className='total_registro_pg'>
              Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
            </div>
          </Main.Col>
        </Main.Row>

      </Main.Form>

    </div>
  );
});

export default BSPERSON;