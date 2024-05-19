import { HeaderLogo } from "@/components/header-logo"
import Navigation from "@/components/navigation"
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { WelcomeMsg } from "@/components/welcome-msg"

export const Header = () =>{
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500
          lg:px-14 pb-36 px-4 py-8">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo/>
                        <Navigation/>
                    </div>
                    <ClerkLoaded>
                      <UserButton afterSignOutUrl="/"/>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2
                          className="animate-spin size-8 text-slate-400"
                        />
                    </ClerkLoading>
                </div>
                <WelcomeMsg/>
            </div>
        </header>
    )
}