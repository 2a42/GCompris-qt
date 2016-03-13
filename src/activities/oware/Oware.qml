/* GCompris - oware.qml
 *
 * Copyright (C) 2016 Robin Guzniczak <2a42@openmailbox.org>
 *
 * Authors:
 *   <THE GTK VERSION AUTHOR> (GTK+ version)
 *   Robin Guzniczak <2a42@openmailbox.org> (Qt Quick port)
 *
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation; either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
import QtQuick 2.1
import QtGraphicalEffects 1.0

import "../../core"
import "oware.js" as Activity

import GCompris 1.0

ActivityBase {
    id: activity

    property bool twoPlayer: false
    onStart: focus = true
    onStop: {}

    pageComponent: Image {
        id: background
        anchors.fill: parent
        source: Activity.url + 'background.svg'
        sourceSize.width: parent.width
        fillMode: Image.PreserveAspectCrop
        signal start
        signal stop

        Component.onCompleted: {
            activity.start.connect(start)
            activity.stop.connect(stop)
        }

        // Add here the QML items you need to access in javascript
        QtObject {
            id: items
            property Item main: activity.main

            property alias background: background
            property alias repeater: repeater
            property alias bar: bar
            property alias bonus: bonus
            property alias cells: cells

            property alias info: info

            property alias player1: player1
            property alias player2: player2
        }

        onStart: { Activity.start(items) }
        onStop: { Activity.stop() }

        Timer {
            id: timer
            repeat: true
            interval: 500
            onTriggered: Activity.update()
            running: true
        }

        Image {
            id: board
            source: Activity.url + "board.svg"
            sourceSize.width: Math.min(background.width * 0.8, background.height * 1.2)

            anchors {
                verticalCenter: parent.verticalCenter
                horizontalCenter: parent.horizontalCenter
            }

            ListModel {
                id: cells
            }

            Grid {
                id: grid
                rows: 2
                columns: 6
                anchors {
                    fill: parent
                    left: parent.left
                    top: parent.top
                    topMargin: board.width / 3.5
                    leftMargin: board.width / 10.6
                }

                rowSpacing: board.width / 11
                spacing: board.width / 18.5

                Repeater {
                    id: repeater
                    model: cells
                    delegate: Cell {
                        width: parent.width / 10
                        height: parent.width / 10
                        numberOfSeeds: n
                        state: "contains"
                    }
                }
            }
        }

        DialogHelp {
            id: dialogHelp
            onClose: home()
        }

        Bar {
            id: bar
            content: BarEnumContent { value: help | home | reload | level }
            onHelpClicked: displayDialog(dialogHelp)
            onReloadClicked: Activity.reset()
            onPreviousLevelClicked: Activity.previousLevel()
            onNextLevelClicked: Activity.nextLevel()
            onHomeClicked: activity.home()
        }

        Image {
            id: player1
            source: Activity.url + "score_1.svg"
            sourceSize.height: bar.height * 1.1
            anchors {
                bottom: parent.width > parent.height ? bar.bottom : bar.top
                bottomMargin: 10
                right: parent.right
                rightMargin: 2 * ApplicationInfo.ratio
            }

            GCText {
                id: player1_score
                anchors.verticalCenter: parent.verticalCenter
                x: parent.width / 2 + 5
                color: "white"
                fontSize: largeSize
                text: player1.score.toString()
            }

            property alias brightness: brightnessContrast.brightness
            property alias animation: animation

            property int score: 0

            BrightnessContrast {
                id: brightnessContrast
                source: player1
                anchors.fill: player1
            }

            SequentialAnimation on brightness {
                loops: Animation.Infinite
                id: animation
                NumberAnimation { to: 0.5; duration: 1000 }
                NumberAnimation { to: 0.1; duration: 1000 }
            }
        }

        GCText {
            id: info
            anchors.horizontalCenter: parent.horizontalCenter
            color: "red"
            anchors.bottom: bar.top
            anchors.bottomMargin: 20
            opacity: 0.0

            property alias animation: infoAnim

            SequentialAnimation on opacity {
                id: infoAnim
                running: false
                NumberAnimation { to: 1.0; duration: 500 }
                NumberAnimation { to: 1.0; duration: 1000 }
                NumberAnimation { to: 0.0; duration: 500 }
            }
        }

        Image {
            id: player2
            source: Activity.url + "score_2.svg"
            sourceSize.height: bar.height * 1.1
            anchors {
                top: parent.top
                right: parent.right
                rightMargin: 2 * ApplicationInfo.ratio
            }

            property int score: 0

            GCText {
                id: player2_score
                anchors.verticalCenter: parent.verticalCenter
                color: "white"
                x: parent.width / 2 + 5
                fontSize: largeSize
                text: player2.score.toString()
            }

            states: [
                State {
                    name: "active"

                }
            ]
            property alias brightness: brightnessContrast2.brightness
            property alias animation: animation2

            BrightnessContrast {
                id: brightnessContrast2
                source: player2
                anchors.fill: player2
            }

            SequentialAnimation on brightness {
                loops: Animation.Infinite
                id: animation2
                NumberAnimation { to: 0.5; duration: 1000 }
                NumberAnimation { to: 0.1; duration: 1000 }
            }
        }

        Bonus {
            id: bonus
            Component.onCompleted: win.connect(Activity.nextLevel)
        }
    }

}
