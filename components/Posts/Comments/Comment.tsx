import axios from 'axios';
import Router from 'next/router';
import React, { useState } from 'react';
import { format } from 'timeago.js';
import { useGetUser } from '../../../hooks/useGetUser';
import styles from './Comment.module.scss';
import CommentDots from './CommentDots';
import Image from 'next/image';

interface Props {
    hour?: {
        number: string;
        type: string;
    };
    text: string;
    image: string;
    userId: string;
    likes: any;
    loggedUser: any;
    createdAt: any;
}

export default function Comment({ image, text, userId, likes, loggedUser, createdAt }: Props) {
    const [openImage, setOpenImage] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const user: any = useGetUser(userId);

    const handleClick = () => setOpenImage(true);
    const handleModal = () => (modalOpen ? setModalOpen(false) : setModalOpen(true));

    const handleImageClick = () => {
        Router.push('user/' + user.username);
    };

    return (
        <div className={styles.commentContainer}>
            <div className={styles.user}>
                <img
                    src={user.profilePic || 'noProfile.png'}
                    alt={user.name}
                    onClick={handleImageClick}
                />
                <div className={styles.bothColumn}>
                    <h5 className={user.name || `${styles.skeleton} ${styles.skeletonText}`}>
                        {`${user.name} ${user.lastname}`}
                    </h5>
                    <p>·</p>
                    <p className={styles.createdAt}>{format(createdAt)}</p>
                </div>
            </div>
            <div className={styles.post}>
                {text && <p className={styles.text}>{text}</p>}
                {image && (
                    <div className={styles.imageContainer}>
                        <img src={image} width="100%" onClick={handleClick} />
                    </div>
                )}
            </div>
            <CommentDots
                username={user.username}
                userId={userId}
                loggedUserId={loggedUser?._id}
                handleModal={handleModal}
            />
        </div>
    );
}
