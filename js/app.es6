let current = document.querySelector("[data-current]");
let timer = {
  task: current.querySelector("[data-task]"),
  minutes: current.querySelector("[data-minutes]"),
  seconds: current.querySelector("[data-seconds]")
};
let generated = document.querySelector("[data-generated]");
let desiredMinutes = document.querySelector("[data-control] input[name=minutes]");
let taskName = document.querySelector("[data-control] input[name=task]");
let buttons = {
  start: document.querySelector("[data-start]"),
  reset: document.querySelector("[data-reset]"),
  cut: document.querySelector("[data-cut]"),
};
let interval = null;
let delegateEventToElement = (eventName, elementSelector, callback) => {
  document.addEventListener("click", (event) => {
    let element = document.querySelector(elementSelector);
    if (event.target === element) {
      callback(event);
    }
  });
}
let initialMinutes = null;
let secondsLeft = null;

if ("Notification" in window && Notification.permission !== "denied") {
  Notification.requestPermission();
}

let notify = (message, body = "Good one!") => {
  let options = {
    body: body,
    icon: "img/pommidoro.png",
  };
  if (Notification.permission === "granted") {
    var notification = new Notification(message, options);
  }
}
let setTimer = (minutes) => {
  initialMinutes = minutes;
  timer.minutes.innerHTML = minutes;
  timer.seconds.innerHTML = "00";
  timer.task.innerHTML = taskName.value || "Stuff";
  secondsLeft = minutes * 60;
};

let getRemaining = () => {
  let minutes = parseInt(secondsLeft / 60, 10);
  let seconds = secondsLeft - minutes * 60;
  return { minutes, seconds };
};

let updateTimer = () => {
  let remaining = getRemaining();
  timer.minutes.innerHTML = remaining.minutes;
  timer.seconds.innerHTML = remaining.seconds;
};

let timerFinished = () => secondsLeft == 0
let saveCurrentTimer = () => {
  let item = document.createElement("p");
  item.innerHTML = `ok ${taskName.value} - ${initialMinutes}`;
  generated.appendChild(item);
}

let reset = () => {
  clearInterval(interval);
  setTimer(0);
  buttons.start.disabled = false;
  buttons.reset.disabled = true;
  buttons.cut.disabled = true;
}

let cutCurrent = () => {
  let remaining = getRemaining();
  let item = document.createElement("p");
  item.innerHTML = `cut ${taskName.value} - ${initialMinutes}: remaining ${remaining.minutes}:${remaining.seconds}`;
  generated.appendChild(item);
}

delegateEventToElement("click", "[data-start]", (event) => {
  let minutes = parseInt(desiredMinutes.value, 10);
  setTimer(minutes);
  console.debug(buttons);
  buttons.start.disabled = true;
  buttons.reset.disabled = false;
  buttons.cut.disabled = false;
  interval = setInterval(() => {
    secondsLeft -= 1;
    updateTimer();
    if (timerFinished()) {
      saveCurrentTimer();
      notify("Pommidoro finished", `[${taskName.value}] Good one!`);
    }
  }, 1000);
  event.preventDefault();
});
delegateEventToElement("click", "[data-reset]", (event) => {
  reset();
  event.preventDefault();
});
delegateEventToElement("click", "[data-cut]", (event) => {
  cutCurrent()
  reset();
  event.preventDefault();
});
