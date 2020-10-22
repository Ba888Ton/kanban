'use strict';
import {headerMenu} from './header.js';
import newBoard from './newBoard.js';
import deleteBoard from './deleteBoard.js';
headerMenu();
let mainField = document.querySelector('.main');
let inputItem = document.createElement('input');
let placeholder = document.querySelector('.main_placeholder');
inputItem.classList.add('input');
let boardNum = null;
let boardDropdown = document.querySelectorAll('.board-dropdown');
let boardMenu = document.querySelectorAll('.board-menu');
let storage = JSON.parse(localStorage.getItem('kanbanStorage')) || 
		[{
			title: 'Backlog',
			issues: [],
			},{
			title: 'Ready',
			issues: []
			},{
			title: 'In progress',
			issues: []
			},{
			title: 'Finished',
			issues: []
		}];
let active = document.getElementById('active');
let finished = document.getElementById('finished');
let boardList;
setLocalStorage();

mainField.addEventListener('click', clickListener );
inputItem.addEventListener("change", inputChangeListener );

newBoard(storage, mainField, setLocalStorage);
deleteBoard(mainField, boardDropdown, boardMenu, storage, setLocalStorage);

function inputChangeListener(){
	storage[0].issues.push({
		id: 'task_' + Math.round(Math.random()*1000*61/4),  
		name : inputItem.value, 
		date: new Date().toDateString(),
		hours: new Date().getHours(),
		minutes: new Date().getMinutes(),
	 });
	boardList[0].removeChild(inputItem);
  inputItem.value = '';
  localStorage.setItem('kanbanStorage',JSON.stringify(storage));
  mainField.innerHTML = '';
	setLocalStorage();
}
function clickListener(event){
	let myEvent = event.target;
	let dropDownMenu = document.createElement('ul');
		dropDownMenu.classList.add('dropdown-menu');	
		dropDownMenu.innerHTML = 'Выберите из списка...';
	if (myEvent.dataset.add){
		if (document.querySelector('.dropdown-menu')) return;
		if (document.querySelector('.input')) return;
		for (let i = 0; i < storage.length ; i++){
			if (storage[i].title === myEvent.dataset.add){
				boardNum = i;				
			}
		}
		if (boardNum === 0) {
			boardList[0].appendChild(inputItem);
			buttonDisableSwitcher();
		} else {
			for (let i = 0; i < storage[boardNum - 1].issues.length; i++) {
				let dropDownItem = document.createElement('li');
				dropDownItem.setAttribute('data-count', i);
				dropDownItem.classList.add('dropdown-item');
				dropDownMenu.appendChild(dropDownItem).innerText = storage[boardNum - 1].issues[i].name;
			}
			boardList[boardNum].appendChild(dropDownMenu);
		}
	}
	if (myEvent.closest('.dropdown-item')){
		let choosenItemIndex = myEvent.dataset.count;
		let choosenItem = storage[boardNum - 1].issues.splice(choosenItemIndex, 1);
		storage[boardNum].issues.push(choosenItem[0]);
		localStorage.setItem('kanbanStorage',JSON.stringify(storage));
		for (let i = 0; i < storage.length; i++){
			boardList[i].innerHTML = '';
			dropDownMenu.innerHTML = '';		
			for(let issue of storage[i].issues){
				if (storage[i].issues.length > 0){		
					let listItem = document.createElement('li');
					listItem.classList.add('list-item');
					listItem.innerHTML = issue.name;
					boardList[i].appendChild(listItem);
				}
			}
		}
		scroll();
		buttonDisableSwitcher();
	}
	if (myEvent.closest('.dropdown-menu')){
		let dropdownList = document.querySelectorAll('.dropdown-item');
		for (let i = 0; i < dropdownList.length; i++){
			dropdownList[i].classList.toggle('show');
		}
		document.querySelector('.dropdown-menu') && document.querySelector('.dropdown-menu').classList.toggle('open')
	}
	if (myEvent.dataset.title){
		mainField.innerHTML = ``;
		let boardNum = myEvent.dataset.title; 
		let issuesArray = '';
		if(storage[boardNum].issues.length > 0){
			for(let issue of storage[boardNum].issues){
				issuesArray += `
				<li class="list-item details">
					<span>date: ${issue.date} time: ${issue.hours}:${issue.minutes}</span>
					<h4>Title: ${issue.name}</h4>
					<p>Description: issue description</p>
				</li>`;
			}
		}
		let board = document.createElement('article');
		board.classList.add('board','big_board');
		board.innerHTML = `
		<div class="title-wrap">
			<h3 class="title">${storage[boardNum].title}</h3>
			<button class="close_board">close</button>
		</div>
		<div class="list-wrap">
			<ul class="list" >${issuesArray}</ul>
		</div>
		`;
	mainField.appendChild(board);
	}
	if (myEvent.className === 'close_board'){
		mainField.innerHTML = ``;
		setLocalStorage();
	}
}
function setLocalStorage(){	
	for (let i = 0; i < storage.length; i++){
		let issuesArray = '';
		if(storage[i].issues.length > 0){
			for(let issue of storage[i].issues){
				issuesArray += `<li draggable="true" id="${issue.id}" class="list-item">${issue.name}</li>`;
			}
		}
		let board = document.createElement('article');
		board.classList.add('board');
		board.id = i;
		board.innerHTML = `
		<div class="title-wrap">
			<h3 class="title" data-title="${i}">${storage[i].title}</h3>
			<div class="board-menu" data-boardID="${i}">
			</div>
		</div>
		<ul class="board-dropdown">
			<li>Rename</li>
			<li>Replace</li>
			<li class="delete-board" data-delId="${i}">Delete</li>
		</ul>
		<ul class="list" id="00${i}">${issuesArray}</ul>
		<button class="add-btn" data-add="${storage[i].title}">Add card</button>`;
	mainField.appendChild(board);
	}
	if (storage.length > 0){placeholder.style.display = 'none';
	} else {placeholder.style.display = 'block';}
	boardDropdown = document.querySelectorAll('.board-dropdown');
	boardMenu = document.querySelectorAll('.board-menu');
	boardList = document.querySelectorAll('.list');
	scroll();
	buttonDisableSwitcher();
	for (var i = 0; i < boardList.length; i++) {
		addEventsTosection(boardList[i]);
	}
}
function scroll(){
	let boardList = document.querySelectorAll('.list');
	for (let list of boardList){
		if (list.offsetHeight > 440){
			list.closest('.board').classList.add('scroll');
		} else {list.closest('.board').classList.remove('scroll');}
	}
}
function buttonDisableSwitcher(){
	let boardList = document.querySelectorAll('.list');
	let addButtons = document.querySelectorAll('[data-add]');
	for (let i = 0; i < boardList.length ; i++) {
		if (boardList[i].childElementCount === 0){
			if(i === boardList.length - 1) continue;
			addButtons[i + 1].setAttribute('disabled', true);
		} else {
			if( addButtons[i + 1]){addButtons[i + 1].removeAttribute('disabled');}		
		}
	}
	let closedTask = boardList.length - 1 > 0 ? boardList[boardList.length - 1].childElementCount : 0;
	let activeTask = boardList[0] ? boardList[0].childElementCount : 0; 
	active.innerHTML=`Active task: ${activeTask}`;
	finished.innerHTML=`finished task: ${closedTask}`;
}

// dnd 

function addEventsTosection(section) {
  section.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text', event.target.id);
    event.target.classList.add(`selected`);
  });
  section.addEventListener('dragover', function (event) {
    event.preventDefault();
  });
	section.addEventListener(`dragend`, (event) => {
		event.target.classList.remove(`selected`);
	});
  section.addEventListener('drop', function (event) {
    let transfer = document.getElementById(event.dataTransfer.getData('text'));
    if (+event.target.id === +transfer.parentNode.id  + 1) {
			event.target.appendChild(transfer);
      var elementObj = {
				id : 'task_' + Math.round(Math.random()*1000*61/4), 
        name: transfer.innerText,
				date: new Date().toDateString(),
				hours: new Date().getHours(),
				minutes: new Date().getMinutes(),
      }
      for (let i = 0; i < storage.length; i++) {
        storage[i].issues = storage[i].issues.filter(issue => issue.id !== transfer.id)
      }
      storage[event.target.parentElement.id].issues.push(elementObj);
			localStorage.setItem('kanbanStorage', JSON.stringify(storage));
		}
		mainField.innerHTML = ''
		setLocalStorage();
  });
}
