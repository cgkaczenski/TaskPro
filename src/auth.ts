import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const userId = user.id as string;
      const existingUser = await getUserById(userId);

      if (existingUser && !existingUser?.currentTeamId) {
        const exisitingTeam = await db.team.findFirst({
          where: { personalWorkspace: true, teamLeaderId: userId },
        });

        if (exisitingTeam) {
          await db.user.update({
            where: { id: userId },
            data: {
              currentTeamId: exisitingTeam.id,
            },
          });
        } else {
          const defaultTeamName = `${existingUser.name}-personal-workspace`;
          const defaultTeam = await db.team.create({
            data: {
              name: defaultTeamName,
              teamLeaderId: userId,
              personalWorkspace: true,
              teamMemberships: {
                create: {
                  user: {
                    connect: {
                      id: userId,
                    },
                  },
                  role: "ADMIN",
                },
              },
            },
          });
          await db.user.update({
            where: { id: userId },
            data: {
              currentTeamId: defaultTeam.id,
            },
          });
        }
      }

      if (account?.provider !== "credentials") return true;

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (token.defaultProjectId && session.user) {
        session.user.defaultProjectId = token.defaultProjectId as string;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.defaultProjectId = existingUser.currentProjectId;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
