import { prisma } from "@/lib/prisma";

export const getUserInfo = async (userId: string) => {
  try {
    // Get the user and their associated UserInfo
    const userWithInfo = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userInfo: {
          include: {
            tickets: true
          }
        }
      }
    });

    if (!userWithInfo) {
      return null;
    }

    // Return the UserInfo (or null if none exist)
    return userWithInfo.userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};

export const updateUserInfo = async (
  userId: string,
  data: {
    bio?: string;
    location?: string;
    website?: string;
    company?: string;
    jobTitle?: string;
    preferences?: any;
  }
) => {
  try {
    // Update or create UserInfo
    const userInfo = await prisma.userInfo.upsert({
      where: {
        userId: userId
      },
      update: data,
      create: {
        userId: userId,
        ...data
      }
    });

    return userInfo;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};
