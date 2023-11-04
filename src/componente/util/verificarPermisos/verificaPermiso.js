import _ from 'underscore';
const VerificaPermiso = (FormName) => {
  var Permisos = {};
  var value    = JSON.parse(sessionStorage.getItem('acceso'));
  var info     = _.flatten(_.filter(value, function (item) {
    return item.NOM_FORMA === FormName;
  }));
  if (info.length > 0) {
    Permisos = {
      'insert': info[0].PUEDE_INSERTAR,
      'update': info[0].PUEDE_ACTUALIZAR,
      'delete': info[0].PUEDE_BORRAR,
    };
  } else {
    Permisos = {
      'insert': '',
      'update': '',
      'delete': '',
    };
  }
  return Permisos;
}

const getPermisosEspecial = (form) => {
  var rows = [];
  var permiso = JSON.parse(sessionStorage.getItem('permiso_especial'));
  if(permiso === null || permiso === undefined) return [];
  permiso = permiso.filter( item => item.NOM_FORMA === form );
  if( permiso.length === 0 ) return [];
  rows = _.pluck(permiso, 'PARAMETRO');
  return rows;
}


export {
  VerificaPermiso,
  getPermisosEspecial
}