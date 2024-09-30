import { User } from "@/app/models/User";
import { UserInfo } from "@/app/models/UserInfo";
import mongoose from "mongoose";
import { isAdmin } from "@/app/utils/authOptions";

export async function GET(req) {
  const isAdminUser = await isAdmin();

  if (!isAdminUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const users = await User.find().lean();
    const userInfos = await UserInfo.find().lean();

    const usersWithRoles = users.map((user) => {
      const userInfo = userInfos.find((info) => info.email === user.email);
      return {
        ...user,
        admin: userInfo?.admin || false,
        employee: userInfo?.employee || false,
      };
    });

    return new Response(JSON.stringify(usersWithRoles), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
