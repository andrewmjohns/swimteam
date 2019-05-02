function createHY3File(swimmers, ageUpDate) {
    "use strict";
    
    function calculateChecksum(string) {
		//Documentation here: https://groups.google.com/forum/#!topic/rec.sport.swimming/TEAvBkhVLko
        var DIVISOR = 21, ADDER = 205, checksum = "", evenTotal = 0, oddTotal = 0, total = 0, i = 0;

        //sum the ASCII value of string (every other character seperately) then divide and add by constants
        for (i = 0; i < string.length; i += 1) {
			if (i % 2 === 1) {
				evenTotal += string.charCodeAt(i) * 2;
			} else {
				oddTotal += string.charCodeAt(i);
			}
        }
		total = evenTotal + oddTotal;
		
        checksum = Math.floor(total / DIVISOR + ADDER);

        //reduce to last to digits in reverse order
        checksum = checksum.toString();
        checksum = checksum[checksum.length - 1] + checksum[checksum.length - 2];

        return checksum;
    }

    //Knows how to write the File Description Record (FDR)
    function writeFDR() {
        return "A103Rosters Only             Hy-Tek, Ltd    Win-TM 8.0Ef  04262019  2:11 PMLone Oak Swim Team                                   72\r\nC1LO   Lone Oak Sharks               Sharks          KYJenny Vanderpool                                                AGE      39\r\n";
    }
    //Knows how to write the Team ID Record (TIR)
    function writeTIR() {
        return "C2Lone Oak LLC                  44 Club Lane                  Nicholasville                 KY40356     USA OTH                 38\r\nC3                                                                                          loneoaksharks@windstream.net        54\r\n";
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
        IAR += (swimmer.gender === "Male") ? "M" : "F"; //gender
		IAR += padString("", 5); //database ID
		IAR += padString(swimmer.lastName, 20); //last name
		IAR += padString(swimmer.firstName, 20); //first name
		IAR += padString("", 20); //preferred name
		IAR += padString(swimmer.MI, 1); // middle initial
        IAR += padString("", 14); //Athlete ID
		IAR += padString("", 5); //Database ID 2
        IAR += toMMDDYYYY(swimmer.birthDate); //birthdate
		IAR += padString("", 1); //blank
        IAR += padString(swimmer.ageAsOf(ageUpDate).toString(), 2, "left"); //age
		IAR += padString("", 2); //school year
        IAR += padString("", 4); //blank
		IAR += padString("", 3); //group
        IAR += padString("", 3); //subgroup
		IAR += padString("", 1); //I
		IAR += padString("", 3); //registration country
		IAR += padString("", 1); //blank
		IAR += padString("", 3); //WM group
		IAR += padString("", 3); //WM sub group
		IAR += padString("", 6); //blank
        IAR += calculateChecksum(IAR);

        return IAR + "\r\n";
    }

    var cl2File = writeFDR() + writeTIR(), i = 0;

    for (i = 0; i < swimmers.length; i = i + 1) {
        cl2File += writeIAR(swimmers[i]);
    }

    return cl2File;
}