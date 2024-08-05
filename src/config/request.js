import axios from "axios";

export const Request = async(url, method, data ) =>{
    return await axios({
        method: method,
        url: process.env.REACT_APP_BASEURL + url,
        data: data,
        headers:{
                    Authorization : sessionStorage.getItem("token"),
                    authuser      : sessionStorage.getItem("cod_usuario"),
                    authpass      : sessionStorage.getItem("hash"),
                },
    })
    .then( response =>{
        return response;
    })
    .catch(error => {

        if(error.response !== undefined){
            if (error.response.status === 401) {
                sessionStorage.clear();
                window.location.href="/";
            }
        }else{
            console.log('Request Error =>', error);
        }
    })
}

export const RequestImg = async(url, method, data ) =>{
    try {
        var formData = new FormData();
        formData.append("image",data);
        return await axios({
            method: method,
            url: process.env.REACT_APP_BASEURL + url,
            data: formData,
            headers: {
                Authorization : sessionStorage.getItem("token")      ,
                'Content-Type': 'multipart/form-data'                ,
                authuser      : sessionStorage.getItem("cod_usuario"),
                authpass      : sessionStorage.getItem("hash")       ,
            }
        })
        .then( response =>{
            return response;
        })    
    } catch (error) {        
        console.log(error);
        return {data:[]}
    }
}