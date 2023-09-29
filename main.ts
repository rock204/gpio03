function taiki () {
    basic.pause(randint(1000, 5000))
    mode = 3
    st_time = input.runningTime()
    pins.digitalWritePin(DigitalPin.P0, 1)
}
function get_rt () {
    if (pins.digitalReadPin(DigitalPin.P1) == 1) {
        if (mode == 3) {
            mode = 4
            rt = (input.runningTime() - st_time) / 1000
            pins.digitalWritePin(DigitalPin.P0, 0)
            basic.showNumber(rt)
            rt_data.push(rt)
            kaisuu += 1
            datalogger.log(datalogger.createCV("RT", rt))
            if (kaisuu == n) {
                mode = 999
                print_result()
            } else {
                while (pins.digitalReadPin(DigitalPin.P1) == 1) {
                	
                }
                mode = 1
            }
        }
    }
}
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Square)
    mode = 1
    rt_data = []
    kaisuu = 0
    datalogger.deleteLog(datalogger.DeleteType.Full)
    basic.pause(500)
    basic.clearScreen()
})
function print_result () {
    serial.writeLine("-----result------")
    for (let カウンター = 0; カウンター <= n - 1; カウンター++) {
        serial.writeNumber(カウンター + 1)
        serial.writeValue("  ", rt_data[カウンター])
    }
    serial.writeLine("----------------")
    avrage = BasicStat.calculateMean(rt_data)
    basic.showNumber(avrage)
    serial.writeValue("average", avrage)
    serial.writeValue("std    ", BasicStat.calculateES(rt_data))
}
input.onButtonPressed(Button.B, function () {
    basic.showNumber(avrage)
})
function junbi () {
    basic.pause(1000)
    pins.digitalWritePin(DigitalPin.P0, 0)
    mode = 2
}
let avrage = 0
let kaisuu = 0
let rt_data: number[] = []
let rt = 0
let st_time = 0
let n = 0
let mode = 0
basic.showString("RT02")
mode = 999
pins.setPull(DigitalPin.P1, PinPullMode.PullDown)
n = 10
serial.writeLine("(Pro RT02)")
datalogger.mirrorToSerial(false)
datalogger.setColumnTitles("RT")
basic.forever(function () {
    if (mode != 999) {
        if (mode == 1) {
            junbi()
        }
        if (mode == 2) {
            taiki()
        }
        get_rt()
    }
})
