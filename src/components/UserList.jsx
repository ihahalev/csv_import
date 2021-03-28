import React from 'react';
import './UserList.css';

function UserList({ headers, users, errors }) {
  return (
    <table >
      <thead >
        <tr>
          {headers.map( header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {users.map((user, i) => (
          <tr key={user.id} >
          {headers.map( header => {
            const err = errors[i];
            let cls='';
            if (err[header]) cls = 'error';
            return <td key={user.id+header} className={cls}>{user[header]}</td>
          })}
          </tr>
        ))}
      </tbody>
    </table>
    // <ul>
    //   {headers.map(header => (
    //     <li key={header}>{header}</li>
    //   ))}
    // </ul>
  );
}

export default UserList;