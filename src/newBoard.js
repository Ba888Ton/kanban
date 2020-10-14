'use strict';
export default function newBoard(mock, main, cb){
	let popup = document.getElementById('popup');
	let input = document.getElementById('popup-input');
	document.getElementById('new-list').addEventListener('click', function(){ 
		popup.style.display ='none' ? 'flex':'none';
		input.focus();
		input.select();
	});
	document.getElementById('popup-cancel').addEventListener('click', function(){ popup.style.display ='none'});
	document.getElementById('popup-create').addEventListener('click', addNewBoard);

	function addNewBoard(){	
		if(input.value){
			mock.unshift({title: input.value, issues:[]});
			localStorage.setItem('kanbanDataMock',JSON.stringify(mock));
			popup.style.display ='none';
			input.value = '';
			main.innerHTML = '';
			cb();
		}
		return;
	}
}