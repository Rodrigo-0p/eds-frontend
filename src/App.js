import React        from "react";
import AppRouter    from "./router/AppRouter";
import { ConfigProvider } from 'antd';

function App() {
  return (    
  <ConfigProvider theme={{ hashed: false }}>
    <AppRouter />
  </ConfigProvider>
  );
}

export default App;
