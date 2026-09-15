export interface ContactIntegrationConfig {
  voiceAgent?: { enabled: boolean; provider?: string }; sms?: { enabled: boolean; href?: string };
  chat?: { enabled: boolean; provider?: string }; webhook?: { enabled: boolean; endpointEnv: "LEAD_WEBHOOK_URL" };
  crm?: { enabled: boolean; provider?: string }; scheduling?: { enabled: boolean; url?: string };
}
export const contactIntegrations: ContactIntegrationConfig = {
  voiceAgent: { enabled: false }, sms: { enabled: false }, chat: { enabled: false },
  webhook: { enabled: true, endpointEnv: "LEAD_WEBHOOK_URL" }, crm: { enabled: false }, scheduling: { enabled: false }
};
