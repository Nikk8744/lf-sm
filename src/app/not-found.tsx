'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound(){
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-bold text-red-600">404</h1>
                <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-yellow-400">Page not found</h2>
                    <p className="text-base text-gray-700">The page you`re looking for doesn`t exist or has been removed.</p>
                </div>
                <div className="space-x-4">
                    <Button onClick={() => router.back()} variant={"outline"}>
                        Go back
                    </Button>
                    <Button onClick={() => router.push('/')}>
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    )
}