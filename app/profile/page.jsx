"use client"
import React from 'react'

import {useState, useEffect} from 'react'
import { SessionProvider, useSession } from 'next-auth/react'


import Profile from '@components/Profile'
import { useRouter } from 'next/navigation'

const MyProfile = () => {

    const router = useRouter();

      const {data:session} = useSession();

     const [posts, setPosts] = useState([]);

    useEffect(()=>{
        const fetchPosts = async()=>{
          const response = await fetch(`/api/users/${session?.user.id}/posts`);
           const data = await response.json();
    
           setPosts(data);
        }
         if(session?.user.id) fetchPosts();
      },[])

     const handleEdit = (post)=>{
             router.push(`/update-prompt?id=${post._id}`)                
     }

     const handleDelete = async(post)=>{
         const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
         if(hasConfirmed){
            try{
              await fetch(`/api/prompt/${post._id.toString()}`,{
                method: 'DELETE'
              })
              const filteredPosts = posts.filter((p)=>p._id !== post._id);

              setPosts(filteredPosts)
            }catch(error){
                console.log(error);
            }
         }
     }
  return (
    <SessionProvider>
    <Profile
     name="My"
     description="Welcome to your personalized profile page"
     data={posts}
     handleEdit={handleEdit}
     handleDelete={handleDelete}
     />
     </SessionProvider>
  )
}


export default MyProfile; 

