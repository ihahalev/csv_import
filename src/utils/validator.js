import usStates from '../utils/usStates.json';

export default function ({ result: rawUsers, headers }) {
  const NAME = headers[1];
  const PHONE = headers[2];
  const EMAIL = headers[3];
  const AGE = headers[4];
  const EXP = headers[5];
  const INCOME = headers[6];
  const KIDS = headers[7];
  const STATES = headers[8];
  const DATE = headers[9];
  const LIC = headers[10];
  const DUPL = headers[11];

  const errors = [];
  const users = [];
  rawUsers.forEach((rawUser, idx) => {
    const user = {};
    const errorField = {};
    user.id = rawUser.id;

    //Name
    user[NAME] = rawUser[NAME];
    errorField[NAME] = false;
    //Phone validation
    errorField[PHONE] = true;
    if (rawUser[PHONE]) {
      user[PHONE] = rawUser[PHONE];
      if (rawUser[PHONE].includes('+1') && rawUser[PHONE].length === 12) {
        errorField[PHONE] = false;
      }
      if (rawUser[PHONE].charAt(0) === '1' && rawUser[PHONE].length === 11) {
        errorField[PHONE] = false;
        user[PHONE] = '+' + rawUser[PHONE];
      }
      if (rawUser[PHONE].length === 10) {
        errorField[PHONE] = false;
        user[PHONE] = '+1' + rawUser[PHONE];
      }
    }

    //Email validation
    errorField[EMAIL] = true;
    if (rawUser[EMAIL]) {
      user[EMAIL] = rawUser[EMAIL];
      const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (re.test(rawUser[EMAIL].toLowerCase())) {
        errorField[EMAIL] = false;
      }
    }

    //Duplicate check
    if (users.length > 0) {
      //Phone
      let duplId = users.findIndex((item) => item[PHONE] === user[PHONE]);
      if (duplId > -1) {
        const duplUser = users[duplId];
        const duplErr = errors[duplId];

        if (!duplUser[DUPL]) {
          duplUser[DUPL] = idx;
          user[DUPL] = duplId;
          duplErr[PHONE] = true;
          errorField[PHONE] = true;
        }
      }
      //Email
      if (!user[DUPL]) {
        duplId = users.findIndex((item) => {
          if (item[EMAIL] && user[EMAIL]) {
            if (item[EMAIL].toLowerCase() === user[EMAIL].toLowerCase()) {
              return true;
            }
          }
        });
        if (duplId > -1) {
          const duplUser = users[duplId];
          const duplErr = errors[duplId];

          if (!duplUser[DUPL]) {
            duplUser[DUPL] = idx;
            user[DUPL] = duplId;
            duplErr[EMAIL] = true;
            errorField[EMAIL] = true;
          }
        }
      }
    }

    //Age validation
    const ageNum = Number(rawUser[AGE]);
    errorField[AGE] = true;
    user[AGE] = ageNum;
    if (Number.isInteger(ageNum) && ageNum >= 21) {
      errorField[AGE] = false;
    }

    //Experience validation
    const expNum = Number(rawUser[EXP]);
    errorField[EXP] = true;
    user[EXP] = rawUser[EXP];
    if (Number.isInteger(ageNum)) {
      if (Number.isInteger(expNum) && expNum >= 0 && expNum <= user[AGE]) {
        errorField[EXP] = false;
      }
    }

    //Income validation
    if (Number.isNaN(Number(rawUser[INCOME]))) {
      errorField[INCOME] = true;
      user[INCOME] = rawUser[INCOME];
    } else {
      errorField[INCOME] = false;
      user[INCOME] = +Number(rawUser[INCOME]).toFixed(2);
    }

    //Has children validation
    if (rawUser[KIDS]) {
      if (rawUser[KIDS].toUpperCase() === 'TRUE') {
        user[KIDS] = rawUser[KIDS].toUpperCase();
        errorField[KIDS] = false;
      } else if (rawUser[KIDS].toUpperCase() === 'FALSE') {
        user[KIDS] = rawUser[KIDS].toUpperCase();
        errorField[KIDS] = false;
      } else {
        user[KIDS] = rawUser[KIDS];
        errorField[KIDS] = true;
      }
    } else {
      user[KIDS] = 'FALSE';
      errorField[KIDS] = false;
    }

    //States validation
    const shortStates = Object.keys(usStates);
    const nameStates = Object.values(usStates);
    if (rawUser[STATES]) {
      let multiStates;
      if (rawUser[STATES].includes(', ')) {
        multiStates = rawUser[STATES].split(', ');
      }
      if (rawUser[STATES].includes(' | ')) {
        multiStates = rawUser[STATES].split(' | ');
      }
      if (multiStates) {
        const shortWrite = [];
        for (const state of multiStates) {
          if (state.length === 2) {
            if (shortStates.includes(state.toUpperCase())) {
              shortWrite.push(state.toUpperCase());
              errorField[STATES] = false;
            } else {
              errorField[STATES] = true;
              break;
            }
          } else {
            if (nameStates.includes(state)) {
              const index = nameStates.indexOf(state);
              shortWrite.push(shortStates[index]);
              errorField[STATES] = false;
            } else {
              errorField[STATES] = true;
              break;
            }
          }
        }
        if (errorField[STATES]) {
          user[STATES] = multiStates.join(' | ');
        } else {
          user[STATES] = shortWrite.join(' | ');
        }
      } else {
        if (rawUser[STATES].length === 2) {
          if (shortStates.includes(rawUser[STATES].toUpperCase())) {
            errorField[STATES] = false;
          } else {
            errorField[STATES] = true;
          }
          user[STATES] = rawUser[STATES].toUpperCase();
        } else {
          if (nameStates.includes(rawUser[STATES])) {
            errorField[STATES] = false;
          } else {
            errorField[STATES] = true;
          }
          const index = nameStates.indexOf(rawUser[STATES]);
          user[STATES] = shortStates[index];
        }
      }
    } else {
      errorField[STATES] = true;
    }

    //Expiration date validation
    errorField[DATE] = true;
    user[DATE] = rawUser[DATE];
    const today = new Date();
    const expDate = new Date(rawUser[DATE]);
    console.log(`${today}`, `${rawUser[DATE]}`);
    if (today.getTime() <= expDate.getTime()) {
      if (rawUser[DATE].indexOf('-') === 4 || rawUser[DATE].indexOf('/') === 2) {
        errorField[DATE] = false;
      }
    }

    //License validation
    user[LIC] = rawUser[LIC];
    errorField[LIC] = true;
    if (rawUser[LIC]) {
      const re = /^[a-zA-Z0-9]{6}$/;
      if (re.test(rawUser[LIC].toLowerCase())) {
        errorField[LIC] = false;
      }
    }

    users.push(user);
    errors.push(errorField);
  });
  console.log(users);
  console.log(errors);
  return { users, errors };
}
