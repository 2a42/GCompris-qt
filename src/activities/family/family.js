/* GCompris - family.js
 *
 * Copyright (C) 2015 RAJDEEP KAUR <rajdeep51994@gmail.com>
 *
 * Authors:
 *   "RAJDEEP KAUR" <rajdeep51994@gmail.com> (Qt Quick port)
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
.pragma library
.import QtQuick 2.0 as Quick
.import "qrc:/gcompris/src/core/core.js" as Core

var currentLevel = 0
var numberOfLevel = 35
var flag
var items
var currentdata
/*
The first three elements of dataset is refer to the circle elements the next three elements refer to the
content of answer button and then 7th element refer to the correct answer then next three element refer to the how we are related to
other people, the contents that will be displayed next to bambo at last we will mention a flag that is either image or text
*/

var dataset = [  [ "man1.svg","girl1.svg","grandmother.svg","Grand Mother","Grand Father","Father","Grand Mother",
                  "?","Father","Mother","image"],

               [ "grandpa.svg","girl2.svg","man1.svg","Grand Mother", "Mother", "Grand Father","Grand Father",
                "Father","?","Son","image"],

               [ "girl3.svg","man1.svg","man2.svg","Uncle","Aunty","father","Uncle","Brother","Daughter","?",
                "image"],

               [ "lady.svg","boy1.svg","lady1.svg","Mother","Aunty","GrandMother","Aunty","Mother","?","Sister",
                "image"],

               [ "lady.svg","boy1.svg","girl2.svg","Brother","Sister","Cousin","Cousin","?","Mother","Niece",
                "image"],

               [ "man1.svg","man2.svg","boy1.svg","Daughter","Son","Newphew","Newphew","Son","Brother","?",
                "image"],

               [ "girl3.svg","man1.svg","man2.svg","Newphew","Niece","Daughter","Niece","Brother","?","Father",
                "image"],

               [ "grandmother.svg","man1.svg","boy1.svg","Grand Son", "Son","Son In Law","Grand Son",
                "Son","Son","?","image"],

               [ "lady.svg","girl1.svg","grandpa.svg","Grand Daughter","Daughter","Daughter In Law","Grand Daughter",
                "?","Mother","Father","image"] ,

               [ "man1.svg","lady1.svg","grandmother.svg","Mother","Mother in law","Aunty","Mother in law",
                "Mother","Husband","?","image"],

               [ "girl2.svg","man2.svg","grandpa.svg","Father", "Father in Law", "Uncle","Father in Law",
                "Father","Wife","?","image"],

               [ "girl3.svg","man1.svg","girl2.svg","Sister","Cousin","Sister in Law","Sister in Law",
                "?","Wife","Sister","image"],

               [ "man2.svg","girl3.svg","man1.svg","Brother","Brother in law","Cousin","Brother in law",
                "?","Husband","Brother","image"],

               [ "man1.svg","boy1.svg","lady1.svg","Mother","Aunty","Step-Mother","Step-Mother",
                "?","Father","Second Wife","image"],

               [ "lady.svg","girl2.svg","man2.svg","Father","Uncle","Step-Father","Step-Father",
                "?","Mother","Second Husband","image"],

               [ "boy2.svg","man1.svg","lady.svg","Son","Step-Son","Newphew","Step-Son",
                "Second Wife","?","Mother","image"],

               [ "lady1.svg","man2.svg","girl2.svg","Step-Daughter","Niece","Daughter","Step-Daughter",
                "Daughter","Second wife","?","image"],

               [ "Father","You","Mother","Grand Mother","Grand Father","Father","Grand Mother",
                "?","","","text"],

               [ "Father","You","Father","Grand Mother","Mother", "Grand Father","Grand Father",
                "?","","","text"],

               [ "You","Son","Brother","Uncle","Aunty","father","Uncle","","","?","text"],

               [ "You","Daughter","Sister","Mother","Aunty","GrandMother","Aunty","","","?",
                "text"],

               [ "Father","You","Newphew","Brother","Sister","Cousin","Cousin","?","","",
                "text"],

               [ "Father","You","Niece","Brother","Sister","Cousin","Cousin","?","","",
                "text"],

               ["Father","You","Cousin","Daughter","Son","Newphew","Newphew","","","?",
                "text"],

               ["Mother","You","Cousin","Son","Niece","Daughter","Niece","","","?",
                "text"],

               ["Son","You","Son","Grand Son", "Son","Son In Law","Grand Son","?","","","text"],

               ["Son","You","Daughter","Grand Daughter","Daughter","Daughter In Law","Grand Daughter",
                "?","","","text"],

               ["Wife","You","Mother","Mother","Mother in law","Aunty","Mother in law",
                "?","","","text"],

               ["husband","You","Father","Father", "Father in Law", "Uncle","Father in Law",
                "?","","","text"],

               ["Wife","You","Brother","Brother","Brother in law","Cousin","Brother in law",
                "?","","","text"],

               ["Wife","You","Sister","Sister","Cousin","Sister in Law","Sister in Law",
                "?","","","text"],

               ["Father","Second\nWife","You", "Mother","Aunty","Step-Mother","Step-Mother",
                "?","","","text"],

               ["Mother","Second\nHusband","You","Father","Uncle","Step-Father","Step-Father",
                "?","","","text"],

               ["Second\nWife","You","Son","Son","Step-Son","Newphew","Step-Son","?","","","text"],

               ["Second\nWife","You","Daughter","Step-Daughter","Niece","Daughter","Step-Daughter",
                "?","","","text"]
    ];

function start(items_) {
    items = items_
    currentLevel = 0

    initLevel()
}

function stop() {
}

function initLevel() {
    items.bar.level = currentLevel + 1
    dataset = Core.shuffle(dataset);
    currentdata = dataset[items.bar.level];
    items.imageOrtext = currentdata[10];
    if(currentdata[10] === "text") {
            items.pic1.source = "qrc:/gcompris/src/activities/family/resource/" + "text_background.svg"
            items.pic1.visible = false
            items.text1.text = qsTr(currentdata[0])
            items.pic2.source = "qrc:/gcompris/src/activities/family/resource/" + "text_background.svg"
            items.pic2.visible = false
            items.text2.text = qsTr(currentdata[1])
            items.pic3.source = "qrc:/gcompris/src/activities/family/resource/" + "text_background.svg"
            items.pic3.visible = false
            items.text3.text = qsTr(currentdata[2])

    }  else {
        items.pic1.source = "qrc:/gcompris/src/activities/family/resource/" + currentdata[0]
        items.pic1.visible = true
        items.pic2.source = "qrc:/gcompris/src/activities/family/resource/" + currentdata[1]
        items.pic2.visible = true
        items.pic3.source = "qrc:/gcompris/src/activities/family/resource/" + currentdata[2]
        items.pic3.visible = true
    }
    items.answered = currentdata[6];
    items.button1.textLabel = qsTr(currentdata[3]);
    items.button2.textLabel = qsTr(currentdata[4]);
    items.button3.textLabel = qsTr(currentdata[5]);
    items.caption1d = currentdata[7]; items.caption2d = currentdata[8]; items.caption3d = currentdata[9];
}

function nextLevel() {
    if(numberOfLevel <= ++currentLevel ) {
        currentLevel = 0
    }
    initLevel();
}

function previousLevel() {
    if(--currentLevel < 0) {
        currentLevel = numberOfLevel - 1
    }
    initLevel();
}
