/**
 * Copyright (c) 2010 Aurélien Chabot
 * Licensed under the GNU General Public License v3, read LICENSE
 *
 * This file is part of Gtalk & Facebook Chat Extension.
 *
 * "Gtalk & Facebook Chat Extension" is free software: you can redistribute
 * it and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * "Gtalk & Facebook Chat Extension" is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with "Gtalk & Facebook Chat Extention".
 * If not, see <http://www.gnu.org/licenses/>.
 */

/** Javascript file of some log function */


// The possible log levels.
var logLevels = {
	"none": 0,
	"error": 1,
	"info": 2
};
var currentLogLevel = logLevels.info;

function debugMsg(loglevel, text) {
	if (loglevel <= currentLogLevel){
		console.log( "Contact Notifier : " + text);
	}
}
