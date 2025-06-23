import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import Image from 'next/image';
import { Button } from './ui/button';
const Navbar = () => {
    const {data:session} = useSession();

    const user:User = session?.user as User
    console.log(user);
    
    
  return (
    <div className='flex items-center justify-between'>
        <div className="">
            <Image src={'/logo.png'} alt='logo' height={100} width={100}/>
        </div>

        <div className="">
            <Button onClick={()=>signOut()}>Logout</Button>
        </div>
    </div>
  )
}

export default Navbar