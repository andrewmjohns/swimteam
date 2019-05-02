function valid(parameter) {
    "use strict";
    return typeof parameter !== "undefined" && parameter !== "";
}

function Family(address, address2, city, state, zip) {
    "use strict";
    var ancestor = this;
    
    this.validAddress = false;
    this.validParents = false;
    this.validSwimmers = false;
    this.valid = false;

    this.familyName = "";
    this.address = address;
    this.address2 = address2;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.parents = [];
    this.swimmers = [];

    this.addParent = function (last, first, phone, email) {
        var parent = new ancestor.Parent(last, first, phone, email);

        if (parent.valid) {
            this.parents.push(parent);
            this.familyName = parent.lastName;
            this.validateFamily();
        }
    };

    this.addSwimmer = function (last, first, gender, birthdate, tshirt) {
        var swimmer = new ancestor.Swimmer(last, first, gender, birthdate, tshirt);

        if (swimmer.valid) {
            this.swimmers.push(swimmer);
            this.validateFamily();
        }
    };

    this.validateAddress();
}

Family.prototype.validateParents = function () {
    "use strict";
    
    if (this.parents.length >= 1 && this.parents[0].valid) {
        this.validParents = true;
    }
};

Family.prototype.validateSwimmers = function () {
    "use strict";
    
    if (this.swimmers.length >= 1 && this.swimmers[0].valid) {
        this.validSwimmers = true;
    }
};

Family.prototype.validateFamily = function () {
    "use strict";

    this.validateAddress();
    this.validateParents();
    this.validateSwimmers();

    if (this.validAddress && this.validParents && this.validSwimmers) {
        this.valid = true;
    }
};

Family.prototype.validateAddress = function () {
    "use strict";
    
    if (valid(this.address) && valid(this.city) && valid(this.state) && valid(this.zip)) {
        this.validAddress = true;
    }
};

Family.prototype.Parent = function (last, first, phone, email) {
    "use strict";
    
    this.lastName = last;
    this.firstName = first;
    this.phone = phone;
    this.email = email;
    this.valid = false;

    this.validate = function () {
        if (valid(this.firstName)) {
            this.valid = true;
        }
    };

    this.validate();
};

Family.prototype.Swimmer = function (last, first, gender, birthdate, tshirt) {
    "use strict";
    
    this.lastName = last;
    this.firstName = first;
    this.MI = " ";
    this.gender = gender;
    this.birthDate = new Date(birthdate);
    this.ussNumber = "";
    this.attach = true;
    this.country = "USA";
    this.tshirt = tshirt;
    this.age = new Date().getYear() - this.birthDate.getYear();
    this.valid = false;

    this.validate = function () {
        if (valid(this.firstName)) {
            this.valid = true;
        }
    };

    this.ageAsOf = function (asOfDate) {
        //the age they will be after their birthday, they may actually be a year younger depending on age up date
        var age = asOfDate.getYear() - this.birthDate.getYear();

        //If the birthday didn't happen before the age up date then they are a year younger
        if (new Date(asOfDate.getFullYear(), this.birthDate.getMonth(), this.birthDate.getDate()) > asOfDate) {
            age -= 1;
        }
        return age;
    };

    this.validate();
    
    if (isNaN(this.birthDate.getTime()) || this.age < 0) {
        if (birthdate.indexOf('\\') !== -1) {
            birthdate = birthdate.replace(/\\/g, '/');
        }
        if (birthdate.indexOf('/') === -1 && birthdate.indexOf('-') === -1 && !isNaN(parseInt(birthdate, 10))) {
           /*
           MDYY
           MMDDYYYY
           
           MMDDYY
           MDYYYY
           */
            if (birthdate.length === 4) {
                birthdate = birthdate[0] + '/' + birthdate[1] + '/' + birthdate[3] + birthdate[4];
            } else if (birthdate.length === 8) {
                birthdate = birthdate.substring(0, 2) + '/' + birthdate.substring(2, 4) + '/' + birthdate.substring(4);
            } else if (birthdate.length === 5 || birthdate.length === 7) {
               /*
               MMDYY or MMDYYYY
               MDDYY or MDDYYYY
               If first number is 2-9 or third number is 0 it is of the second flavor
               If first number is 0 it is of the first flavor
               Still leaves 10/1-9, 11/1-9, 12/1-9 and 1/01-09, 1/11-19, 1/21-29 as unable to compute so will need to guess
               */
                if (parseInt(birthdate[0], 10) > 1 || birthdate[2] === '0') {
                    birthdate = birthdate[0] + '/' + birthdate.substring(1, 3) + '/' + birthdate.substring(3);
                } else {
                    birthdate = birthdate.substring(0, 2) + '/' + birthdate[2] + '/' + birthdate.substring(3);
                }
            } else if (birthdate.length === 6) {
                if (birthdate[0] !==  '0' && birthdate[1] !== '0' && birthdate[2] !== '0') {
                    birthdate = birthdate[0] + '/' + birthdate[1] + '/' + birthdate.substring(2);
                } else {
                    birthdate = birthdate.substring(0, 2) + '/' + birthdate.substring(2, 4) + '/' + birthdate.substring(4);
                }
            }
        }
        this.birthDate = new Date(birthdate);
        this.age = new Date().getYear() - this.birthDate.getYear();
    }
};