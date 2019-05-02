/*global Family, Papa, XMLHttpRequest*/

function RegistrationFile(filename, headings, callback) {
    "use strict";
    
    this.filename = filename;
    this.headings = headings;
    this.records = [];
    this.callback = callback;
}

RegistrationFile.prototype.process = function () {
    "use strict";
    
    function ProcessFile(contents) {
        
        var i = 0, j = 1, currentRecord = "", currentFamily = {}, families = [];

//        console.info(contents.data);

        for (i = 0; i < contents.data.length; i += 1) {
            currentRecord = contents.data[i];

            currentFamily = new Family(currentRecord[that.headings.address], currentRecord[that.headings.address2], currentRecord[that.headings.city], currentRecord[that.headings.state], currentRecord[that.headings.zip]);

            currentFamily.addParent(currentRecord.lastName, currentRecord.firstName, currentRecord.phone, currentRecord.email);
            currentFamily.addParent(currentRecord["Parent 2 Last Name"], currentRecord["Parent 2 First Name"], currentRecord["Parent 2 Phone"], currentRecord["Parent 2 Email"]);

            for (j = 1; j <= 5; j += 1) {
                currentFamily.addSwimmer(currentRecord["Swimmer " + j + " Last Name"], currentRecord["Swimmer " + j + " First Name"], currentRecord["Swimmer " + j + " Gender"], currentRecord["Swimmer " + j + " Date of Birth"], currentRecord["Swimmer " + j + " T-Shirt Size"]);
            }

//            console.info(currentFamily);

            if (currentFamily.valid) {
                families.push(currentFamily);
            }
        }
//        console.log(families);
        that.callback(families);
    }
    
    var csvConfig = {
        skipEmptyLines: "greedy",
        header: true,
        complete: ProcessFile,
        error: undefined,
        transform: function (string) { return string.trim(); }
    }, xmlhttp = new XMLHttpRequest(), that = this;
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status === 200 && xmlhttp.readyState === 4) {
            Papa.parse(xmlhttp.responseText, csvConfig);
        }
    };
    xmlhttp.open("GET", this.filename, true);
    xmlhttp.send();
};