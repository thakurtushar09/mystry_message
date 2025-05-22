import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { error } from "console";


export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",



            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },


            async authorize(credentials:any):Promise<any>{
                await dbConnect();
                try {
                    const user=await UserModel.findOne({
                        $0r:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })

                    if(!user) throw new Error('No user found with this email');
                } catch (error:any) {
                    throw new error;
                }
            }
        })
    ]
}