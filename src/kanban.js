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
let counter = localStorage.getItem('counter') || 0;
let boardDropdown = document.querySelectorAll('.board-dropdown');
let boardMenu = document.querySelectorAll('.board-menu');
let dataMock = JSON.parse(localStorage.getItem('kanbanDataMock')) || 
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

newBoard(dataMock, mainField, setLocalStorage);
deleteBoard(mainField, boardDropdown, boardMenu, dataMock, setLocalStorage);

function inputChangeListener(){
	let newItem = document.createElement('li');
	newItem.classList.add('list-item');
	newItem.innerHTML = inputItem.value;
	boardList[0].appendChild(newItem);
	dataMock[0].issues.push({
		id : 'task ' + counter, 
		name : inputItem.value, 
		date: new Date().toDateString(),
		hours: new Date().getHours(),
		minutes: new Date().getMinutes(),
	 });
	boardList[0].removeChild(inputItem);
	counter++;
	inputItem.value = '';
	localStorage.setItem('kanbanDataMock',JSON.stringify(dataMock)); 
	localStorage.setItem('counter', counter); 
	scroll();
}
function clickListener(event){
	let myEvent = event.target;
	let dropDownMenu = document.createElement('ul');
		dropDownMenu.classList.add('dropdown-menu');	
		dropDownMenu.innerHTML = 'Выберите из списка...';
	if (myEvent.dataset.add){
		if (document.querySelector('.dropdown-menu')) return;
		if (document.querySelector('.input')) return;
		for (let i = 0; i < dataMock.length ; i++){
			if (dataMock[i].title === myEvent.dataset.add){
				boardNum = i;				
			}
		}
		if (boardNum === 0) {
			boardList[0].appendChild(inputItem);
			buttonDisableSwitcher();
		} else {
			for (let i = 0; i < dataMock[boardNum - 1].issues.length; i++) {
				let dropDownItem = document.createElement('li');
				dropDownItem.setAttribute('data-count', i);
				dropDownItem.classList.add('dropdown-item');
				dropDownMenu.appendChild(dropDownItem).innerText = dataMock[boardNum - 1].issues[i].name;
			}
			boardList[boardNum].appendChild(dropDownMenu);
		}
	}
	if (myEvent.closest('.dropdown-item')){
		let choosenItemIndex = myEvent.dataset.count;
		let choosenItem = dataMock[boardNum - 1].issues.splice(choosenItemIndex, 1);
		dataMock[boardNum].issues.push(choosenItem[0]);
		localStorage.setItem('kanbanDataMock',JSON.stringify(dataMock));
		for (let i = 0; i < dataMock.length; i++){
			boardList[i].innerHTML = '';
			dropDownMenu.innerHTML = '';		
			for(let issue of dataMock[i].issues){
				if (dataMock[i].issues.length > 0){		
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
		if(dataMock[boardNum].issues.length > 0){
			for(let issue of dataMock[boardNum].issues){
				
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
			<h3 class="title">${dataMock[boardNum].title}</h3>
			<button class="close_board">close</button>
		</div>
		<div class="list-wrap">
			<ul class="list">${issuesArray}</ul>
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
	for (let i = 0; i < dataMock.length; i++){
		let issuesArray = '';
		if(dataMock[i].issues.length > 0){
			for(let issue of dataMock[i].issues){
				issuesArray += `<li draggable="true" class="list-item">${issue.name}</li>`;
			}
		}
		let board = document.createElement('article');
		board.classList.add('board');
		board.innerHTML = `
		<div class="title-wrap">
			<h3 class="title" data-title="${i}">${dataMock[i].title}</h3>
			<div class="board-menu" data-boardID="${i}">
			</div>
		</div>
		<ul class="board-dropdown">
			<li>Rename</li>
			<li>Replace</li>
			<li class="delete-board" data-delId="${i}">Delete</li>
		</ul>
		<ul class="list">${issuesArray}</ul>
		<button class="add-btn" data-add="${dataMock[i].title}">Add card</button>`;
	mainField.appendChild(board);
	}
	if (dataMock.length > 0){placeholder.style.display = 'none';
	} else {placeholder.style.display = 'block';}
	boardDropdown = document.querySelectorAll('.board-dropdown');
	boardMenu = document.querySelectorAll('.board-menu');
	boardList = document.querySelectorAll('.list');
	scroll();
	buttonDisableSwitcher();
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

boardList[0].addEventListener(`dragstart`, (evt) => {
	evt.target.classList.add(`selected`);
  })
  
boardList[1].addEventListener(`dragend`, (evt) => {
evt.target.classList.remove(`selected`);
});

boardList[1].addEventListener(`dragover`, (evt) => {
	// Разрешаем сбрасывать элементы в эту область
	evt.preventDefault();
	// Находим перемещаемый элемент
	const activeElement = boardList[0].querySelector(`.selected`);
	// Находим элемент, над которым в данный момент находится курсор
	const currentElement = evt.target;
	// Проверяем, что событие сработало:
	// 1. не на том элементе, который мы перемещаем,
	// 2. именно на элементе списка
	const isMoveable = activeElement !== currentElement &&
	  currentElement.classList.contains(`list-item`);
	// Если нет, прерываем выполнение функции
	if (!isMoveable) {
	  return;
	}
	// Находим элемент, перед которым будем вставлять
	const nextElement = (currentElement === activeElement.nextElementSibling) ?
		currentElement.nextElementSibling :
		currentElement;
	// Вставляем activeElement перед nextElement
	boardList[1].insertBefore(activeElement, nextElement);
  });

boardList[1].addEventListener(`dragover`, (evt) => {
	// Разрешаем сбрасывать элементы в эту область
	console.log('nado mnoj')
	evt.preventDefault();
	// // Находим перемещаемый элемент
	// const activeElement = boardList[1].querySelector(`.selected`);
	// // Находим элемент, над которым в данный момент находится курсор
	// const currentElement = evt.target;
	// // Проверяем, что событие сработало:
	// // 1. не на том элементе, который мы перемещаем,
	// // 2. именно на элементе списка
	// const isMoveable = activeElement !== currentElement &&
	//   currentElement.classList.contains(`list-item`);
	// // Если нет, прерываем выполнение функции
	// if (!isMoveable) {
	//   return;
	// }
	// // Находим элемент, перед которым будем вставлять
	// const nextElement = (currentElement === activeElement.nextElementSibling) ?
	// 	currentElement.nextElementSibling :
	// 	currentElement;
	// // Вставляем activeElement перед nextElement
	// boardList[1].insertBefore(activeElement, nextElement);
  });