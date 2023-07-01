/*
	Panzer RAM Widget

	Created by Dean Beedell
	Original clock concept by Weissboard

	Re-coded by Dean Beedell
	Visuals added to and enhanced by Dean Beedell
	Sorted by Harry Whitfield

	email: dean.beedell@lightquick.co.uk
	http//lightquick.co.uk
*/

/*jslint multivar, this */

/*property
    MouseWheelPref, altKey, busy, clockFaceSwitchPref, clockSize, ctrlKey,
    data, duration, ease, endAngle, floor, getDate, getHours, getMilliseconds,
    getMinutes, getSeconds, getTime, getTimezoneOffset, hOffset,
    hRegistrationPoint, height, kEaseOut, length, mainDLSPref, match,
    maxLength, milliseconds, minLength, onMouseDown, onMouseUp, onMouseWheel,
    opacity, option, optionListPref1, optionListPref2, platform, readFile,
    rotation, round, scrollDelta, secyDLSPref, setTime, size, soundPref, split,
    src, srcHeight, srcWidth, start, startAngle, startTime, ticks, toFixed,
    toString, tooltip, vOffset, vRegistrationPoint, value, visible, width
*/

"use strict";

var mainWindow, background, surround, switchFacesButton, ramMaxText, ramAveText,
		hourHand, hourShadow, minuteHand, minuteShadow, secondHand, secondShadow,
	        bigReflection, windowReflection,
		startButton, stopButton, pin, prefs, tankHelp, helpbutton, tickSwitch,
		createLicence, setmenu, theDLSdelta, lprint, smallMinuteHand,
		helpButton, showFace, mainScreen, settooltip, checkLockWidget;


var windowx = 785, windowy = 622;
var backxo = 0, backyo = 0, backgroundxo = 7, backgroundyo = 0;
var surroundxo = 0, surroundyo = 0;
var switchFacesButtonxo = 710, switchFacesButtonyo = 267;
var dangerLampxo = 247, dangerLampyo = 150;
var startButtonxo = 710, startButtonyo = 135;
var stopButtonxo = 710, stopButtonyo = 395;
var secondxo = 416, secondyo = 313, secondxr = 11.5, secondyr = 245.5;
var secondshadowxo = 416, secondshadowyo = 313, secondshadowxr = 22.5, secondshadowyr = 260.5;
var ramAveTextxo = 330, ramAveTextyo = 210;
var ramMaxTextxo = 522, ramMaxTextyo = 403;
var ramAveTextAreaxo = 330, ramAveTextAreayo = 210;
var ramMaxTextAreaxo = 522, ramMaxTextAreayo = 403;
var shadowOffset = 0;
var bigReflectionxo = 169, bigReflectionyo = 69;
var windowReflectionxo = 511, windowReflectionyo = 210;
var pinxo = 162, pinyo = 60;
var prefsxo = 161, prefsyo = 516;
var helpButtonxo = 625, helpButtonyo = 516;
var tickSwitchxo = 625, tickSwitchyo = 59;
var currIcon = "Resources/images/dock.png";
var widgetName = "Panzer RAM Ywidget.widget";

var counter = "Resources/sounds/counter.mp3";
var lock = "Resources/sounds/lock.mp3";
var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";
var mistake = "Resources/sounds/mistake.wav";
var thhhh = "Resources/sounds/thhhh.mp3";
var winding = "Resources/sounds/winding.mp3";

include("functions.js");
include("Resources/Licence/licence.js");

//===============================================================
// this function is
//===============================================================
function startup() {
    debugFlg = preferences.debugflgPref.value;
    if (debugFlg === "1") {
		preferences.imageEditPref.hidden=false;
		preferences.imageCmdPref.hidden=false;
	} else {
		preferences.imageEditPref.hidden=true;		
		preferences.imageCmdPref.hidden=true;
	}
    sizeClock();
    setTextAreas();
    mainScreen();
    createLicence(mainWindow);
    updateRAM();
    setmenu();
    settooltip();
    checkLockWidget();
    buildVitality(currIcon, 0); // build the dock vitality
}
//=====================
//End function
//=====================


//===============================================================
// this function is
//===============================================================
function sizeClock() {
	var scale = Number(preferences.clockSize.value) / 100;

	function sc(img, hOffset, vOffset, hReg, vReg) {
		img.hOffset = Math.round(hOffset * scale);
		img.vOffset = Math.round(vOffset * scale);
		img.width = Math.round(img.srcWidth * scale);
		img.height = Math.round(img.srcHeight * scale);
		if (hReg !== undefined) {
			img.hRegistrationPoint = Math.round(hReg * scale);
		}
		if (vReg !== undefined) {
			img.vRegistrationPoint = Math.round(vReg * scale);
		}
	}

	mainWindow.width = Math.round(windowx * scale);
	mainWindow.height = Math.round(windowy * scale);

	sc(background, backgroundxo, backgroundyo);
	sc(surround, surroundxo, surroundyo);
	sc(switchFacesButton, switchFacesButtonxo, switchFacesButtonyo);
	sc(dangerLamp, dangerLampxo, dangerLampyo);
	sc(startButton, startButtonxo, startButtonyo);
	sc(stopButton, stopButtonxo, stopButtonyo);
	sc(secondHand, secondxo, secondyo, secondxr, secondyr);
	sc(secondShadow, secondshadowxo + shadowOffset, secondshadowyo + shadowOffset, secondshadowxr, secondshadowyr);

	sc(bigReflection, bigReflectionxo, bigReflectionyo);
	sc(windowReflection, windowReflectionxo, windowReflectionyo);
	sc(pin, pinxo, pinyo);
	sc(prefs, prefsxo, prefsyo);

	sc(helpButton, helpButtonxo, helpButtonyo);
	sc(tickSwitch, tickSwitchxo, tickSwitchyo);

	ramMaxText.size = Math.round(22 * scale);
	ramMaxText.hOffset = Math.round(ramMaxTextxo * scale);
	ramMaxText.vOffset = Math.round(ramMaxTextyo * scale);

	ramAveText.size = Math.round(22 * scale);
	ramAveText.hOffset = Math.round(ramAveTextxo * scale);
	ramAveText.vOffset = Math.round(ramAveTextyo * scale);

	ramMaxTextArea.size = Math.round(22 * scale);
	ramMaxTextArea.hOffset = Math.round(ramMaxTextAreaxo * scale);
	ramMaxTextArea.vOffset = Math.round(ramMaxTextAreayo * scale);

	ramAveTextArea.size = Math.round(22 * scale);
	ramAveTextArea.hOffset = Math.round(ramAveTextAreaxo * scale);
	ramAveTextArea.vOffset = Math.round(ramAveTextAreayo * scale);
}
//=====================
//End function
//=====================


//===============================================================
// this function is called when
//===============================================================
function updateRAM() {
	var systemMemoryLoad, systemMemoryTotalPhysical;


		rotateObject = function (obj, value) {
			var animationDuration,
				animationInterval = 60,

				updateMe = function () {	// called during rotateAnimation
					var now = animator.milliseconds, fraction, angle;

					if (now >= (this.startTime + this.duration)) {
						obj.rotation = this.endAngle;
						obj.busy = false;
						return false;
					}
					fraction = (now - this.startTime) / this.duration;
					angle = animator.ease(this.startAngle, this.endAngle, fraction, animator.kEaseOut);
					obj.rotation = angle;
					return true;
				},

				rotateAnimation = function (startAngle, endAngle) {
					var rotate = new CustomAnimation(animationInterval, updateMe);
					rotate.duration = animationDuration;
					rotate.startAngle = startAngle;
					rotate.endAngle = endAngle;
					animator.start(rotate);
				};

			obj.busy = true;
			animationDuration = animationInterval * Math.floor(900 / animationInterval - 1);
			rotateAnimation(obj.rotation, value);
		};

	//print( "Installed RAM: " + bytesToUIString( system.memory.totalPhysical ) );
	systemMemoryTotalPhysical = String(bytesToUIString( system.memory.totalPhysical ));
    ramMaxText.data = systemMemoryTotalPhysical.substring(0, 3);
	ramMaxText.tooltip = "Installed RAM: " + String( systemMemoryTotalPhysical );
    ramMaxTextArea.data = ramMaxText.data ;
	ramMaxTextArea.tooltip = ramMaxText.tooltip;

       	//print( "ramMaxText.data: " + ramMaxText.data);

	//print( "percentage load: " + String( system.memory.load ) );
	systemMemoryLoad = String(parseInt(system.memory.load, 10));
    ramAveText.data = systemMemoryLoad.substring(0, 2);
	ramAveText.tooltip = "percentage load: " + String( systemMemoryLoad ) + "%";
    ramAveTextArea.data = ramAveText.data ;
	ramAveTextArea.tooltip = ramAveText.tooltip ;

        //print( "ramAveText.data: " + ramAveText.data);
        //systemMemoryLoad = 80;
        if (preferences.tickSwitchPref.value == "tick" ) {
              secondHand.rotation = (systemMemoryLoad  * 3) +30;
       	      secondShadow.rotation = secondHand.rotation;
        } else {
              // zero pointer smoothly
      	      rotateObject(secondHand, (systemMemoryLoad  * 3) +30);
      	      rotateObject(secondShadow, (systemMemoryLoad  * 3) +30);
        }

        if (systemMemoryLoad >= 80)  {
               dangerLamp.src = "Resources/images/red-lamptrue.png";
        } else {
               dangerLamp.src = "Resources/images/red-lampfalse.png";
        }
        buildVitality(currIcon,  String( systemMemoryLoad ) ); // build the dock vitality
    }
//=====================
//End function
//=====================


//===============================================================
// this function
//===============================================================
startButton.onMouseDown = function (event) {
	if (preferences.soundPref.value !== "disabled") {
		play(ting, false);
	}
    ramTimer.ticking=true;
};

startButton.onMouseUp = function () {
	this.opacity = 255;
};

prefs.onMouseDown = function () {
	prefs.src = "Resources/images/prefs02.png";
};


prefs.onMouseUp = function () {
	prefs.src = "Resources/images/prefs01.png";
	if (preferences.soundPref.value !== "disabled") {
		play(winding, false);
	}
	showWidgetPreferences();
};

helpButton.onMouseDown = function () {
	helpButton.opacity = 255;
};

helpButton.onMouseUp = function () {
	helpButton.opacity = 1;
        tankHelpShow();
};

tankHelp.onMouseDown = function () {
	helpWindow.visible = false;
	if (preferences.soundPref.value !== "disabled") {
		play(ting, false);
	}
};

function tankHelpShow() {
	helpWindow.visible = true;
	if (preferences.soundPref.value !== "disabled") {
		play(till, false);
	}
}

stopButton.onMouseDown = function () {
	this.opacity = 10;
    ramTimer.ticking=false;
    rotateObject(secondHand, (0) +30);
  	rotateObject(secondShadow, (0) +30);	
};

stopButton.onMouseUp = function () {
	this.opacity = 255;
};


//the following function needs to operate on both the background and background2 faces, as the ctrl event can only be caught by the
//onMouseWheel itself on one object the event cannot be referred to by the key click on another object. The function would have to be duplicated
//for the background and background2 objects. Instead I have made the background object opacity to 1 so it seems as if it is not
//visible but it still responds to keyclicks and mousewheel movements even when supposedly 'invisible' - see the showFace function.

background.onMouseWheel = function (event) {
	var size = Number(preferences.clockSize.value),
		maxLength = Number(preferences.clockSize.maxLength),
		minLength = Number(preferences.clockSize.minLength),
		ticks = Number(preferences.clockSize.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));

	if (event.ctrlKey) {
		if (event.scrollDelta > 0) {
			if (preferences.MouseWheelPref.value === "up") {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			} else {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			}
		} else if (event.scrollDelta < 0) {
			if (preferences.MouseWheelPref.value === "up") {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			} else {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			}
		}
		preferences.clockSize.value = String(size);
		sizeClock();
	}
};
//=====================
//End function
//=====================



//=================================
// widget inline button timer setup
//=================================
var ramTimer = new Timer();
ramTimer.ticking = true;
ramTimer.interval = preferences.sampleIntervalPref.value;
//=================================
// timer ends
//=================================


//=================================
// timer to fade the buttons
//=================================
ramTimer.onTimerFired = function () {
            ramTimer.interval = preferences.sampleIntervalPref.value;
            updateRAM();
};
//=====================
//End function
//=====================


//===============================================================
// this function is called when the widget loads
//===============================================================
widget.onload = function() {
    startup();
};
//=====================
//End function
//=====================


//===============================================================
// this function is called when the widget prefs are changed
//===============================================================
widget.onPreferencesChanged = function() {
        changePrefs();
        startup();
};
//=====================
//End function
//=====================


//===============================================================
// this function is called when the widget prefs are changed
//===============================================================
widget.onWakeFromSleep = function() {
        updateRAM();
};
//=====================
//End function
//=====================



//===============================================================
// this function defines the keyboard events captured
//===============================================================
mainWindow.onKeyDown = function(event) {
                if (system.event.keyCode==116) {
                    print("pressing "+system.event.keyCode);
                    reloadWidget();
                }
   };
//=====================
//End function
//=====================



//===============================================================
// this function fires the main event on a double click
//===============================================================
background.onMultiClick = function(event) {
	if (preferences.soundPref.value !== "disabled") {
		play(ting, false);
	}
	
	if (event.ctrlKey) {
        print("updating the display");
        updateRAM();
    } else {
        if (preferences.imageCmdPref.value === "" && system.platform === "macintosh") {
        	preferences.imageCmdPref.value = "/Applications/Utilities/Activity Monitor.app";
        }
        if (preferences.imageCmdPref.value === "" && system.platform === "windows") {
        	preferences.imageCmdPref.value = "%SystemRoot%/system32/perfmon.exe";
        }
    	performCommand("click");
    }
};
//=====================
//End function
//=====================

//======================================================================================
// Function to make text areas visible rather than text objects
//======================================================================================
function setTextAreas() {
    if (system.platform === "macintosh") {
        ramMaxTextArea.visible = true;
        ramAveTextArea.visible = true;
    } else {
        ramMaxText.visible = true;
        ramAveText.visible = true;
    }
}
//=====================
//End function
//=====================

//=====================
//End script.js
//=====================

