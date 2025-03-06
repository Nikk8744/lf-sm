import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);       
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const data = await request.text();

        const [socketId, channelName] = data.split("&").map((str) => str.split("=")[1]);

        if(channelName.startsWith("private-user-")){
            const userId = channelName.split("private-user-")[1];
            if(userId !== session.user.id){
                return NextResponse.json({ error: "Unauthorized channel" }, { status: 403 });
            }
        }
        const authResponse = pusherServer.authorizeChannel(socketId, channelName);
        return NextResponse.json(authResponse);
        
    } catch (error) {
        console.error("Pusher auth error:", error);
        return NextResponse.json({ error: "Failed to authenticate with Pusher" }, { status: 500 });
    }
}