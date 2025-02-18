const exitTimeSlots = {
  //LAGUNA AND MANILA EXIT
  0: ["05:45 AM", "06:15 AM", "07:00 AM", "08:00 AM", "09:00 AM", 
      "11:00 AM", "01:00 PM", "02:30 PM", "03:30 PM", "05:10 PM", 
      "06:15 PM", "07:45 PM", "N/A"],
  1: ["09:00 AM", "11:30 AM", "04:45 PM", "05:10 AM", "05:30 PM", 
      "06:00 PM", "06:30 PM", "07:00 PM", "07:45 PM", "N/A"],
  2: ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
      "N/A"],
  3: ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
      "N/A"],
  4: ["04:45 PM", "05:10 PM", "05:30 PM", "06:00 PM", "07:45 PM", 
      "N/A"],
  5: ["N/A"],
};

const entryTimeSlots = {
  //LAGUNA ENTRY
  0: ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", 
      "08:30 AM", "09:00 AM", "09:30 AM", "10:30 AM", "11:30 AM", 
      "12:30 PM", "01:00 PM", "02:00 PM", "03:00 PM", "03:30 PM",
      "04:40 PM", "N/A"],
  1: ["06:30 AM", "N/A"],
  2: ["05:30 AM", "06:00 AM", "06:30 AM", "07:30 AM", "N/A"],
  3: ["06:30 AM", "07:00 AM", "N/A"],
  //MANILA ENTRY
  4: ["06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", 
      "08:30 AM", "09:00 AM", "09:30 AM", "10:30 AM", "11:30 AM", 
      "12:30 PM", "01:00 PM", "02:00 PM", "03:00 PM", "03:30 PM",
      "04:40 PM", "N/A"],
  5: ["N/A"],
};

const entryLocations = 
  //LAGUNA ENTRY
  ["Paseo -> DLSU LC", 
  "Carmona -> DLSU LC", 
  "Pavilion Mall -> DLSU LC", 
  "Walter Mart -> DLSU LC",
  //MANILA ENTRY
  "Yuchenco Bldg. -> DLSU LC", 
  "N/A"];
const exitLocations = 
  //LAGUNA AND MANILA EXIT
  ["DLSU LC -> Yuchenco Bldg.", 
  "DLSU LC -> Paseo", 
  "DLSU LC -> Carmona",
  "DLSU LC -> Pavilion Mall", 
  "DLSU LC -> Walter Mart",
  "N/A"];

function leftClick() {
  btn.style.left = '0';
  var user_location = document.getElementById('user_location');
  user_location.innerHTML = '';

  var option = document.createElement('option');
  option.value = '';
  option.setAttribute('selected', true);
  option.setAttribute('disabled', true);
  option.setAttribute('hidden', true);
  option.innerHTML = 'Select Location';

  var option_array = [option];
  var storage_entry = ["Paseo -> DLSU LC", "Carmona -> DLSU LC", "Pavilion Mall -> DLSU LC", "Walter Mart -> DLSU LC", "Yuchenco Bldg. -> DLSU LC", "N/A"];
  for (var i = 0; i < storage_entry.length; i++) {
    var entry_option = document.createElement('option');
    entry_option.value = i;
    entry_option.innerHTML = storage_entry[i];
    option_array.push(entry_option);
  }

  for (var i = 0; i < option_array.length; i++) {
    user_location.appendChild(option_array[i]);
  }

  user_location.style.width = '189px';
}

function rightClick() {
  btn.style.left = '160px';
  var user_location = document.getElementById('user_location');
  user_location.innerHTML = '';

  var option = document.createElement('option');
  option.setAttribute('selected', true);
  option.setAttribute('disabled', true);
  option.setAttribute('hidden', true);
  option.innerHTML = 'Select Location';

  var option_array = [option];
  var storage_exit = ["DLSU LC -> Yuchenco Bldg.", "DLSU LC -> Paseo", "DLSU LC -> Carmona", "DLSU LC -> Pavilion Mall", "DLSU LC -> Walter Mart", "N/A"];
  for (var i = 0; i < storage_exit.length; i++) {
    var exit_option = document.createElement('option');
    exit_option.value = i;
    exit_option.innerHTML = storage_exit[i];
    option_array.push(exit_option);
  }

  for (var i = 0; i < option_array.length; i++) {
    user_location.appendChild(option_array[i]);
  }
}

function showScheduleForm() {
  var scheduleForm = document.getElementsByClassName('form_box')[0];
  scheduleForm.style.display = 'block';
}

function hideScheduleForm() {
  var scheduleForm = document.querySelector('.form_box');
  scheduleForm.style.display = 'none';
}

function cancelScheduleForm() {
  var scheduleForm = document.getElementsByClassName('form_box')[0];
  scheduleForm.style.display = '';
}

function changeTimeSlots() {
  var user_location = document.getElementById('user_location').value;
  var buttonClicked = document.getElementById('btn').style.left === '0px' ? 'entry' : 'exit';

  var container = document.getElementById('user_location');
  container.style.width = '188px';

  var timeSlots = document.getElementById('user_entryTime');
  timeSlots.innerHTML = '<option value="" disabled selected hidden s> Time Slot </option>';

  var selectedTimeSlots = buttonClicked === 'entry' ? entryTimeSlots[user_location] : exitTimeSlots[user_location];

  for (var i = 0; i < selectedTimeSlots.length; i++) {
    var option = document.createElement('option');
    option.value = i;
    option.innerHTML = selectedTimeSlots[i];
    timeSlots.appendChild(option);
  }
}

function findMatchingSeats(event) {
  event.preventDefault();

  var user_location = document.getElementById('user_location').value;
  var pickUpTime = document.getElementById('user_entryTime').value;
  var dateTime = document.getElementById('user_date').value;

  var pickUpTimeObject = document.getElementById('user_entryTime');
  var user_locationObject = document.getElementById('user_location');

  if ( pickUpTime == '' || user_location == ''  ) {
    document.getElementById('user_date').value = "";
    $('#user_location').prop('selectedIndex', 0);
    $('#user_entryTime').prop('selectedIndex', 0);
    
    $('#error_box').css('display', 'block');
    $('#error_message').html('Please fill out all fields.');

    setTimeout(function() {
      $('#error_box').css('display', 'none');
    }, 3000);

  } else if (  pickUpTimeObject.options[pickUpTimeObject.selectedIndex].text == 'N/A' || user_locationObject.options[user_locationObject.selectedIndex].text == 'N/A' ){

    document.getElementById('user_date').value = "";
    $('#user_location').prop('selectedIndex', 0);
    $('#user_entryTime').prop('selectedIndex', 0);
    
    $('#error_box').css('display', 'block');
    $('#error_message').html('N/A is not a valid option. Please select another option.');

    setTimeout(function() {
      $('#error_box').css('display', 'none');
    }, 3000);

  }else{

    var buttonClicked = document.getElementById('btn').style.left === '0px' ? 'entry' : 'exit';

    if (buttonClicked === 'entry') {
      var location = entryTimeSlots[user_location];
      var numberOfSeatsTaken = 0;
      var actualPickUpTime = location[pickUpTime];

      document.getElementById("schedule_label").innerHTML = entryLocations[user_location] + ' ' + actualPickUpTime + ' ' + dateTime;

      fetch(`/schedule/${dateTime}/${entryLocations[user_location]}/${actualPickUpTime}?buttonClicked=${buttonClicked}`)
      .then((response) => response.json())
      .then((data) => {
      
        numberOfSeatsTaken = data.length;
        generateSeats(numberOfSeatsTaken);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        
      });
    }

    if (buttonClicked=== 'exit') {
      var location = exitTimeSlots[user_location];
      var numberOfSeatsTaken = 0;
      var actualPickUpTime = location[pickUpTime];

      document.getElementById("schedule_label").innerHTML = exitLocations[user_location] + ' ' + actualPickUpTime + ' ' + dateTime;

      fetch(`/schedule/${dateTime}/${exitLocations[user_location]}/${actualPickUpTime}?buttonClicked=${buttonClicked}`)
      .then((response) => response.json())
      .then((data) => {
        
        numberOfSeatsTaken = data.length;
        generateSeats(numberOfSeatsTaken);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        
      });
    }

  }

  
}

function generateSeats(numberOfSeatsTaken) {
  var seatContainer = document.getElementById('seat_container');
  seatContainer.innerHTML = '';

  var maxCapacity = 13; 

  for (var i = 0; i < maxCapacity; i++) {
    var seatSquare = document.createElement('div');
    seatSquare.classList.add('seat');
    seatSquare.textContent = 'Seat ' + (i + 1);
    seatContainer.appendChild(seatSquare);
    if(i<numberOfSeatsTaken) {
      seatSquare.style.backgroundColor = "red";
    }
  }
}