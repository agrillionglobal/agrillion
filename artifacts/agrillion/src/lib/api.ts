import { setBaseUrl } from "@workspace/api-client-react";
import { installAuthBridge } from "./auth";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";
setBaseUrl(API_BASE);

// Attach Bearer token from localStorage to every API request.
installAuthBridge();
