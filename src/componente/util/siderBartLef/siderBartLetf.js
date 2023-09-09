import React, { memo } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
    AppstoreOutlined
    , DashboardOutlined
} from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import imgAvatar from '../../../assets/avatar.jpg'
import './siderBarLetf.css'
import { Dropdown } from 'antd';


const SiderBartLef = memo(({ defaultSelectedKeys, defaultOpenKeys, CloseSession}) => {

    const [modulos] = React.useState(JSON.parse(sessionStorage.getItem("menu_padre")));
    const [tipos] = React.useState(JSON.parse(sessionStorage.getItem("menu_hijo_1")));
    const [etiquetas] = React.useState(JSON.parse(sessionStorage.getItem("menu_hijo_2")));
    const [formas] = React.useState(JSON.parse(sessionStorage.getItem("menu_hijo_3")));

    const items = [
        {
            key: '2',            
            label: (
                <button className='buttonDropdown' onClick={CloseSession} > Cerrar Sesion </button>
            ),
        },
    ];

    return (
        <Layout.Sider id="sidebarLeft" width="250">
            <Menu
                id="sidebarLeftMenu"
                mode={'inline'}
                defaultOpenKeys={defaultOpenKeys}
                defaultSelectedKeys={defaultSelectedKeys}
                triggerSubMenuAction={"click"}               
            >
                <Menu.Item key="logo" >
                    <Link to="/home">Logo EDS</Link>      
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
    );
});

export default SiderBartLef;