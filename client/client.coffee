WS_URL = process.env.PILED_SERVER_URL
CIRCLE_CI_PROJECT = process.env.CIRLCE_CI_PROJECT

cs      = require 'coffee-script'

io      = require 'socket.io-client'
socket  = io WS_URL

rgbColor       = require './rgbcolor'
ledController  = require './led-controller'

socket.on 'connection', ->
  console.log 'connected'

socket.on 'power', (data) ->
  power = data == 'on'
  console.log "Turning power #{power ? 'ON' : 'OFF'}"
  ledController.setPower(power)

socket.on 'transition', (data) ->
  ledController.transition(normalizeColors(data.color), data.timeMs)

socket.on 'color', (data) ->
  rgb = normalizeColors(data)
  ledController.setColor(rgb) if rgb

if CIRCLE_CI_PROJECT
  socket.on CIRCLE_CI_PROJECT, (data) ->
    rgb = normalizeColors(data)
    if rgb
      ledController.setColor(rgb)
      ledController.flash(5000)

normalizeColors = (colors) ->
  if typeof colors is 'string'
    rgb = rgbColor.new colors
    console.log "Error parsing color. Data: #{colors}" unless rgb.ok
    rgb
  else if rgb.r and rgb.b and rgb.g
    rgb
  else
    {r: 0, g: 0, b: 0}
