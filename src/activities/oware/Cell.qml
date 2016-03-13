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
import QtQuick 2.0
import "oware.js" as Activity

import GCompris 1.0
Item {
    id: cell
    property int numberOfSeeds
    property alias repeater: repeater
    property alias fade: fade

    MouseArea {
        id: area
        anchors.fill: parent
        onClicked: { Activity.onClick(parent) }
        hoverEnabled: true
    }

        Repeater {
            id: repeater
            model: Array.apply(null, new Array(numberOfSeeds)).map(function (_, i) { return i})
            delegate: Image {
                source: Activity.url + "seed2.svg"
                width: cell.width
                height: width
                id: seed
                x: (modelData % 3 + Math.random() / 3) * cell.width / 4 //TODO: random should not be called every time we update the model
                y: Math.floor(modelData / 3) * cell.width / 4
                property alias appear: appear
                property alias disappear: disappear
                NumberAnimation on opacity {
                    id: appear
                    duration: 400
                    to: 1.0
                    running: false
                }
                NumberAnimation on opacity {
                    id: disappear
                    duration: 400
                    to: 0.0
                    running: false
                    onStopped: numberOfSeeds--
                }
            }
        }

    NumberAnimation on opacity {
        id: fade
        duration: 500
        to: 0.0
        onStopped: numberOfSeeds = 0
        running: false
    }
}
