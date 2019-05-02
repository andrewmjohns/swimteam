function createCL2File(swimmers, ageUpDate) {
    "use strict";
    
    function calculateChecksum(string) {
        var DIVISOR = 19, ADDER = 211, checksum = "", total = 0, i = 0;

        //sum the ASCII value of the string then divide and add by constants
        for (i = 0; i < string.length; i += 1) {
            total += string.charCodeAt(i);
        }
        checksum = Math.floor(total / DIVISOR + ADDER);

        //reduce to last to digits in reverse order
        checksum = checksum.toString();
        checksum = checksum[checksum.length - 1] + checksum[checksum.length - 2];

        //Prepend two letters to the checksum as required by the type of data
        if (string.substring(0, 2) === 'D0') {
            checksum = 'NN' + checksum;
        } else {
            checksum = ' N' + checksum;
        }

        return checksum;
    }

    //Knows how to write the File Description Record (FDR)
    function writeFDR() {
        return "A01V3      20Swimmers Only                 Hy-Tek, Ltd               8.0EHy-Tek, Ltd         252-633-517706142018                                    TM43    N81\r\n";
    }
    //Knows how to write the Team ID Record (TIR)
    function writeTIR() {
        return "C11KY      KYLO  Lone Oak Sharks               Sharks          44 Club Lane                                Nicholasville       KY40356     USA               N85\r\n";
    }
    //Knows how to write the Individual Administrative Record
    function writeIAR(swimmer) {
        //Used to add spaces to a string so that it fills up the length necessary.
        //If string is too long it will return the substring.
        //Padding added to the right unless direction is set to "left" then padding will be added to the left
        function padString(string, length, direction) {
            var i = 0;

            if (string.length < length) {
                for (i = string.length; i < length; i = i + 1) {
                    if (direction === "left") {
                        string = " " + string;
                    } else {
                        string += " ";
                    }
                }
            } else {
                string = string.substring(0, length);
            }
            return string;
        }
        //Used to transform a date object to a string of type MMDDYYYY
        function toMMDDYYYY(date) {
            var dateString = "";
            if (date.getMonth() < 9) {
                dateString += "0";
            }
            dateString += date.getMonth() + 1;
            if (date.getDate() < 10) {
                dateString += "0";
            }
            dateString += date.getDate();
            dateString += date.getFullYear();

            return dateString;
        }
        
        var IAR = "";
        
        IAR += "D1"; //record identifier
        IAR += "1"; //orginization code
        IAR += padString("", 8); //future use
        IAR += padString("KYLO", 7); //team code
        IAR += padString(swimmer.lastName + ", " + swimmer.firstName + " " + swimmer.MI, 28); //swimmer name
        IAR += " ";//future use
        IAR += padString(swimmer.ussNumber, 12); //ussNumber
        IAR += (swimmer.attach) ? "A" : "U"; //attach boolean
        IAR += swimmer.country; //citizen
        IAR += toMMDDYYYY(swimmer.birthDate); //birthdate
        IAR += padString(swimmer.ageAsOf(ageUpDate).toString(), 2, "left"); //age
        IAR += (swimmer.gender === "Male") ? "M" : "F"; //gender
        IAR += padString("", 5); //first admin
        IAR = padString(IAR, 156); //pad out to just before checksum
        IAR += calculateChecksum(IAR);

        return IAR + "\r\n";
    }

    var cl2File = writeFDR() + writeTIR(), i = 0;

    for (i = 0; i < swimmers.length; i = i + 1) {
        cl2File += writeIAR(swimmers[i]);
    }

    return cl2File;
}