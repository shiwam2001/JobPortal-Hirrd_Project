import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Link, useSearchParams } from 'react-router-dom'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react'

const header = () => {

    const [showSignIn, setShowSignIn] = useState(false)

    const [search, setSearch] = useSearchParams()
    const { user } = useUser()

    useEffect(() => {
        if (search.get('sign-in')) {
            setShowSignIn(true)
        }
    }, [search])

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShowSignIn(false)
            setSearch({}) // Clear the search params
        }
    }

    return <>
        <nav className='py-5 flex justify-between items-center  '>
            <Link>
                <img src="/logo.png" className='h-20' alt="" />
            </Link>

            <div className='flex gap-5 '>
                <SignedOut>
                    <Button variant="outline" onClick={() => setShowSignIn(true)} >Login</Button>
                </SignedOut>
                <SignedIn>
                    {user?.unsafeMetadata?.role === "recruiter" && (
                         <Link to="/post-job">
                    <Button variant="red"
                        className='rounded-full'>
                        <PenBox size={20} className='mr-2' />
                        Post a job</Button> 
                        </Link>
                    )}
                   
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: 'h-10 w-10',
                            }
                        }}
                    >
                        <UserButton.MenuItems>
                            <UserButton.Link
                                label="My jobs"
                                labelIcon={<BriefcaseBusiness size={15} />}
                                href='/my-jobs'
                            />
                            <UserButton.Link
                                label="Saved jobs"
                                labelIcon={<Heart size={15} />}
                                href='/saved-jobs'
                            />
                        </UserButton.MenuItems>
                    </UserButton>
                </SignedIn>
            </div>

        </nav>

        {showSignIn && <div className='fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center'
            onClick={handleOverlayClick} >
            <SignIn
                signUpFallbackRedirectUrl='/onboarding'
                fallbackRedirectUrl='/onboarding'
            />
        </div>}

    </>


}

export default header
