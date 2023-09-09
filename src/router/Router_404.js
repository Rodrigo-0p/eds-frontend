import { Result, Button } from 'antd';
import{ Link } from 'react-router-dom';
const NotFound = () =>{
    return (
        <Result
            status="404"
            title="404"
            subTitle="Esta pagina no existe"
            extra={<Link to="/home">
                        <Button type="primary">Volver a inicio</Button> 
                    </Link>
                   }
        />
    );
}

export default NotFound;