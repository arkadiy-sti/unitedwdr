export type AnalyticsEvent = "phone_click" | "request_service_open" | "request_service_submit" | "contact_agent_open" | "contact_call_click" | "contact_message_click" | "service_view" | "location_view";
export function track(event: AnalyticsEvent, detail: Record<string, string> = {}): void {
  window.dispatchEvent(new CustomEvent("united:analytics", { detail: { event, ...detail } }));
}
