import clientPromise from "@/libs/mongoConnect";
import { UserInfo } from "@/app/models/UserInfo";
import bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { User } from "@/app/models/User";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import isAdmin from "@/app/utils/authOptions";
import { authOptions } from "@/app/utils/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
