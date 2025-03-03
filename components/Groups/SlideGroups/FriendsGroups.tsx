import React, { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import Slider from 'react-slick';
import GroupCard from './GroupCard';
import styles from './GroupsSlide.module.scss';
import { useMediaQuery } from 'react-responsive';

let initialSettings = {
  dots: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 2
  };

export default function FriendsGroups() {
    const [groups, setGroups] = useState<any>([])
    const [settings, setSettings] = useState<any>(initialSettings);

    const isResponsive = useMediaQuery({ query: '(min-width: 1200px)' });
    
    const fetchGroups = async ()=>{
        try{
            const groupsData = await axios.get('http://localhost:5000/api/groups');
            setGroups([...groupsData.data]);
            (groupsData.data)
        } catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        !isResponsive && setSettings({...settings, slidesToShow: 1, slidesToScroll: 1})
    },[isResponsive]);

    useEffect(()=>{
        fetchGroups();
    },[])

    return (
      <div className={styles.slideContainer}>
      <h3 className={styles.title}>Friends Groups</h3>
      <p>Groups where your friends are</p>
      <div className={styles.slide}>
          <Slider {...settings}>
              {
                  groups.map(({title, description, groupPic, groupCover,
                               private: groupPrivate, members, _id}: any)=>(
                      <GroupCard 
                          title={title}
                          description={description}
                          groupPic={groupPic}
                          groupCover={groupCover}
                          groupPrivate={groupPrivate}
                          members={members}
                          _id={_id}
                          key={_id}
                          userId={''} />
                  ))
              }
          </Slider>
        </div>
    </div>
    )
}
