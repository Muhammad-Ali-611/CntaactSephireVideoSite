const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".nav-toggle");
const tabs = document.querySelectorAll(".tab");
const solutionCard = document.querySelector("#solution-card");
const hostMeetingForm = document.querySelector("#host-meeting-form");
const joinMeetingForm = document.querySelector("#join-meeting-form");
const hostNameInput = document.querySelector("#host-name");
const joinRoomNameInput = document.querySelector("#join-room-name");
const meetingHelp = document.querySelector("#meeting-help");
const jitsiContainer = document.querySelector("#jitsi-container");
const videoPlaceholder = document.querySelector("#video-placeholder");
const copyMeetingLinkButton = document.querySelector("#copy-meeting-link");
const leaveMeetingButton = document.querySelector("#leave-meeting");

let meetingApi = null;
let currentRoomName = "";

const solutions = {
  collaboration: {
    eyebrow: "Collaboration",
    title: "Keep hybrid teams aligned from anywhere.",
    copy:
      "Connect meetings, chat, docs, and phone into one workspace so projects keep moving and teams stay focused.",
  },
  support: {
    eyebrow: "Customer Support",
    title: "Resolve customer issues faster across every channel.",
    copy:
      "Route conversations, launch video support, summarize cases, and give agents the context they need in real time.",
  },
  sales: {
    eyebrow: "Sales",
    title: "Help revenue teams prepare, follow up, and close.",
    copy:
      "Use AI summaries, call notes, coaching prompts, and customer history to keep every opportunity moving forward.",
  },
  education: {
    eyebrow: "Education",
    title: "Create engaging classes for students everywhere.",
    copy:
      "Run live lessons, office hours, group work, recordings, and virtual events with tools built for participation.",
  },
};

navToggle?.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-menu a, .nav-actions a, .footer-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const solution = solutions[tab.dataset.solution];

    if (!solution) {
      return;
    }

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    solutionCard.querySelector(".eyebrow").textContent = solution.eyebrow;
    solutionCard.querySelector("h3").textContent = solution.title;
    solutionCard.querySelector("p:not(.eyebrow)").textContent = solution.copy;
  });
});

function cleanRoomName(value) {
  const roomName = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return roomName || "team-sync";
}

function createMeetingId() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `team-sync-${randomNumber}`;
}

function getMeetingUrl(roomName) {
  const url = new URL(window.location.href);
  url.hash = "meeting";
  url.searchParams.set("room", roomName);
  return url.toString();
}

function setMeetingMessage(message) {
  if (meetingHelp) {
    meetingHelp.textContent = message;
  }
}

function leaveMeeting() {
  if (meetingApi) {
    meetingApi.dispose();
    meetingApi = null;
  }

  currentRoomName = "";
  jitsiContainer.classList.remove("active");
  videoPlaceholder.hidden = false;
  leaveMeetingButton.disabled = true;
  setMeetingMessage("Meeting ended. Host a new meeting or join with another meeting ID.");
}

function startMeeting(roomName, displayName = "") {
  if (!window.JitsiMeetExternalAPI) {
    setMeetingMessage("Meeting service did not load. Check your internet connection and refresh the page.");
    return;
  }

  if (meetingApi) {
    meetingApi.dispose();
  }

  currentRoomName = cleanRoomName(roomName);
  joinRoomNameInput.value = currentRoomName;
  jitsiContainer.innerHTML = "";
  videoPlaceholder.hidden = true;
  jitsiContainer.classList.add("active");
  leaveMeetingButton.disabled = false;

  meetingApi = new window.JitsiMeetExternalAPI("meet.jit.si", {
    roomName: `connectsphere-${currentRoomName}`,
    parentNode: jitsiContainer,
    width: "100%",
    height: "100%",
    configOverwrite: {
      prejoinPageEnabled: true,
    },
    userInfo: {
      displayName: displayName.trim(),
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
    },
  });

  window.history.replaceState({}, "", getMeetingUrl(currentRoomName));
  setMeetingMessage(`Meeting ID: ${currentRoomName}. Share this ID or copy the meeting link.`);
}

hostMeetingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  startMeeting(createMeetingId(), hostNameInput.value);
});

joinMeetingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!joinRoomNameInput.value.trim()) {
    setMeetingMessage("Enter the meeting ID from the host, then click Join Meeting.");
    joinRoomNameInput.focus();
    return;
  }

  startMeeting(joinRoomNameInput.value);
});

copyMeetingLinkButton?.addEventListener("click", async () => {
  const roomName = currentRoomName || cleanRoomName(joinRoomNameInput.value);
  const meetingUrl = getMeetingUrl(roomName);

  try {
    await navigator.clipboard.writeText(meetingUrl);
    setMeetingMessage("Meeting link copied. Send it to someone so they can join the same room.");
  } catch {
    setMeetingMessage(`Copy this meeting link: ${meetingUrl}`);
  }
});

leaveMeetingButton?.addEventListener("click", leaveMeeting);

const roomFromUrl = new URLSearchParams(window.location.search).get("room");

if (roomFromUrl && joinRoomNameInput) {
  joinRoomNameInput.value = cleanRoomName(roomFromUrl);
  window.addEventListener("load", () => startMeeting(roomFromUrl));
}
