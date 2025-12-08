import connectDB from "@/db";
import User from "@/model/user.model";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
    } catch (error) {
        console.log("Database error", error)
    }
    const { username, email, name, password } = await req.json();

    try {
        if(!username || !email || !name || !password) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }
    
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
        if (existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 409 });
        }
    
        const {userId, sessionClaims} = await auth();

        console.log("Userid:", userId);
        console.log("sessionClaims:", sessionClaims);

        const user = User.create({
            username,
            email,
            name,
            password,
        })

        return new Response(JSON.stringify({ message: "User created successfully", user }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal Server Error", error }), { status: 500 });
    }
}