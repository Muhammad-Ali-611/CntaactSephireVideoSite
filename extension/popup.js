const defaultAppUrl = "https://zippy-griffin-e2deb1.netlify.app";

const hostMeetingButton = document.querySelector("#host-meeting");
const joinForm = document.querySelector("#join-form");
const meetingIdInput = document.querySelector("#meeting-id");
const settingsToggle = document.querySelector("#settings-toggle");
const settingsForm = document.querySelector("#settings-form");
const appUrlInput = document.querySelector("#app-url");
const statusMessage = document.querySelector("#status-message");

function cleanMeetingId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createMeetingId() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `team-sync-${randomNumber}`;
}

function normalizeAppUrl(value) {
  const trimmedValue = value.trim().replace(/\/+$/, "");

  if (!trimmedValue) {
    return defaultAppUrl;
  }

  return trimmedValue;
}

function setStatus(message) {
  statusMessage.textContent = message;
}

async function getAppUrl() {
  return normalizeAppUrl(localStorage.getItem("appUrl") || defaultAppUrl);
}

async function openMeeting(meetingId) {
  const appUrl = await getAppUrl();
  const url = new URL(appUrl);
  url.searchParams.set("room", cleanMeetingId(meetingId));
  url.hash = "meeting";

  window.open(url.toString(), "_blank", "noopener");
  window.close();
}

async function loadSettings() {
  appUrlInput.value = await getAppUrl();
}

hostMeetingButton.addEventListener("click", () => {
  openMeeting(createMeetingId());
});

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const meetingId = cleanMeetingId(meetingIdInput.value);

  if (!meetingId) {
    setStatus("Enter a meeting ID first.");
    meetingIdInput.focus();
    return;
  }

  openMeeting(meetingId);
});

settingsToggle.addEventListener("click", () => {
  const isHidden = settingsForm.hidden;
  settingsForm.hidden = !isHidden;
  settingsToggle.setAttribute("aria-expanded", String(isHidden));
});

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const appUrl = normalizeAppUrl(appUrlInput.value);

  try {
    new URL(appUrl);
  } catch {
    setStatus("Enter a valid website URL.");
    return;
  }

  localStorage.setItem("appUrl", appUrl);
  appUrlInput.value = appUrl;
  setStatus("Website URL saved.");
});

loadSettings();
