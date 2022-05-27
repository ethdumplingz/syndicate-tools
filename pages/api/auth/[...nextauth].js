import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
		// ...add more providers here
	],
})