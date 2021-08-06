import React, { useState } from 'react';
import { useRouter } from 'next/router'
import styles from '../styles/Button.module.css'
import abcss from '../styles/Authbutton.module.css'

export default function AuthButton() {
  const [inputVisible, setInputVisible] = useState(false)
  const [userName, setUserName] = useState("")
  const [warning, setWarning] = useState("")
  const router = useRouter()

  function handleChange(event) {
    const input = event.target
    const value = input.value
  
    setUserName(value)
  }
  async function sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str + "hahahahaha")).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
    });
  }
  function handleLogIn() {

    fetch('/userauth/newusercheck', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: userName
      })
    })
    .then(response => {
      response.json()
      if(response.status == 409) {
        console.warn("Username is in use")
        setWarning("That username is unavaliable.")
      }
      if(response.status == 200) {
        /*sha512(userName).then((response)=>{
          localStorage.setItem('hashedUserString', response)
        }) We'll now get this from the server */ 
        localStorage.setItem('user', userName);
        
        router.push('chat')
      }

    })
  }

    return <>
      {!inputVisible && 
        <button className={styles.button} onClick={() => {
          setInputVisible(true)
        }}>Join</button>
      }

      {inputVisible &&
        <div>
          <p style={{margin:'0 0 0.2rem 0'}}>Enter Username: </p>
          <input className={abcss.input} placeholder="Mr Sussy Balls" onChange={handleChange} style={{borderTopRightRadius:0,borderBottomRightRadius:0}} onSelect={()=>{router.prefetch('chat')}}/>
          <button onClick={handleLogIn} className={styles.primarybutton} style={{margin:0, borderTopLeftRadius:0, borderBottomLeftRadius:0}}>Go!</button>
          <p style={{color:"red", margin:0}}>{warning}</p>
        </div>
      }
    </>
}