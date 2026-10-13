// Firebase (Auth + Realtime Database) backend for tra.ject.
//
// Exposes the small slice of the old Hoodie API that main.js relies on, so the
// app code barely changes:
//   store.add / update / findAll, account.signUp / signIn / signOut /
//   changePassword / on, remote.on('update' | 'remove'), task.on
//
// Data lives at /users/{uid}/{type}/{id}, e.g. /users/abc/cell/-Nxyz.
// Promises are jQuery deferreds (.done / .fail), as with Hoodie.

function TrajectStore(){
	'use strict';

	firebase.initializeApp(window.TRAJECT_FIREBASE_CONFIG);

	var auth = firebase.auth();
	var db = firebase.database();

	var accountHandlers = {};
	var remoteHandlers = {};
	var cache = {};           // type -> id -> last known normalized object
	var listening = false;
	var listenRef = null;
	var restored = $.Deferred();

	// Angular doesn't know about Firebase callbacks, so ask for a digest.
	function kick(){
		try {
			var inj = angular.element(document.documentElement).injector();
			if (inj) inj.get('$rootScope').$evalAsync(function(){});
		} catch (e) {}
	}

	function emit(handlers, name, arg1, arg2){
		(handlers[name] || []).forEach(function(fn){
			try { fn(arg1, arg2); } catch (e) { console.error(e); }
		});
		kick();
	}

	function on(handlers, name, fn){
		(handlers[name] = handlers[name] || []).push(fn);
	}

	function resolveWith(promiseOfValue){
		var d = $.Deferred();
		promiseOfValue.then(
			function(v){ d.resolve(v); kick(); },
			function(e){ console.error(e); d.reject(e); kick(); }
		);
		return d.promise();
	}

	function uid(){
		return auth.currentUser ? auth.currentUser.uid : null;
	}

	function ref(type, id){
		if (!uid()) throw new Error('Not signed in');
		var r = db.ref('users/' + uid() + '/' + type);
		return id ? r.child(id) : r;
	}

	// Realtime DB drops empty objects/arrays and turns sparse arrays into
	// objects. Put values back into the shape the app expects.
	function toArray(v){
		if (Array.isArray(v)) return v;
		if (!v || typeof v !== 'object') return [];
		var out = [];
		Object.keys(v).forEach(function(k){ out[+k] = v[k]; });
		return out;
	}

	function normalize(type, id, val){
		var o = $.extend({}, val, { id: id });
		if (type === 'cell'){
			var dims = toArray(o.dimensions);
			for (var i = 0; i < dims.length; i++) if (!dims[i]) dims[i] = {};
			while (dims.length < 2) dims.push({});
			o.dimensions = dims;
			o.body = toArray(o.body);
		}
		return o;
	}

	// Strip angular's $$hashKey, undefined values and the client-side id.
	function clean(obj){
		var copy = JSON.parse(JSON.stringify(obj, function(k, v){
			return (typeof k === 'string' && k.indexOf('$$') === 0) ? undefined : v;
		}));
		delete copy.id;
		return copy;
	}

	function remember(type, obj){
		(cache[type] = cache[type] || {})[obj.id] = obj;
	}

	//   store

	var store = {
		add: function(type, data){
			var key = ref(type).push().key;
			var now = new Date().toISOString();
			var payload = clean(data);
			payload.createdAt = now;
			payload.updatedAt = now;

			return resolveWith(ref(type, key).set(payload).then(function(){
				var obj = normalize(type, key, payload);
				remember(type, obj);
				return obj;
			}));
		},

		update: function(type, id, changes){
			if (!id) return $.Deferred().reject(new Error('update needs an id')).promise();

			var payload = clean(changes);
			payload.updatedAt = new Date().toISOString();

			// Remember what we wrote first, so the echo from the listener is ignored.
			var known = (cache[type] || {})[id];
			if (known) remember(type, normalize(type, id, $.extend({}, known, payload)));

			return resolveWith(ref(type, id).update(payload).then(function(){
				return $.extend({}, (cache[type] || {})[id], { id: id });
			}));
		},

		findAll: function(type){
			var d = $.Deferred();
			restored.done(function(){
				if (!uid()){
					d.resolve([]);
					return kick();
				}

				ref(type).once('value').then(function(snap){
					var list = [];
					cache[type] = {};
					snap.forEach(function(child){
						var obj = normalize(type, child.key, child.val());
						remember(type, obj);
						list.push(obj);
					});
					list.sort(function(a, b){
						return (a.createdAt || '') < (b.createdAt || '') ? -1 : 1;
					});
					d.resolve(list);
					kick();
					startListening();
				}, function(e){ console.error(e); d.reject(e); });
			});
			return d.promise();
		}
	};

	// Live updates from other devices (also fires for our own writes, which
	// are filtered out by comparing against the cache).
	function startListening(){
		if (listening || !uid()) return;
		listening = true;

		var cells = listenRef = ref('cell');

		cells.on('child_changed', function(snap){
			var obj = normalize('cell', snap.key, snap.val());
			if (_.isEqual((cache.cell || {})[snap.key], obj)) return;
			remember('cell', obj);
			emit(remoteHandlers, 'update', obj);
		});

		cells.on('child_removed', function(snap){
			if (cache.cell) delete cache.cell[snap.key];
			emit(remoteHandlers, 'remove', { id: snap.key });
		});
	}

	function stopListening(){
		if (!listening) return;
		if (listenRef) listenRef.off();
		listenRef = null;
		listening = false;
		cache = {};
	}

	//   account

	auth.onAuthStateChanged(function(user){
		if (restored.state() === 'pending'){
			restored.resolve(!!user);
		}else if (!user && listening){
			// signed out elsewhere (token revoked, another tab)
			stopListening();
			emit(accountHandlers, 'signout');
		}
	});

	var account = {
		// Resolves true if a previous session was restored, false otherwise.
		restore: function(){
			return restored.promise();
		},

		signUp: function(email, password){
			return resolveWith(auth.createUserWithEmailAndPassword(email, password).then(function(cred){
				emit(accountHandlers, 'signup', cred.user);
				emit(accountHandlers, 'signin', cred.user);
				return cred.user;
			}));
		},

		signIn: function(email, password){
			return resolveWith(auth.signInWithEmailAndPassword(email, password).then(function(cred){
				emit(accountHandlers, 'signin', cred.user);
				return cred.user;
			}));
		},

		signOut: function(){
			stopListening();
			return resolveWith(auth.signOut().then(function(){
				emit(accountHandlers, 'signout');
			}));
		},

		changePassword: function(oldPassword, newPassword){
			var user = auth.currentUser;
			var credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
			return resolveWith(
				user.reauthenticateWithCredential(credential).then(function(){
					return user.updatePassword(newPassword);
				})
			);
		},

		on: function(name, fn){ on(accountHandlers, name, fn); }
	};

	this.store = store;
	this.account = account;
	this.remote = { on: function(name, fn){ on(remoteHandlers, name, fn); } };
	this.task = { on: function(){} };
}
