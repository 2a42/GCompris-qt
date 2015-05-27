/* GCompris - Chronos.qml
 *
 * Copyright (C) 2015 Pulkit Gupta
 *
 * Authors:
 *   José Jorge <jjorge@free.fr> (GTK+ version)
 *   Pulkit Gupta <pulkitgenius@gmail.com> (Qt Quick port)
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

import "../babymatch"

Babymatch {
    id: activity

    onStart: focus = true
    onStop: {}

    url: "qrc:/gcompris/src/activities/chronos/resource/"
    levelCount: 4
    subLevelCount: 2
}