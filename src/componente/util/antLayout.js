import React        from 'react';
import { Layout }   from "antd";
import SessionTime  from "./sessionTime";
import Sider        from './siderBartLef/siderBartLetf';
import { Redirect,
       useHistory } from 'react-router-dom';
import Navbar       from './navbar/navbar';

// CSS GENERICO
import '../../assets/css/styles.css';
import '../../assets/css/form.css';
import '../../assets/css/layout.css';

const { Content } = Layout;

const AntLayout = (props) => {

  const history               = useHistory();
  const [defaultOpenKeys]     = React.useState(props.defaultOpenKeys);
  const [defaultSelectedKeys] = React.useState(props.defaultSelectedKeys);

  const CloseSession = (e) => {
    sessionStorage.clear();
    history.push("/login")
  };

  if (!sessionStorage.getItem("hash")) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout  >
       {/* className="main-layout" */}
      <SessionTime CloseSession={CloseSession} />
      <Sider defaultOpenKeys={defaultOpenKeys} defaultSelectedKeys={defaultSelectedKeys} CloseSession={CloseSession} />

      <Layout className="site-layout" id="system-layout">

        <Navbar  CloseSession={CloseSession} />

          <Content
            id="site-content"
            className="ant-layout-content"
            // style={{
            //   padding: 10,
            //   height: 'calc(100vh - 70px)',
            //   margin: 5,
            //   marginBottom:'0px',
            //   overflow:'auto',
            //   scrollbarWidth: 'none',              
            // }}
          > 
            {props.children}                   
        </Content>

      </Layout>
    </Layout>
  );
};

export default AntLayout;