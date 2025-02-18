var count = null;

function createTextInfoAdmin(main_div, resultArr = [], isSearch){

    console.log(resultArr);

    var text_info = document.createElement('div');
    text_info.className = 'text_reserved_schedule';
    main_div.appendChild(text_info);

    var idValue = document.getElementById('user_idNumber');
    var dateValue = document.getElementById('user_date');
    var entryValue = document.getElementById('user_entry');
    var entryTimeValue = document.getElementById('user_entryTime');
    var exitValue = document.getElementById('user_exit');
    var exitTimeValue = document.getElementById('user_exitTime');

    var locationText = document.createElement('p');
    var idText = document.createElement('p');
    var dateText = document.createElement('p');
    var entryText = document.createElement('p');
    var entryTimeText = document.createElement('p');
    var exitText = document.createElement('p');
    var exitTimeText = document.createElement('p');

    if ( isSearch == true ){

        locationText.innerHTML = resultArr[0];

        if ( idValue.value == '' ){
            idText.innerHTML = 'N/A';
        }
        else{
            idText.innerHTML = resultArr[1];
        }

        idText.innerHTML = resultArr[1];
        dateText.innerHTML = resultArr[2];
        entryText.innerHTML = resultArr[3];
        entryTimeText.innerHTML = resultArr[4];
        exitText.innerHTML = resultArr[5];
        exitTimeText.innerHTML = resultArr[6];
        

    }else {

         if ( functionCalled == 0 ){
            locationValue = document.getElementById('laguna_btn');
        }
        else{
            locationValue = document.getElementById('manila_btn');
        }

        if ( idValue.value == '' ){
            idText.innerHTML = 'N/A';
        }else{
            idText.innerHTML = idValue.value;
        }
        
        if ( dateValue.value == '' ){
            dateText.innerHTML = 'N/A';
        }else{
            dateText.innerHTML = resultArr[1];
        }

        if (entryValue.options[entryValue.selectedIndex].text == 'N/A' || entryValue.options[entryValue.selectedIndex].text == "Entry Location"){
            entryText.innerHTML = 'N/A';
        }else{
            entryText.innerHTML = resultArr[2];
        }   

        if (entryTimeValue.options[entryTimeValue.selectedIndex].text == 'N/A' || entryTimeValue.options[entryTimeValue.selectedIndex].text == "Time Slot"){
            entryTimeText.innerHTML = 'N/A';
        }else{
            entryTimeText.innerHTML = resultArr[3];
        }

        if ( exitValue.options[exitValue.selectedIndex].text == 'N/A' || exitValue.options[exitValue.selectedIndex].text == "Exit Location" ){
            exitText.innerHTML = 'N/A';
        }else{
            exitText.innerHTML = resultArr[4];
        }

        if ( exitTimeValue.options[exitTimeValue.selectedIndex].text == 'N/A' || exitTimeValue.options[exitTimeValue.selectedIndex].text == "Time Slot"){
            exitTimeText.innerHTML = 'N/A';
        }else{
            exitTimeText.innerHTML = resultArr[5];
        }

        locationText.innerHTML = locationValue.innerHTML;

    }
    


    var border = new Array();

    for ( var i = 0; i < 5; i++ ){
        border[i] = document.createElement('hr');
    }

    text_info.appendChild(locationText);
    text_info.appendChild(border[0]);
    text_info.appendChild(idText);
    text_info.appendChild(border[1]);
    text_info.appendChild(dateText);
    text_info.appendChild(border[2]);
    text_info.appendChild(entryText);
    text_info.appendChild(entryTimeText);
    text_info.appendChild(border[3]);
    text_info.appendChild(exitText);
    text_info.appendChild(exitTimeText);
    text_info.appendChild(border[4]);

}

function showSearchForm(){
    var formBox = document.getElementsByClassName('form_box')[0];
    document.getElementById('user_idNumber').value = '';
    formBox.style.display = 'block';
    formBox.style.height = '245px';
}

function displayUserSchedule(isSearch, resultArr = []){
    
    var scheduleContainer = document.getElementsByClassName('schedule_container')[0];
    var formBox = document.getElementsByClassName('form_box')[0];

    scheduleContainer.innerHTML = '';

    var div = document.createElement('div');
    div.className = 'reserved_schedule';
	if (count == null){
		count = scheduleContainer.childElementCount + 1;
	}
	else{
		count = count + 1;
		
	} 
	div.setAttribute('id', count );
	
    scheduleContainer.appendChild(div);
	
    var reserved_schedule_container = document.getElementsByClassName('reserved_schedule')[scheduleContainer.childElementCount - 1];
    var divBtn = document.createElement('div');
    divBtn.className = 'reserved_schedule_btn';
    
    reserved_schedule_container.appendChild(divBtn);
    
    var edit_btn = document.createElement('button');
    edit_btn.className = 'edit_btn';
    edit_btn.setAttribute('type', 'button');
	edit_btn.setAttribute('id', 'e_btn' + count);
    edit_btn.setAttribute('onclick','showEditForm(' + count + ')');
    edit_btn.innerHTML = 'EDIT';

    var delete_btn = document.createElement('button');
    delete_btn.className = 'delete_btn';
    delete_btn.setAttribute('type', 'button');
	delete_btn.setAttribute('id', 'd_btn' + count);
	delete_btn.setAttribute('onclick','showDeleteForm(' + count + ')');
    delete_btn.innerHTML = 'DELETE';

    divBtn.appendChild(edit_btn);
    divBtn.appendChild(delete_btn);

    if ( isSearch == true ){
        console.log('test');
        createTextInfoAdmin(div, resultArr, true); //Show searched users
    }
    else{
        createTextInfoAdmin(div, resultArr, false); //Show admin resserved users
    }

    formBox.style.display = 'none';
}
