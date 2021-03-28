import React, { useState } from 'react';
import UserList from './UserList';

import csvConverter from '../utils/csvConverter';
import validator from '../utils/validator';

import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [noFile, setNoFile] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [errors, setErrors] = useState([]);

  const hiddenFileInput = React.useRef(null);

  const handleClick = e => {
    hiddenFileInput.current.value = "";
    hiddenFileInput.current.click();
  };

  const handleOpen = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    let rawRead;
    const reader = new FileReader();
    reader.onload = function (e) {

      rawRead = csvConverter(e.target.result);
      const rawUsers = rawRead.result;

      const isFullName = rawUsers[0].hasOwnProperty('Full Name');
      const isPhone = rawUsers[0].hasOwnProperty('Phone');
      const isEmail = rawUsers[0].hasOwnProperty('Email');

      if (!isFullName || !isPhone || !isEmail) {
        setNoFile(true);
      } else {
        setNoFile(false);
        console.log(rawUsers);
        const valideData = validator(rawRead);
        setUsers([...valideData.users]);
        setErrors([...valideData.errors]);
        setHeaders([...rawRead.headers]);
      }

    };
    reader.readAsText(file);
  };
  return (
    <div className="App">
      <button onClick={handleClick}>Import users</button>
      <input name="file" type="file" ref={hiddenFileInput} onChange={handleOpen}/>


      {noFile ? <div className="bad-format">File format is not correct</div> 
      : <UserList headers={headers} users={users} errors={errors}/>}
    </div>
  );
}

export default App;
