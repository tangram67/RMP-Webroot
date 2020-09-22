/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Reconnecting Websocket based on jQuery
 *
 * 2020/08/09 D. Brinkmeier info@dbrinkmeier.de
 *  - Added onconnect amd ondisconnect events
 *  - Implemented automatic reconnect
 *  - Looks like there is no save way to close and reconnect
 *    websockets on mobile and tablets after standby
 *    --> Websockets disabled on such devices by default!!!
 *    --> Fallback needed when no socket connected anyway....
 *
 * Usage: 
 * var webSocket = $.simpleWebSocket({ 
 *    url: socket, 
 *    onmessage: function(), 
 *    onconnect: function(), 
 *    ondisconnect: function()
 * });
 *
 */
(function (factory) {
	if ('object' === typeof module && typeof 'object' === module.exports) {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
}(function($) {

	var SimpleWebSocket = function(options) {
		if (this.isEmpty(options, 'url')) {
			throw new Error('Missing argument, example usage: $.simpleWebSocket({ url: "socket://127.0.0.1:3000" }); ');
		}

		this.options = options;
		this.socket = null;
		this.connectTries = 0;
		this.connectAttempts = this.getValue(options, 'connectAttempts', 0); // 0 = No limit by default
		this.connectDelay = this.getValue(options, 'connectDelay', 1000);    // Default 1 sec
		this.heardbeatDelay = this.getValue(options, 'heardbeatDelay', 0);   // 0 = No heardbeat by default, use connection delay to reconnect
		this.webSocketsEnabled = this.getValue(options, 'webSocketsEnabled', true);
		this.useWebSocketsOnMobileDevices = this.getValue(options, 'useWebSocketsOnMobileDevices', false);
		this.isReconnecting = false;
		this.isConnecting = false;
		this.isWaiting = false;
		this.waitForAck = false;
		this.debugOutput = false;
		this.dataType = this.getValue(options, 'dataType', 'json');

		var self = this;
		this.api = (function() {
			return {
				connect: function() {
					if (self.debugOutput) console.log('[websocket.js] api.connect()');
					self.reconnect();
				},

				isConnected: function() {
					if (self.debugOutput) console.log('[websocket.js] api.isConnected()');
					return self.isConnected.apply(self, []);
				},

				send: function(data) {
					if (self.debugOutput) console.log('[websocket.js] api.send()');
					self.send(data);
				},

				close: function() {
					self.close();
					self.reset();
					if (self.debugOutput) console.log('[websocket.js] api.close()');
				}
			};
		})();

		// Initialize socket connect
		if (this.webSocketsEnabled && !this.useWebSocketsOnMobileDevices) {
			if (this.isMobileAndTabletPlatform()) {
				// Do not create socket on mobile devices and tablets
				this.webSocketsEnabled = false;
				console.log('[websocket.js] Websocket disabled on mobile devies.');
			}
		}
		if (this.webSocketsEnabled) {
			this.api.connect();
		}

		return this.api;
	};

	SimpleWebSocket.prototype = {

		createWebSocket: function(options) {
			var socket = null;
			if (this.options.protocols) {
				if ('undefined' === typeof window.MozWebSocket) {
					if (window.WebSocket) {
						socket = new WebSocket(this.options.url, this.options.protocols); 
					} else {
						throw new Error('[websocket.js] Error: window.WebSocket could not be initialized for protocol "' + this.options.protocols + '"');
					}
				} else {
					socket = new MozWebSocket(this.options.url, this.options.protocols); 
				}
			} else {
				if ('undefined' === typeof window.MozWebSocket) {
					if (window.WebSocket) {
						socket =  new WebSocket(this.options.url);
					} else {
						throw new Error('[websocket.js] Error: window.WebSocket could not be initialized.');
					}
				} else {
					socket = new MozWebSocket(this.options.url); 
				}
			}
			if (!socket) {
				throw new Error('[websocket.js] WebSocket could not be initialized.');
			}
			if (this.debugOutput) console.log('[websocket.js] createWebSocket()');
			return socket;
		},

		bindSocketEvents: function(socket, options) {
			var self = this;
			$(socket).bind('open', function(event) {
				if ('function' === typeof options.open) {
					options.open.call(this, event);
				}
			}).bind('close', function(event) {
				if ('function' === typeof options.close) {
					options.close.call(this, event);
				}
			}).bind('message', function(event) {
				try {
					if ('function' === typeof options.message) {
						if (self.dataType && 'json' === self.dataType.toLowerCase()) {
							var json = JSON.parse(event.originalEvent.data);
							var goon = true;

							// Parse JSON data for heardbeat messages
							// --> Using other data types than JSON prevents using heardbeat!
							if (!!json.websocket) {
								if (json.websocket === 'connect') {
									// Store heardbeat delay in parameter value
									self.heardbeatDelay = json.delay;
									self.doHeardbeatCheck();
									goon = false;
							   		console.log('[websocket.js] ' + self.timestamp() + ' Websocket connect from <' + json.host + '> socket = ' + json.handle.toString() + ' delay = ' + self.heardbeatDelay.toString() + ' ms');
								}
								if (json.websocket === 'ping') {
									// Socket connection working
									// --> Acknowledge request received via "Ping"
									self.waitForAck = false;
									goon = false;
							   		if (self.debugOutput) console.log('[websocket.js] ' + json.date + ' Websocket ping received from <' + json.host + '>');
								}
							}

							// Forward JSON data to application
							if (goon) {
								options.message.call(this, json);
							}

						} else if (self.dataType && 'xml' === self.dataType.toLowerCase()) {
							var domParser = new DOMParser();
							var dom = domParser.parseFromString(event.originalEvent.data, 'text/xml');
							options.message.call(this, dom);
						} else {
							options.message.call(this, event.originalEvent.data);
						}
					}
				} catch (exception) {
					if ('function' === typeof options.error) {
						options.error.call(this, exception);
					}
				}
			}).bind('error', function(exception) {
				if ('function' === typeof options.error) {
					options.error.call(this, exception);
				}
			});
			if (this.debugOutput) console.log('[websocket.js] bindSocketEvents()');
		},

		initialize: function(options) {
			var socket = this.createWebSocket(options);
			this.bindSocketEvents(socket, options);

			if (this.debugOutput) console.log('[websocket.js] initialize()');
			return socket;
		},

		getSocketEventHandler: function() {
			if (this.debugOutput) console.log('[websocket.js] getSocketEventHandler::function()');
			var self = this;            
			return {
				open: function(e) {
					self.isReconnecting = false;
					self.waitForAck = false;
					self.reset();
					if (!!self.options.onconnect) {
						self.options.onconnect(e);
					}
					if (self.debugOutput) console.log('[websocket.js] getSocketEventHandler::open()');
				},
				close: function(e) {
					if (!!self.options.ondisconnect && !self.isReconnecting) {
						self.options.ondisconnect(e);
					}
					switch (e.code){
						case 1000:
							// Normally closed
							console.log("[websocket.js] Normally closed.");
							break;
						default:
							// Abnormal closure
							// --> Start reconnect action...
							console.log("[websocket.js] Abnormal socket close event (" + e.code.toString() + ')');
							self.reconnect();
							break;
					}
					if (self.debugOutput) console.log('[websocket.js] getSocketEventHandler::close()');
				},
				message: function(message) {
					if (!!self.options.onmessage) {
						self.options.onmessage(message);
					}
					if (self.debugOutput) console.log('[websocket.js] getSocketEventHandler::message()');
				},
				error: function(e) {
					if (e.code === 'ECONNREFUSED') {
						if (!self.isReconnecting) {
							self.reconnect();
						}
					}
					if (self.debugOutput) console.log('[websocket.js] getSocketEventHandler::error() Error <' + e + ')');
				}
			};
		},

		connect: function() {
			if (!!this.socket) {
				// Close existing socket object
				if (this.debugOutput) console.log('[websocket.js] connect() Close socket, current state = ' + this.stateToStr());
				this.close();
			}

			// Create new socket connection
			this.socket = this.initialize($.extend(this.options, this.getSocketEventHandler()));

			if (this.debugOutput) console.log('[websocket.js] connect()');
			return this.socket;
		},

		stateToStr: function() {
			var state = 'Unknown';
			if (!!this.socket) {
				switch (this.socket.readyState) {
					case 0 : state = 'Connecting (0)'; break;
					case 1 : state = 'Open (1)'; break;
					case 2 : state = 'Closing (2)'; break;
					case 3 : state = 'Closed (3)'; break;
					default : state = 'Invalid (' + this.socket.readyState.toString() + ')'; break;
				}
			} else {
				state = 'Unassigned';
			}
			return state;
		},

		reset: function() {
			this.connectTries = 0;
			this.connectAttempts = this.getValue(this.options, 'attempts', 0); // No limit by default
			this.connectDelay = this.getValue(this.options, 'delay', 1000); // Default 1 sec
			if (this.debugOutput) console.log('[websocket.js] reset()');
		},

		close: function() {
			if (!!this.socket) {
				this.socket.close();
				this.socket = null;
			}
			if (this.debugOutput) console.log('[websocket.js] close()');
		},

		isConnected: function() {
			if (!!this.socket) {
				if (1 === this.socket.readyState) {
					this.isReconnecting = false;
					return true;
				}
			}
			if (this.debugOutput) console.log('[websocket.js] isConnected()');
			return false;
		},

		doReconnect: function() {
			if (this.isConnecting || this.isWaiting)
				return;

			var self = this;
			if (!self.isConnected()) {
				if (self.debugOutput) console.log('[websocket.js] doReconnect()');

				// Create new socket connection
				self.connect();
				self.connectTries++;

				// Select timer or heardbeat reconnect mode...
		   		if (self.debugOutput) console.log('[websocket.js] doReconnect() Heardbeat delay = ' + self.heardbeatDelay.toString() + ' ms');
				if (self.heardbeatDelay <= 0) {

					// Set retry interval to max. 1 min, increase every retry by given delay
					var delay = this.connectTries > 6 ? 6 * self.connectDelay : self.connectTries * self.connectDelay
					if (self.connectAttempts == 0 || self.connectTries < self.connectAttempts) {
						self.isConnecting = true;
						if (self.debugOutput) console.log('[websocket.js] ' + self.timestamp() + ' Do reconnect websocket, delay = ' + delay.toString() + ' ms');
						window.setTimeout(function() {
							self.isConnecting = false;
							if (self.heardbeatDelay <= 0) {
								self.reconnect();
							}
						}, self.getValue.apply(self, [self.options, 'timeout', delay]));
					}
				} else {
					self.doHeardbeatCheck();
				}

			} else {
				self.isReconnecting = false;
			}
		},

		reconnect: function() {
			if (this.webSocketsEnabled && !this.isConnected()) {
				if (this.debugOutput) console.log('[websocket.js] reconnect()');
				this.doReconnect();
				console.log('[websocket.js] ' + this.timestamp() + ' Try reconnect websocket...');
			}
		},

		doHeardbeatCheck: function() {
			if (this.isConnecting || this.isWaiting)
				return;

			var self = this;
			if (self.debugOutput) console.log('[websocket.js] Execute heardbeat check, delay = ' + self.heardbeatDelay.toString() + ' ms');
			if (self.heardbeatDelay > 0) {
				if (!self.isConnected()) {
					if (self.debugOutput) console.log('[websocket.js] Start heardbeat check...');
					self.isWaiting = true;
					self.waitForAck = true;
					
					// Window to receive acnowlegde must be larger that heardbeat timeframe
					var delay = self.heardbeatDelay + (self.heardbeatDelay / 10);
					if (self.debugOutput) console.log('[websocket.js] ' + this.timestamp() + ' Do heardbeat check, delay = ' + delay.toString() + ' ms');
					window.setTimeout(function() {
						self.isWaiting = false;

						// Check for heardbeat...
						if (self.waitForAck) {
							// No acknowledge/heardbeat/ping received
							// --> Connection must be regarded as dead
							// --> force reconnect action!
							if (self.debugOutput) console.log('[websocket.js] ' + self.timestamp() + ' No heardbeat received, start reconnect...');
							self.doReconnect();
						} else {
							// Restart heardbeat check
							if (self.debugOutput) console.log('[websocket.js] ' + self.timestamp() + ' Valid heardbeat received.');
							self.doHeardbeatCheck();
						}

					}, delay);
				} else {
					self.waitForAck = false;
				}
			}
		},

		timestamp: function() {
			var time = new Date();
			var times = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
			return time.toLocaleTimeString('de-DE', times);
		},

		preparePayload: function(data) {
			var payload;
			if (this.options.dataType && 'text' === this.options.dataType.toLowerCase()) {
				// Raw text data                
				payload = data;
			} else if (this.options.dataType && 'xml' === this.options.dataType.toLowerCase()) {
				// XML data as text by default
				payload = data;
			} else {
				// JSON as string
				payload = JSON.stringify(data);
			}
			if (this.debugOutput) console.log('[websocket.js] preparePayload()');
			return payload;
		},

		send: function(data) {
			if (this.isConnected()) {
				this.socket.send(this.preparePayload(data));
				if (this.debugOutput) console.log('[websocket.js] send()');
				return true;
			} else {
				if (this.webSocketsEnabled) {
					console.log('[websocket.js] send() failed: Socket not connected, trying to reconnect...');
					this.reconnect();
				} else {
					console.log('[websocket.js] send() failed: Websockets disabled.');
				}
			}
			return false;
		},

		isMobileAndTabletPlatform: function() {
			var check = false;
			(function(a) {
				if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
					check = true;
				}
			})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		},

		isEmpty: function(obj, property) {
			if (typeof 'undefined' === obj) {
				return true;
			} else if (null === obj) {
				return true;
			} else if ('undefined' === typeof property) {
				return true;
			} else if (null === property) {
				return true;
			} else if ('' === property) {
				return true;
			} else if ('undefined' === typeof obj[property]) {
				return true;
			} else if (null === obj[property]) {
				return true;
			} 
			return false;
		},

		getValue: function(obj, property, defaultValue) {
			if (this.isEmpty(obj, property)) {
				return defaultValue;
			}
			return obj[property];
		}

	};

	$.extend({
		simpleWebSocket: function(options) {
			return new SimpleWebSocket(options);
		}
	});

	return $.simpleWebSocket;
}));

