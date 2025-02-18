$(document).ready(function () {

    function isFilled() {

        var user_firstName = validator.trim($('#user_firstName').val());
        var user_lastName = validator.trim($('#user_lastName').val());
        var user_email = validator.trim($('#user_email').val());
        var user_idNumber = validator.trim($('#user_idNumber').val());
        var user_password = validator.trim($('#user_password').val());
        var user_securityCode = validator.trim($('#user_securityCode').val());
        var user_designation = $('#user_designation').val() || ''; 
        var user_passengerType = $('#user_passengerType').val() || ''; 

        /*
            checks if the trimmed values in fields are not empty
        */
        var fNameEmpty = validator.isEmpty(user_firstName);;
        var lNameEmpty = validator.isEmpty(user_lastName);
        var emailEmpty = validator.isEmpty(user_email);
        var idNumEmpty = validator.isEmpty(user_idNumber);
        var passwordEmpty = validator.isEmpty(user_password);
        var securityCodeEmpty = validator.isEmpty(user_securityCode);
        var designationEmpty = validator.isEmpty(user_designation);
        var passengerTypeEmpty = validator.isEmpty(user_passengerType);

        return !fNameEmpty && !lNameEmpty && !emailEmpty && !idNumEmpty && !passwordEmpty && !securityCodeEmpty && !designationEmpty && !passengerTypeEmpty;
    }

    async function isValidID(field, callback) {

        var idNum = validator.trim($('#user_idNumber').val());

        var onlyNumbers = /^[0-9]*$/;
        if (!onlyNumbers.test(idNum)) {
            $("#error_box").css('display', 'block');
            $('#error_message').text('ID number should contain only numbers.');
            return callback(false);
        }
        else{

            var isValidLength = validator.isLength(idNum, {min: 8, max: 8});

            if(isValidLength) {
                
                const result = await $.get('/getCheckID', {idNumber: idNum} ) 
                
                if ( result != null ) {

                    if( result.idNumber != idNum ) {

                        if(field.is($('#user_idNumber'))){
                            $('#error_message').text('');
                        }
                                
                        return callback(true);
                    }
                    else {

                        if(field.is($('#user_idNumber'))){
                            $('#error_box').css('display', 'block');
                            $('#error_message').text('ID number already registered.');
                        }
                                
                        return callback(false);
                    }

                }else{
                    // No result returned from the server

                    $('#error_message').text('');
                    $('error_box').css('display', 'none');
                    
                    return callback(true);
                }

            }
            else if ( !isValidLength ){

                if(field.is($('#user_idNumber'))){
                    $('#error_box').css('display', 'block');
                    $('#error_message').text('ID number should contain exactly 8 digits.');
                }
                   
                return callback(false);

            }

        }

    }

    function isValidSecurityCode(callback) {

        var securityCode = validator.trim($('#user_securityCode').val());

        var onlyNumbers = /^[0-9]*$/;
        if (!onlyNumbers.test(securityCode)) {
            $("#error_box").css('display', 'block');
            $('#error_message').text('Security Code should contain only numbers.');
            return callback(false);
        }
        else{
            return callback(true);
        }

    }

    async function isValidEmail(callback){

        var email = validator.trim($('#user_email').val());

        var validEmail = validator.isEmail(email);

        if(validEmail) {

            const result = await $.get('/getCheckEmail', {email: email} )

            if ( result.email != email ) {
                return callback(true);
            }
            else{
                $("#error_box").css('display', 'block');
                $('#error_message').text('Email already registered.');
                return callback(false);
            }
        }

    }


    async function validateField(field, fieldName, error) {

        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);
    
        if(empty) {
   
            field.prop('value', '');
            // display approriate error message in `error`
            $('#error_box').css('display', 'block');
            error.text(fieldName + ' should not be empty.');
        }

        // else if the value of `field` is not empty
        else{
            // remove the error message in `error`
            error.text('');
            $('#error_box').css('display', 'none');
            
        }
            
        var filled = isFilled();

        var validEmail;
        await isValidEmail( function(boolean){
            validEmail = boolean;
        });

        var validSecurityCode;
        await isValidSecurityCode( function(boolean){
            validSecurityCode = boolean;
        });

        isValidID(field, function (validID) {

            if( filled && validID && validSecurityCode && validEmail ) {
                $('#submit').prop('disabled', false);
                $('#submit').css('background', 'green');
                $('#submit').css('cursor', 'pointer');
            }
            else{
                $('#submit').prop('disabled', true);
                $('#submit').css('background', '#cccccc');
                $('#submit').css('cursor', 'not-allowed');
            }
                
        });
    }

    $('#user_firstName').keyup(function () {
        validateField($('#user_firstName'), 'First name', $('#error_message'));
    });

    $('#user_lastName').keyup(function () {
        validateField($('#user_lastName'), 'Last name', $('#error_message'));
    });

    $('#user_email').keyup(function () {
        validateField($('#user_email'), 'Email', $('#error_message'));
    });

    $('#user_idNumber').keyup(function () {
        validateField($('#user_idNumber'), 'ID Number', $('#error_message'));
    });

    $('#user_securityCode').keyup(function () {
        validateField($('#user_securityCode'), 'Security Code', $('#error_message'));
    });

    $('#user_designation').on('change', function () {
        validateField($('#user_designation'), 'Designation', $('#error_message'));
    });
    
    $('#user_passengerType').on('change', function () {
        validateField($('#user_passengerType'), 'Passenger Type', $('#error_message'));
    });
    

});