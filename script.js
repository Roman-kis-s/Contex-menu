window.onload = function () {
    fetch('./menuConfig.json')
        .then(res => res.json())
        .then(config => {
            createContextMenu(config.items, document.body);
            handleEvents(config.element);
        });
};

function createContextMenu(items, parent) {
    const menu = document.createElement('ul');
    menu.className = 'menu';
    parent.appendChild(menu);
    for (let item of items) {
        const menuItem = document.createElement('li');
        menuItem.className = 'menu-item';
        if (item.disabled) {
            menuItem.classList.add('disabled');
        }
        menuItem.textContent = item.title;
        if (item.handler && !item.disabled) {
            const handler = new Function(item.handler.param, item.handler.body);
            menuItem.addEventListener('click', () => handler(item.title));
        }
        if (item.sub) {
            menuItem.classList.add('submenu');
            createContextMenu(item.sub, menuItem);
        }
        menu.appendChild(menuItem);
    }
}

function handleEvents(elementWithContextMenu) {
    const element = document.querySelector(`${elementWithContextMenu}`);
    const menu = document.querySelector('.menu');
    element.addEventListener('contextmenu', e => {
        e.preventDefault();
        setMenuPosition();


        function setMenuPosition() {
            const menuX = window.innerWidth - e.pageX < menu.offsetWidth ? window.innerWidth - menu.offsetWidth : e.pageX;
            const menuY = window.innerHeight - e.pageY < menu.offsetHeight ? window.innerHeight - menu.offsetHeight : e.pageY;
            menu.style.left = menuX + 'px';
            menu.style.top = menuY + 'px';
            menu.classList.add('show-menu');

            setSubmenuPosition();

            function setSubmenuPosition() {
                const submenus = document.querySelectorAll('.submenu > .menu');
                for (let submenu of submenus) {
                    const subXDirection = window.innerWidth - e.pageX < menu.offsetWidth + submenu.offsetWidth ? 'right' : 'left';
                    submenu.style.left = '';
                    submenu.style.right = '';
                    submenu.style[subXDirection] = '99%';
                    const subYDirection = window.innerHeight - e.pageY < submenu.offsetHeight + menu.offsetHeight ? 'bottom' : 'top';
                    submenu.style.top = '';
                    submenu.style.bottom = '';
                    submenu.style[subYDirection] = 0;
                    console.log(e);
                }
            }
        }
    });

    window.addEventListener('click', e => {
        if (!e.target.classList.contains('menu') && !e.target.classList.contains('submenu')) {
            menu.classList.remove('show-menu');
        }
    });
}