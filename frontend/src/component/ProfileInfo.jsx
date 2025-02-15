import React from 'react'
import { FaEye } from 'react-icons/fa';


    const ProfileInfo = () => {
        const userProfile = {
            avatar_url: "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745",
            bio: "👨🏻‍💻👨🏻‍💻👨🏻‍💻",
            email: "johndoe@gmail.com",
            followers: 100,
            following: 200,
            html_url: "https://github.com/burakorkmez",
            location: "Somewhere, Earth",
            name: "John Doe",
            public_gists: 100,
            public_repos: 100,
            twitter_username: "johndoe",
            login: "johndoe",
        };
  return (
    <div className='lg:w-1/3 w-full flex flex-col gap-2 md:sticky md:top-10'>
        <div className='bg-glass rounded-lg p-4'>
        <div className='flex gap-3 items-center'>
            {/* user avatar */}
        <a href="https://github.com/shubhambhattacharya-dev" target='_blank' rel='noreferrer'>
                <img 
                       src={userProfile?.avatar_url} 
                       className='' 
                       alt='' />
              
                <FaEye size={16} />
                View on Github 
                </a>
                                                   
                                    
                    </div>

        </div>
        </div>
  )
};

export default ProfileInfo