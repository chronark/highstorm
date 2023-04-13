import { currentUser } from "@clerk/nextjs/app-beta";
import { EmptyState } from "./empty-state";

type Props = {
  channelName: string;
};
export async function EmptyEventsFallback({ channelName }: Props) {
  const user = await currentUser();
  if (!user) {
    return <></>;
  }

  const url = process.env.VERCEL_URL ? "https://highstorm.app" : "http://localhost:3000";

  return (
    <EmptyState
      title="No Events"
      description="To get started, you can publish an event using curl:"
    >
      <pre className="p-4 font-mono text-left whitespace-pre bg-white border rounded-md border-neutral-300">
        {`curl '${url}/api/v1/events/${channelName ?? "users.signup"}' \\
    -H 'Authorization: Bearer <HIGHSTORM_TOKEN>' \\
    -H 'Content-Type: application/json' \\
    -d '{
            "event": "${user?.username} has signed up",
            "content": "A new user has signed up",
            "metadata": {"userId": "${user?.id}"}
        }'
`}
      </pre>
    </EmptyState>
  );
}
