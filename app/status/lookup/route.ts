import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawTrackingId = url.searchParams.get("trackingId") || "";
  const trackingId = rawTrackingId.trim().toUpperCase();

  if (!trackingId) {
    redirect("/status");
  }

  redirect(`/status/${encodeURIComponent(trackingId)}`);
}
