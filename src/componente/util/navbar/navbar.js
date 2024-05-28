import React, { memo } from 'react';
import { Layout }      from 'antd';
import Main            from '../main';
import sucursalIcono   from "../../../assets/icons/shop.png";
import './styles.css';

const Navbar = memo(() => {

  const [ isModalVisible , setModalVisible ] = React.useState(false)
  const [ sucursal       , setSucursal     ] = React.useState([])
  
  const getInfoSucursal = async (cod_empresa = null) =>{
    try {
        let params = {cod_empresa};
        let url    = '/pb/infoSucursal'
        let row    = await Main.Request(url, "POST", params).then(resp => { return resp.data.rows });
        return row
    } catch (error) {
        console.log(error);
        return []            
    }
  }
  const showSucursal = async ()=>{        
    let row = await getInfoSucursal(sessionStorage.cod_empresa);
    setSucursal(row);
    setModalVisible(true)
  }
  const selectSucursal = async(cod_sucursal)=>{       
    let info = sucursal.filter((items)=>{return items.CODIGO === cod_sucursal})    
    if(info.length > 0){            
      sessionStorage.setItem('cod_sucursal' , info[0].CODIGO     );
      sessionStorage.setItem('desc_sucursal', info[0].DESCRIPCION);
      sessionStorage.setItem('ruta_logo'    , info[0].RUTA_LOGO  );
      window.location.reload(false);
    }
    setModalVisible(false);
  }

  return (
    <>
     <Main.Modal
        title={'Sucursal'}
        open={isModalVisible}
        onOk={()=>setModalVisible(false)}
        onCancel={()=>setModalVisible(false)}
        footer={false}
    >
        <Main.List
            itemLayout="horizontal"                
            dataSource={sucursal}
            renderItem={(item) => (
                <Main.List.Item>
                    <Main.List.Item.Meta
                        title={
                            // eslint-disable-next-line 
                            <a className='a-empresa' onClick={()=>selectSucursal(item.CODIGO)} href='#' id={item.CODIGO}>
                                {item.CODIGO + " - " + item.DESCRIPCION}
                            </a>
                        }
                    />
                </Main.List.Item>
            )}
        />
    </Main.Modal>
    
    <Layout.Header className='layout-header'>
      <Main.Row>
        <Main.Col span={10}/>
        <Main.Col span={2}>
          <Main.Tooltip color='gold' placement="bottom" title={`Sucursales - ${sessionStorage.desc_sucursal}`}>
            <Main.Button
                type="text"
                icon={<img alt='' src={sucursalIcono} width="30" />}
                size="large"
                className="header-nabvar-icon"
                onClick={showSucursal}
            />
          </Main.Tooltip>
        </Main.Col>
        <Main.Col span={13}/>
      </Main.Row>
    </Layout.Header>
  </>    
  );
});

export default Navbar;