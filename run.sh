#! /bin/bash

action=$1
picoTtyPath=$2

actionMap=("typegen" "build-mobile" "start-mobile" "bundle-mobile" "build-mcu" "flash-mcu" "shell-mcu", "start-mcu")
actionArgs=("" "" "" "" "" "[tty-path]" "[tty-path]" "[tty-path]")

if [ -z "$action" ]; then
  echo "No action provided"
  # print actionMap items to new line
  for x in "${!actionMap[@]}"; do
    echo "  > run ${actionMap[$x]} ${actionArgs[$x]}"
  done
  exit 1
fi

typegen() {
  echo "Generating types..."
  npm run typegen
}

buildMobileApp() {
  echo "Building mobile app..."
  npm run build:app
}

startMobileApp() {
  echo "Starting mobile app..."
  npm run start:app
}

bundleMobileApp() {
  echo "Bundling mobile app..."
  npm run bundle:app
}

buildMcuFirmware() {
  echo "Building MCU firmware..."
  typegen
  npm run build:mcu
}

flashMcuFirmware() {
  echo "Starting MCU firmware..."
  npm run flash:mcu -- -p $picoTtyPath
}

shellMcuFirmware() {
  echo "Connecting to MCU firmware..."
  npm run shell:mcu -- -p $picoTtyPath
}

startMcuFirmware() {
  buildMcuFirmware
  flashMcuFirmware
  shellMcuFirmware
}

if [ "$action" == "build-mobile" ]; then
  buildMobileApp
elif [ "$action" == "start-mobile" ]; then
  startMobileApp
elif [ "$action" == "bundle-mobile" ]; then
  bundleMobileApp
elif [ "$action" == "build-mcu" ]; then
  buildMcuFirmware
elif [ "$action" == "start-mcu" ]; then
  startMcuFirmware
elif [ "$action" == "flash-mcu" ]; then
  flashMcuFirmware
elif [ "$action" == "shell-mcu" ]; then
  shellMcuFirmware
elif [ "$action" == "typegen" ]; then
  typegen
else
  echo "Invalid action"
  echo "Valid actions: ${actionMap[@]}"
  exit 1
fi
