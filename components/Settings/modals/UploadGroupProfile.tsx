import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai';
import { projectFirestore, projectStorage, timestamp } from '../../../config/firebase.config';
import { useImageResizer } from '../../../hooks/useImageResizer';
import ImagePreview from '../../Gallery/ImagePreview';
import ProgressBar from '../../Gallery/ProgressBar';
import styles from './Modals.module.scss';

interface Props{
    type?: string,
    value: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    title: string,
    userId: string,
    setText?: any,
    setNewCoverPic: React.Dispatch<React.SetStateAction<string>>
}

  
export default function UploadGroupCover({type, value, setIsOpen, title, userId, setText, setNewCoverPic}: Props) {
    const [file, setFile] = useState<any>(null);
    const [preview, setPreview] = useState('');
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState('');
    
    const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

    const updateProfile = async ()=> {
        try{
            const resizedImage: any = await useImageResizer(file, 660, 1400);
            console.log(resizedImage)
            const storageRef = projectStorage.ref(file.name); 
            const collectionRef = projectFirestore.collection('coverPictures');
            
            storageRef.put(resizedImage).on("state_changed", (snap: any)=>{
                let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
                setProgress(percentage);
            }, (err: any)=>{
                console.log(err);
            }, async ()=>{
                const url = await storageRef.getDownloadURL();
                const createdAt = timestamp();
                collectionRef.add({
                    url,
                    userId
                })
                
                const update = async ()=>{
                    await axios.put(`http://localhost:5000/api/users/${userId}`, {
                        userId,
                        coverPic: url
                    })
                }
                
                setNewCoverPic(url)
                update();
                setUrl(url);
                setIsOpen(false);
                setIsLoading(false);
                setFile(null);
            });
        } catch(err){
            console.log(err);
        }
    };
    
    useEffect(()=>{
        if(file){
            const reader = new FileReader();
            reader.onloadend = () =>{
                setPreview(reader.result as string)
            };
            reader.readAsDataURL(file);
        }
    },[file])

    const handleFileChange = (e: any)=>{
        let selectedFile = e.target.files[0];
        
        if(selectedFile && imageTypes.includes(selectedFile.type)){
            setFile(selectedFile);
        } else{
            setFile(null);
        }
    }
    return (
        <div className={styles.modalContainer}>
            {/* <div className={"closeOverlay"} onClick={()=> setIsOpen(false)}/> */}
            <div className={`${styles.modal} ${styles.cover}`}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.uploadPhoto}>
                  <input type="file" onChange={handleFileChange}/>
                  <span><AiOutlineCamera/></span>
                  <div className={styles.imagePreviewCover}>
                    {preview &&  <img src={preview} alt="" />}
                  </div>
                </div>
                <div className={styles.buttons}>
                <button className={styles.save} onClick={updateProfile}>Save</button>
                <button className={styles.cancel} onClick={()=> setIsOpen(false)}>Cancel</button>
                </div>
                {isLoading && <ProgressBar progress={progress}/>}
            </div>
        </div>
    )
}
