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
SSH to your Pi, update apt-get, install git, node, and npm, and clone piled repo
```
ssh pi@<ip-of-raspberry-pi>
sudo apt-get update
sudo apt-get install git node npm

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

# Hardware
The Pi's GPIO cannot directly power leds, a driver board is required. [This Adafruit tutorial](https://learn.adafruit.com/rgb-led-strips/usage) provides a good basic design for powering led strip lights.

# Other Components
[*rgbcolor.js*](http://www.phpied.com/rgb-color-parser-in-javascript/) - Converts css colors and hex codes to easy-to-use `{r:0, g:0, b:0}` objects. - Converted to a node module and included in this repo.

[*pi-blaster.js*](https://github.com/sarfata/pi-blaster) - Adds PWM to all the Pi's GPIO, allowing us to vary LED intensity

[*color-transition.js*](http://akinuri.com/exps/color-transition/) - Algorithms for smooth color transitions
