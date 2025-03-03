import axios from 'axios';
import Router from 'next/router';
import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaNodeJs } from 'react-icons/fa';
import styles from './SearchUsers.module.scss';

export default function SearchUsers() {
    const [query, setQuery] = useState('');
    const [userList, setUserList] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    const debounceRef = useRef<NodeJS.Timeout>();

    //Handlers

    useEffect(() => {}, []);

    const handleSubmit = async () => {
        try {
            const users = await axios.post(`http://localhost:5000/api/users/search`, {
                query: query
            });
            setUserList([...users.data]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.length <= 2) {
            setUserList([]);
            debounceRef.current && clearTimeout(debounceRef.current);
        }
        setQuery(e.target.value);

        debounceRef.current = setTimeout(() => {
            handleSubmit();
        }, 500);
    };

    return (
        <>
            {userList.length >= 1 && (
                <div
                    className={styles.closeOverlay}
                    onClick={() => {
                        setUserList([]);
                        setQuery('');
                    }}></div>
            )}
            <div className={styles.searchUsersContainer}>
                <div className={styles.input}>
                    <div className={styles.inputBar}>
                        <span className={styles.icon}>
                            <AiOutlineSearch />
                        </span>
                        <input
                            type={styles.text}
                            onChange={handleChange}
                            value={query}
                            placeholder="Search Snow"
                            onFocus={() => setIsFocus(true)}
                        />
                    </div>
                </div>
                <div className={`${styles.people} ${isFocus && query && styles.active}`}>
                    {!isLoading ? (
                        userList.map((user: any) => (
                            <div
                                className={styles.personContainer}
                                onClick={() => Router.push('')}
                                key={user._id}>
                                <div className={styles.content}>
                                    <div className={styles.image}>
                                        <img
                                            src={user.profilePic || 'noProfile.png'}
                                            alt={user.name}
                                        />
                                        <div className={styles.status} />
                                    </div>
                                    <div className={styles.info}>
                                        <h4
                                            className={
                                                styles.friendName
                                            }>{`${user.name} ${user.lastname}`}</h4>
                                        <p>@{user.username}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.loader}>
                            <div className={styles.progress}></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
