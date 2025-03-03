import Link from 'next/link'
import React from 'react'
import styles from '../../styles/verified.module.scss';
import Image from 'next/image';



export default function success() {
  return (
    <div className={styles.successContainer}>
      <div className={styles.bg}/>
      <div className={styles.content}>
        <div className={styles.successImg}>
          <img src="success.svg"/>
        </div>
        <p>You have successfully registered in Snow!</p>
        <button><Link href="/login">Log in</Link></button>
      </div>
    </div>
  )
}
