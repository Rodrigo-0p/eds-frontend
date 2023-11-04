export const Menu = (form) => {
     var rows = [];
    var menu = JSON.parse(sessionStorage.getItem('menu'));
    if(menu === null || menu === undefined) return [];
    menu = menu.filter( item => item.COD_FORMA === form );
    if( menu.length === 0 ) return [];
    let menuLetf    = '';
    var nodo_padre  = menu[0].NODO_PADRE;
    if(nodo_padre !== null) menuLetf  += nodo_padre +'-'
    var nodo_hijo_1 = menu[0].NODO_HIJO_1;
    if(nodo_hijo_1 !== null) menuLetf += nodo_hijo_1
    var nodo_hijo_2 = menu[0].NODO_HIJO_2;    
    if(nodo_hijo_2 !== null) menuLetf += '-'+nodo_hijo_2
    menuLetf+='-'+form
    rows.push(menuLetf)
    return rows;
}
export const DireccionMenu = (form) => {
    var rows = [];
    var menu = JSON.parse(sessionStorage.getItem('menu'));
    if(menu === null || menu === undefined) return [];    
    menu = menu.filter( item => item.COD_FORMA === form )
    if( menu.length === 0 ) return [];
    var nodo_padre  = menu[0].NODO_PADRE;
    if(nodo_padre   !== null) rows.push( nodo_padre );
    var nodo_hijo_1 = menu[0].NODO_HIJO_1;
    if(nodo_hijo_1  !== null) rows.push( nodo_padre  + '-' + nodo_hijo_1 );
    var nodo_hijo_2 = menu[0].NODO_HIJO_2;    
    if(nodo_hijo_2  !== null) rows.push( nodo_padre  + '-' + nodo_hijo_1 + '-' + nodo_hijo_2);
    return rows;
}