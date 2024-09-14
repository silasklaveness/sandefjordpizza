import clientPromise from "@/libs/mongoConnect";
import { UserInfo } from "@/app/models/UserInfo";
import bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { User } from "@/app/models/User";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        await mongoose.connect(process.env.MONGO_URL);
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found");
        }

        const passwordOk = bcrypt.compareSync(password, user.password);
        if (passwordOk) {
          const userForSession = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
          return userForSession; // This will be returned to the session and JWT
        } else {
          throw new Error("Invalid password");
        }
      },
    }),
  ],
  callbacks: {
    // Called whenever a session is checked (client-side)
    async session({ session, token }) {
      // Attach token info (like id) to the session
      if (token) {
        session.id = token.id;
        session.user.id = token.id;
      }
      return session;
    },
    // Called whenever a JWT is created (server-side)
    async jwt({ token, user }) {
      // Initial sign-in, store the user info in the token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token; // Return the token to the session
    },
  },
  session: {
    strategy: "jwt", // Use JWT for sessions
  },
};

// Keep isAdmin separate from checkFields and NextAuth
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return false;
  }

  const userInfo = await UserInfo.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }

  return userInfo.admin; // Return admin status
}
