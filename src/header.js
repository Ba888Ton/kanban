'use strict';
export function headerMenu(){
    let avatar = document.querySelector('.avatar');
    let userDropDown = document.createElement('div');

    userDropDown.innerHTML = `
        <ul class="personal-menu">
            <li class="header-drop-item">
                <a class="drop-link" href="#">My account</a>
            </li>
            <li class="header-drop-item">
                <a class="drop-link" href="#">My company</a>
            </li>
            <li class="header-drop-item">
                <a class="drop-link" href="#">My Boards</a>
            </li>
            <li class="header-drop-item">
                <a class="drop-link" href="#">Logout</a>
            </li>
        </ul>
    `;
    userDropDown.classList.add('drop-down');
    avatar.addEventListener('click', () => {
        if (avatar.lastChild !== userDropDown){
            avatar.appendChild(userDropDown);
        } else {
            avatar.removeChild(userDropDown);
        }
        avatar.classList.toggle('arrow-up');
    });
}