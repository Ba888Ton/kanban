'use strict';
export default function deleteBoard(main, dropdown, menu, mock, setLocal){
let index = 0;
main.addEventListener('click', (e)=>{	
	if(e.target.dataset.boardid){
		if (dropdown[index].classList.value === 'board-dropdown show' 
		&& e.target.dataset.boardid !== index){
				return;
			}
		index = e.target.dataset.boardid;
		dropdown[index].classList.toggle('show');
		menu[index].classList.toggle('show');
		return;
	}
	if(e.target.dataset.delid){
		mock.splice(e.target.dataset.delid, 1);
		localStorage.setItem('kanbanStorage',JSON.stringify(mock));
		main.innerHTML = '';
		setLocal();
		dropdown = document.querySelectorAll('.board-dropdown');
		menu = document.querySelectorAll('.board-menu');
		index-- ;
		return;
	}	
	if (dropdown[index]){
		dropdown[index].classList.remove('show');
		menu[index].classList.remove('show');
	}
	return; 
});
}