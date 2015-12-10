# piled
piled - A web LED controller and client for Raspberry Pi

Written with Node.js

# Installation
## Server
The web component is heroku-ready. The Procfile is suitable for use with [foreman](https://github.com/ddollar/foreman) or [node-foreman](https://github.com/strongloop/node-foreman).
Run locally with
```
node index.js
```

## Client
### Prepare the Pi
SSH to your Pi, update apt-get, install pi-blaster daemon, install autoconf git, node, and npm, and clone piled repo
```
ssh pi@<ip-of-raspberry-pi>
sudo apt-get update
sudo apt-get install autoconf

wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
sudo dpkg -i node_latest_armhf.deb

git clone https://github.com/sarfata/pi-blaster
cd pi-blaster

./autogen.sh
./configure
make

sudo make install

git clone https://github.com/sleighter/piled.git
cd piled/client
```
### Install dependencies
```
## raspberry pi doesn't play nice with https, use insecure registry
npm config set registry http://registry.npmjs.org

npm install
```

### Run it - Quick start
```
## Default GPIO PIN map
## RED_PIN   = 18
## GREEN_PIN = 17
## BLUE_PIN  = 19
## pass the server url as a environment variable
PILED_SERVER_URL=ws://<hostname-of-piled-server> node client.js
```

### Run it - Recommended
To set the client to run at start-up, check out [node-startup](https://github.com/chovy/node-startup) for a nicely written init.d script for node apps.

## Usage
#### Turn on (uses last color or white if first run)
```
curl -X POST http://<hostname-of-piled-server>/on
```
#### Set color
```
# Set color using css color names
curl -H "Content-Type: application/json" -d '{"color":"teal"}' http://<hostname-of-piled-server>/color
# Or hex codes
curl -H "Content-Type: application/json" -d '{"color":"#00FFFF"}' http://<hostname-of-piled-server>/color
# Or an RGB object
curl -H "Content-Type: application/json" -d '{"color":{"r":0, "g": 255, "b": 255}}' http://<hostname-of-piled-server>/color
```
#### Turn off
```
curl -X POST http://<hostname-of-piled-server>/off
```


# Hardware
The Pi's GPIO cannot directly power leds, a driver board is required. [This Adafruit tutorial](https://learn.adafruit.com/rgb-led-strips/usage) provides a good basic design for powering led strip lights.


# Alternative - Using pre-build LED strip controllers
If building a driver board isn't your thing, or you'd like to make more than a few controlled strips, it's possible to use the mass-produced IR-controlled LED drivers included in many Amazon packages. It is far faster and usually cheaper to buy these units than to build your own drivers. See [RGB Strip Controller/Driver](http://www.amazon.com/SUPERNIGHT-TM-Remote-Controller-Light/dp/B00AF5YOK2/ref=sr_1_1?ie=UTF8&qid=1425274459&sr=8-1&keywords=rgb+led+strip+controller). To this end, I have also included a controller module to permit direct control of these units using the IR control input.

The downside is that we are limited by the control set provided by the driver unit. The available controls roughly map to the keys of the included 44-key remote. The fine-grained and parallel control afforded by directly controlling each channel is not available here. Instead, we must control lights as we would with the remote: by choosing preset colors, or individually adjusting the brightness of each channel in large stops. Transitions are therefore less smooth and selection of non-preset colors less reliable.

Since this is a solder-less solution, we will not be opening up the driver unit, nor will we be transmitting IR signals to it. Instead, we will directly wire the RPi to the unit's IR input and simulate IR signals on the wire. We will use lirc-rpi, an IR driver, to produce the signal outputs.

First, cut off the existing IR receiver, making note of the connector wire orientation. With the receiver facing you, the wires are, from left to right: Signal, Ground, Vcc(+5v). Ground and Vcc connect to a Ground and +5v pin of the RPi. Unfortunately, the +5v output from the driver unit is not sufficient to power the RPi, so we will still need two power supplies. One for the driver unit and one for the RPi. Finally wire the signal line to a GPIO pin. Here I chose GPIO 21.

Second, install and configure lirc-rpi. See [Setting Up lirc on the Raspberry Pi](http://alexba.in/blog/2013/01/06/setting-up-lirc-on-the-raspberrypi/). We must disable the softcarrier, as this will transmit our signals on a carrier frequency. If you'd like to capture the IR signals yourself, see the note below. For ease, if using the SUPERNIGHT or clone driver unit, you can use the included config file, shared by Raudi [here](http://forum.osmc.tv/showthread.php?tid=7142)

Note that lirc-rpi includes some awesome utilities for recording signals to create your own IR config files. With a basic breadboard and some lead wires, you can use the IR receiver cut from the driver unit to create an IR input for the RPi. In the example above, you'll note that I configured an input on GPIO pin 20. To use the IR receiver as an input, wire the signal lead to pin 20, and the GND and Vcc leads to the matching pins on the RPi. Review the manual for the `irrecord` command for more information on capturing IR signals for any remote.

# Other Components
[*rgbcolor.js*](http://www.phpied.com/rgb-color-parser-in-javascript/) - Converts css colors and hex codes to easy-to-use `{r:0, g:0, b:0}` objects. - Converted to a node module and included in this repo.

[*pi-blaster.js*](https://github.com/sarfata/pi-blaster) - Adds PWM to all the Pi's GPIO, allowing us to vary LED intensity

[*transition.js*](http://akinuri.com/exps/color-transition/) - Algorithms for smooth color transitions

[*lirc*](http://www.lirc.org) and [*lirc-rpi*](http://aron.ws/projects/lirc_rpi/)
