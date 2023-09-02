import React, { memo } from 'react';
import { Layout }      from 'antd';
import './styles.css';

const Navbar = memo(() => {
  return (
    <Layout.Header></Layout.Header>
  );
});

export default Navbar;