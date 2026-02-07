// guard-pipiska.js
import { requireAuth } from "./auth.js";

requireAuth({ next: "pipiska.html", loginPage: "login.html" });
