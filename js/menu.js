/*Script para facilitar la navegacion en moviles
Esto permite controlar el acceso a los submenús, ya que en ordenadores no hay problema, pues con hover se despliegan los submenús
Sin embargo, en móvil no  se puede hacer hover, así que se manejarán con toques, evitando la navegación al tocar en un enlace que tiene un submenú, en su lugar mostrando dicho submenú
*/
document.addEventListener('DOMContentLoaded', function () {
    if (window.innerWidth <= 768) {
        const menuItems = document.querySelectorAll('.menuitem');
        menuItems.forEach(function (item) {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                link.addEventListener('click', function (e) {
                    if (submenu.style.display === 'block') return; //Si el submenu de este enlace ya esta desplegado y hacemos click en el de nuevo, esta vez sí vamos a su pagina
                    e.preventDefault(); //Evitamos que navegue al hacer click, para poder desplegar el submenu
                    document.querySelectorAll('.submenu').forEach(function (sm) {
                        if (sm !== submenu) sm.style.display = 'none';
                    });
                    submenu.style.display = (submenu.style.display === 'block' ? 'none' : 'block');
                });
            }
        });
    }
});
