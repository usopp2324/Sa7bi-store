#NoEnv
#Persistent
#SingleInstance Force
SetBatchLines -1
SetKeyDelay -1
SetMouseDelay -1
SetDefaultMouseSpeed 0
SetWinDelay -1
SetControlDelay, -1
SendMode Input
CoordMode Pixel, Screen

; ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
;                     SETTINGS
; ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TriggerKey       := "XButton1"      ; hold this to allow trigger
TriggerKey2      := "XButton2"      ; hold this to allow trigger

Hotkey F1, ToggleHoldMode
Hotkey F2, SprayMode
Hotkey F3, CrouchMode
Hotkey End, ExitScript

HoldMode        := True
Color            := 0xFFFF00         ;Yellow=0xFFFF00 Purple=0xAA00FF
Variation        := 95

MinClickDelay    := 0
MaxClickDelay    := 0
ExtraSleepAfter  := 200
RandomExtraSleep := true

BoxSize          := 1
ScanLeft         := A_ScreenWidth//2 - BoxSize
ScanRight        := A_ScreenWidth//2 + BoxSize
ScanTop          := A_ScreenHeight//2 - BoxSize - 18
ScanBottom       := A_ScreenHeight//2 + BoxSize

; ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Menu Tray, NoStandard
Menu Tray, Add, Restart Script, Restart
Menu Tray, Add, Exit, ExitScript

SetTimer, CheckTrigger, 1
return

Crouch() { 
    SendInput, {SHIFT Down} 
}
CrouchRelease() {
    SendInput, {SHIFT Up} 
}

ToggleHoldMode:
    HoldMode := !HoldMode
    ToolTip % HoldMode ? "HOLD MODE" : "ALWAYS ON MODE", 0, 0
    SetTimer RemoveTT, -1800
return

SprayMode:
    ; If crouch is on, toggle it off first (prevents infinite loop)
    if (letscrouch) {
        letscrouch := false
        ToolTip CROUCH SPRAY OFF, 0, 36
        SetTimer RemoveTT, -1800
    }

    spray := !spray
    ToolTip % spray ? "SPRAY MODE ON" : "SPRAY MODE OFF", 0, 18

    if (!letscrouch) {
        Sleep, 600
    }
    SetTimer RemoveTT, -1800
return


CrouchMode:
    ; If spray is on, toggle it off first (prevents infinite loop)
    if (spray) {
        spray := false
        ToolTip SPRAY MODE OFF, 0, 18
        SetTimer RemoveTT, -1800
    }

    letscrouch := !letscrouch
    ToolTip % letscrouch ? "CROUCH SPRAY ON" : "CROUCH SPRAY OFF", 0, 36

    if (!spray) {
        Sleep, 600
    }
    SetTimer RemoveTT, -1800
return

RemoveTT:
    ToolTip
return

ExitScript:
    ExitApp
return

Restart:
    Sleep 180
    Reload
return


CheckTrigger:
    While GetKeyState(TriggerKey, "P") or GetKeyState(TriggerKey2, "P") {
        Shoot()
    }
return


Shoot() {
    global
    PixelSearch px, py, ScanLeft, ScanTop, ScanRight, ScanBottom, %Color%, %Variation%, Fast RGB
    if (ErrorLevel = 0) {
    If !GetKeyState("LButton") {
    Random delay, %MinClickDelay%, %MaxClickDelay%
    Sleep %delay%
        ; ─── Simulated mouse click ────────────────────────
        PostMessage, 0x201, 0x00000001, 0x01f0010f, , VALORANT
        
        if (spray) {
            Sleep % 100 + Random(40, 120)
        }

        if (!letscrouch) {
            Sleep % 30 + Random(0, 16)
        } else {
            Crouch()
            Sleep % 100 + Random(40, 120)
            CrouchRelease()
        }

        PostMessage, 0x202, 0x00000001, 0x01f0010f, , VALORANT
        
        ; Post-shot humanization delay
        Random extra, 60, 140
        if (RandomExtraSleep)
            extra += Random(-30, 50)
    Sleep % extra + ExtraSleepAfter
    }
}
return
}

Random(min, max) {
    Random val, min, max
    return val
}