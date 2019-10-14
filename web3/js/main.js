function switchPage(e){
	//Target will be  the tag <a>, get the <li>
	var elem = e.target.parentElement;
	if(elem.classList.contains("active"))
		return;
	
	//The toolbar
	elem.classList.add("active");
	elem.classList.add("z-depth-3");
	
	var otherElements = elem.parentElement.children;
	for(i=0; i<otherElements.length; i++){
		if(otherElements[i]!=elem){
			otherElements[i].classList.remove("active");
			otherElements[i].classList.remove("z-depth-3");
		}
	}
	
	//The divs
	var elem = document.querySelector('div[id="'+ elem.id +'Page"]');
	elem.style.display = "block";
	
	var otherElements = document.querySelectorAll("div[class='page']");
	for(i=0; i<otherElements.length; i++){
		if(otherElements[i] != elem){
			otherElements[i].style.display = "none";
		}
	}
}

//Event Listeners
document.querySelector("nav ul").addEventListener('click', switchPage);

//Materialize stuff
$(document).ready(function() {
    $('select').material_select();
 });