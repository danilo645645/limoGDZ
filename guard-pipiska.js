// guard-pipiska.js (frontend-only)
// Если нет сессии — редирект на login и вернём обратно в pipiska.html

import { requireAuth } from "./auth.js";

requireAuth({ next: "pipiska.html" });

