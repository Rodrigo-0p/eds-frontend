import React, { memo }   from 'react';
import { Layout, Menu }  from 'antd';
import { Link }          from 'react-router-dom';
import { Avatar, Space } from 'antd';
import imgAvatar         from '../../../assets/avatar.jpg'
import { Dropdown }      from 'antd';
import Main              from '../main';
import { ShopOutlined
     , HomeOutlined  }   from '@ant-design/icons';
import { Steps }         from 'antd';

import {
    AppstoreOutlined
    , DashboardOutlined
} from '@ant-design/icons';
import './siderBarLetf.css'


const SiderBartLef = memo(({ defaultSelectedKeys, defaultOpenKeys, CloseSession, location}) => {

    const [modulos]   = React.useState(JSON.parse(sessionStorage.getItem("menu_padre")));
    const [tipos]     = React.useState(JSON.parse(sessionStorage.getItem("menu_hijo_1")));
    const [etiquetas] = React.useState(JSON.parse(sessionStorage.getItem("menu_hijo_2")));
    const [formas]    = React.useState(JSON.parse(sessionStorage.getItem("menu_hijo_3")));

    // Logo de la empresa
    const [ Logo                             ] = React.useState( process.env.REACT_APP_BASEURL + sessionStorage.getItem("ruta_logo") );
    const [ isModalVisible , setModalVisible ] = React.useState(false)
    const [ empresa        , setEmpresa      ] = React.useState([])
    const [ sucursal       , setSucursal     ] = React.useState([])
    const [ data           , setData         ] = React.useState([])
    const [ procesoEmp     , setProcesoEmp   ] = React.useState('proceso')
    const infoEmpSuc                           = React.useRef({empresa:{},sucursal:{}})
    

    React.useEffect(()=>{
        // console.log(Logo);
        // eslint-disable-next-line
    },[])


    const items = [
        {
            key: '2',            
            label: (
                <button className='buttonDropdown' onClick={CloseSession} > Cerrar Sesion </button>
            ),
        },
    ];

    const getInfo = async (cod_empresa = null,cod_usuario = null, url) =>{
        try {
            let params = {cod_empresa,cod_usuario};
            let row    = await Main.Request(url, "POST", params).then(resp => { return resp.data.rows });
            return row
        } catch (error) {
            console.log(error);
            return []            
        }
    }
    const showEmpresa = async ()=>{        
        let row = await getInfo('',sessionStorage.cod_usuario, '/pb/infoEmpresa');
        setEmpresa(row);
        setData(row);
        setModalVisible(true)
    }
    const select = async(codigo,id)=>{        
        switch (id) {
            case "EMP":
                let info        = await getInfo(codigo,'','/pb/infoSucursal');
                setProcesoEmp('finish')
                setData(info)
                setSucursal(info);
                let rowEmp = empresa.filter((items)=>{return items.CODIGO === codigo})
                infoEmpSuc.current.empresa = rowEmp[0]
            break;
            case "SUC":
                let rowSuc = sucursal.filter((items)=>{return items.CODIGO === codigo})
                infoEmpSuc.current.sucursal = rowSuc[0]
                setTimeout(()=>{
                    limpiar()
                })
            break;
            default:
                break;
        }
    }
    const limpiar = ()=>{
        sessionStorage.setItem('cod_empresa'  , infoEmpSuc.current.empresa.CODIGO      );
        sessionStorage.setItem('desc_empresa' , infoEmpSuc.current.empresa.DESCRIPCION );
        sessionStorage.setItem('cod_sucursal' , infoEmpSuc.current.sucursal.CODIGO     );
        sessionStorage.setItem('desc_sucursal', infoEmpSuc.current.sucursal.DESCRIPCION);
        sessionStorage.setItem('ruta_logo'    , infoEmpSuc.current.sucursal.RUTA_LOGO  );
        window.location.reload(false);
    }

    const selectButton = async (key)=>{
        switch (key) {
            case "atras":
                if(empresa.length > 0){
                    setData(empresa)                    
                    setProcesoEmp('proceso')
                }else{
                    let row = await getInfo('',sessionStorage.cod_usuario, '/pb/infoEmpresa');
                    setProcesoEmp('finish')
                    setData(row);
                    setEmpresa(row)
                }
                break;
            case "next":
                if(sucursal.length > 0){
                    setData(sucursal)                    
                    setProcesoEmp('finish')
                }else{
                    let row = await getInfo(sessionStorage.cod_empresa,'', '/pb/infoSucursal');
                    setProcesoEmp('finish')
                    setData(row);
                    setSucursal(row);
                }
            break;
            default:
                break;
        }
    }

    return (
        <>
            <Main.Modal
                title={'Empresa'}
                open={isModalVisible}
                onOk={()=>setModalVisible(false)}
                onCancel={()=>setModalVisible(false)}
                footer={false}                
            >

                <Main.List
                    itemLayout="horizontal"                
                    dataSource={data}
                    renderItem={(item) => (
                        <Main.List.Item>
                            <Main.List.Item.Meta
                                title={
                                    // eslint-disable-next-line 
                                    <a className='a-empresa' onClick={()=>select(item.CODIGO,item.ID)} href='#' id={item.CODIGO}>
                                        {item.CODIGO + " - " + item.DESCRIPCION}
                                    </a>
                                }
                            />
                        </Main.List.Item>
                    )}
                />

                <Steps
                    items={[
                        {
                            title: 'Empresa',
                            status: procesoEmp,
                             // eslint-disable-next-line
                            icon: <a className='a-empresa' onClick={()=>selectButton('atras')} href='#'> <HomeOutlined /> </a>,
                        },
                        {
                            title: 'Sucursal',
                            status: 'proceso',
                             // eslint-disable-next-line
                            icon: <a className='a-empresa' onClick={()=>selectButton('next')} href='#'> <ShopOutlined /> </a>,
                        }
                    ]}
                />
            </Main.Modal>
        
            <Layout.Sider id="sidebarLeft" width="250">
                <Menu
                    id="sidebarLeftMenu"                          
                    mode={'inline'}
                    defaultOpenKeys={defaultOpenKeys}
                    defaultSelectedKeys={defaultSelectedKeys}
                    triggerSubMenuAction={"click"}
                    inlineCollapsed={false}
                >
                     
                    <Menu.Item key="logo" style={{alignItems:'end',height:'50px ',background: 'linear-gradient(0deg,#9597a0e0 0%,#61677f 100%)'}} >
                        <Main.Tooltip placement="bottom" title={`Empresa - ${sessionStorage.desc_empresa}`}>
                            <img src={ Logo }
                                alt='logo'
                                className="img-Empresa"
                                style={{ width: "50%",height:'50px',float:"left", marginLeft: "32px",cursor: 'pointer',}}
                                onClick={showEmpresa}/>                            
                         </Main.Tooltip> 
                    </Menu.Item>                   
                    
                    <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']} arrow>
                        <div>
                            <Space className='spaceAvatar' wrap size={16} >
                            
                                <Avatar size={50} icon={<img alt='avatar' src={imgAvatar} />} />
                                <div className='contentUserName' >
                                    <div className='user'>
                                        {sessionStorage.getItem('cod_usuario')}
                                    </div>
                                    <div className='nombreDeusuario'>
                                        - {sessionStorage.getItem('nombre_usuario')}
                                    </div>
                                </div>
                                                        
                            </Space>
                        </div>
                    </Dropdown>
                    <Menu.Item key="home" icon={<DashboardOutlined />}>
                        <Link to="/home">Home</Link>
                    </Menu.Item>
                    {modulos.length > 0
                        ? modulos.map((modulo) => (

                            <Menu.SubMenu key={modulo.NODO_PADRE} icon={<AppstoreOutlined />} title={modulo.DESC_MODULO}>
                                {/* TIPO */}

                                {
                                    tipos.length > 0
                                        ? tipos.filter(tipo => tipo.NODO_PADRE.includes(modulo.NODO_PADRE)).map(tipo => (

                                            <Menu.SubMenu key={tipo.NODO_PADRE + '-' + tipo.NODO_HIJO_1} title={tipo.DESC_MENU}>
                                                {/* ETIQUETA */}
                                                {etiquetas.length > 0
                                                    ? etiquetas.filter(etiqueta => etiqueta.NODO_PADRE.includes(modulo.NODO_PADRE) && etiqueta.NODO_HIJO_1 === tipo.NODO_HIJO_1).map(etiqueta => (
                                                        <Menu.SubMenu key={etiqueta.NODO_PADRE + '-' + etiqueta.NODO_HIJO_1 + '-' + etiqueta.NODO_HIJO_2} title={etiqueta.DESC_NODO}>
                                                            {/* FORMA */}
                                                            {formas.length > 0
                                                                ? formas.filter(forma => forma.NODO_PADRE.includes(modulo.NODO_PADRE) && forma.NODO_HIJO_1 === tipo.NODO_HIJO_1 && forma.NODO_HIJO_2 === etiqueta.NODO_HIJO_2).map(forma => (
                                                                    <Menu.Item key={forma.NODO_PADRE + '-' + forma.NODO_HIJO_1 + '-' + forma.NODO_HIJO_2 + '-' + forma.COD_FORMA}>
                                                                        {forma.RUTA != null
                                                                            ? <Link to={forma.RUTA}>{forma.DESC_FORMA}</Link>
                                                                            : forma.DESC_FORMA
                                                                        }
                                                                    </Menu.Item>
                                                                ))
                                                                : null
                                                            }
                                                        </Menu.SubMenu>
                                                    ))
                                                    : null
                                                }

                                                {formas.length > 0
                                                    ? formas.filter(forma => forma.NODO_PADRE.includes(modulo.NODO_PADRE) && forma.NODO_HIJO_1 === tipo.NODO_HIJO_1 && forma.NODO_HIJO_2 === null).map(forma => (
                                                        <Menu.Item key={forma.NODO_PADRE + '-' + forma.NODO_HIJO_1 + '-' + forma.COD_FORMA}>
                                                            {forma.RUTA != null
                                                                ? <Link to={forma.RUTA}>{forma.DESC_FORMA}</Link>
                                                                : forma.DESC_FORMA
                                                            }
                                                        </Menu.Item>
                                                    ))
                                                    : null
                                                }

                                            </Menu.SubMenu>

                                        ))

                                        : null
                                }
                            </Menu.SubMenu>
                        ))
                        : null
                    }
                </Menu>
            </Layout.Sider>
        </>
    );
});

export default SiderBartLef;