import { setBaseUrl } from "@workspace/api-client-react";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
setBaseUrl(API_BASE);
