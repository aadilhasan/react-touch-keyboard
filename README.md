React virtual keyboard for touch devices.
It can be used with native input/text-area element, without touching the existing code.
[Click here to see it in action](https://codesandbox.io/s/winter-resonance-wrh5v)

### install

```sh
$ npm i react-touch-device-keyboard --save
```

### use

```sh
import Keyboard from "react-touch-device-keyboard"

<Keyboard mountAt={document.getElementById("keyboard-container")}/>
```

### APIS

| API             | Type              | Description                                                                                  |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------- |
| mountAt         | `dom element`     | dom element where the keyboard should mount                                                  |
| marginFromInput | `number`          | margin top in px, from the focused input element (default 10px)                              |
| alwaysOpen      | `boolean`         | if true keyboard will be alway open (default false)                                          |
| width           | `number`          | width of keyboard (defualt 900), this won't work if fullScreen is true                       |
| fullScreen      | `boolean`         | if true, keyboard will take full width of the window                                         |
| focusNextOnTab  | boolean           | if true, on press of tab focus will go to next focusable element                             |
| disabled        | `array[<string>]` | array of keys which should be disabled (key name should be in lowecase eg. - `['tab', 'a']`) |
| stickToBottom   | `boolean`         | if true keyboard will alway be in bottom of the page                                         |
| onKeyPress      | `function`        | receives character pressed in keyboard as argument                                           |

There are some life hooks also if needed -

`beforeOpen` - gets triggered every time focus changes
`afterOpen` - gets triggered every time focus changes
`beforeClose`, `afterClose`
