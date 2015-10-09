"use strict";

var current = document.querySelector("[data-current]");
var timer = {
  task: current.querySelector("[data-task]"),
  minutes: current.querySelector("[data-minutes]"),
  seconds: current.querySelector("[data-seconds]")
};
var generated = document.querySelector("[data-generated]");
var desiredMinutes = document.querySelector("[data-control] input[name=minutes]");
var taskName = document.querySelector("[data-control] input[name=task]");
var buttons = {
  start: document.querySelector("[data-start]"),
  reset: document.querySelector("[data-reset]"),
  cut: document.querySelector("[data-cut]")
};
var interval = null;
var delegateEventToElement = function delegateEventToElement(eventName, elementSelector, callback) {
  document.addEventListener("click", function (event) {
    var element = document.querySelector(elementSelector);
    if (event.target === element) {
      callback(event);
    }
  });
};
var initialMinutes = null;
var secondsLeft = null;

if ("Notification" in window && Notification.permission !== "denied") {
  Notification.requestPermission();
}

var notify = function notify(message) {
  var body = arguments.length <= 1 || arguments[1] === undefined ? "Good one!" : arguments[1];

  var options = {
    body: body,
    icon: "img/pommidoro.png"
  };
  if (Notification.permission === "granted") {
    var notification = new Notification(message, options);
  }
};
var setTimer = function setTimer(minutes) {
  initialMinutes = minutes;
  timer.minutes.innerHTML = minutes;
  timer.seconds.innerHTML = "00";
  timer.task.innerHTML = taskName.value || "Stuff";
  secondsLeft = minutes * 60;
};

var getRemaining = function getRemaining() {
  var minutes = parseInt(secondsLeft / 60, 10);
  var seconds = secondsLeft - minutes * 60;
  return { minutes: minutes, seconds: seconds };
};

var updateTimer = function updateTimer() {
  var remaining = getRemaining();
  timer.minutes.innerHTML = remaining.minutes;
  timer.seconds.innerHTML = remaining.seconds;
};

var timerFinished = function timerFinished() {
  return secondsLeft == 0;
};
var saveCurrentTimer = function saveCurrentTimer() {
  var item = document.createElement("p");
  item.innerHTML = "ok " + taskName.value + " - " + initialMinutes;
  generated.appendChild(item);
};

var reset = function reset() {
  clearInterval(interval);
  setTimer(0);
  buttons.start.disabled = false;
  buttons.reset.disabled = true;
  buttons.cut.disabled = true;
};

var cutCurrent = function cutCurrent() {
  var remaining = getRemaining();
  var item = document.createElement("p");
  item.innerHTML = "cut " + taskName.value + " - " + initialMinutes + ": remaining " + remaining.minutes + ":" + remaining.seconds;
  generated.appendChild(item);
};

delegateEventToElement("click", "[data-start]", function (event) {
  var minutes = parseInt(desiredMinutes.value, 10);
  setTimer(minutes);
  console.debug(buttons);
  buttons.start.disabled = true;
  buttons.reset.disabled = false;
  buttons.cut.disabled = false;
  interval = setInterval(function () {
    secondsLeft -= 1;
    updateTimer();
    if (timerFinished()) {
      saveCurrentTimer();
      notify("Pommidoro finished", "[" + taskName.value + "] Good one!");
    }
  }, 1000);
  event.preventDefault();
});
delegateEventToElement("click", "[data-reset]", function (event) {
  reset();
  event.preventDefault();
});
delegateEventToElement("click", "[data-cut]", function (event) {
  cutCurrent();
  reset();
  event.preventDefault();
});