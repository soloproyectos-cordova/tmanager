/**
 * Main class.
 */
var Main = function () {
    this._init();
};

/**
 * Initializes the application.
 * 
 * @return {void}
 */
Main.prototype._init = function () {
    // disables 'back' history on main menu
    $(document).on('click', 'a.timer, a.tasks, a.reports', function (event) {
        var target = $(this);
        event.preventDefault();
        $(':mobile-pagecontainer').pagecontainer('change', target.attr('href'), { changeHash: false});
    });
    
    // open and eventually creates the database
    var dbOpenReq = window.indexedDB.open('tmanager', 5);
    dbOpenReq.addEventListener('upgradeneeded', function (event) {
        var db = event.target.result;
        
        if (db.objectStoreNames.contains('client')) {
            db.deleteObjectStore('client');
        }
        if (db.objectStoreNames.contains('project')) {
            db.deleteObjectStore('project');
        }
        if (db.objectStoreNames.contains('task')) {
            db.deleteObjectStore('task');
        }
        
        if (!db.objectStoreNames.contains('client')) {
            db.createObjectStore('client', {keyPath: 'name'});
        }
        if (!db.objectStoreNames.contains('project')) {
            db.createObjectStore('project', {keyPath: ['clientName', 'name']});
        }
        if (!db.objectStoreNames.contains('task')) {
            db.createObjectStore('task', {keyPath: ['clientName', 'projectName', 'name']});
        }
    });
    dbOpenReq.addEventListener('success', function (event) {
        var db = event.target.result;
        
        // initializes the rest of the pages
        new TimerPage(db);
        new TasksPage(db);
        new ReportsPage(db);
    });
};

new Main();



$(document).on('deviceready', function () {
    return;
    var db = null;
    //indexedDB.deleteDatabase('todo1'); return;
    var dbReq = indexedDB.open('todo', 5);
    dbReq.addEventListener('success', function (event) {
        db = event.target.result;
        
        var tr = db.transaction(['client'], 'readonly');
        var os = tr.objectStore('client');
        
        // loading all elements from the table
        var a = [];
        var cursorReq = os.openCursor()
        cursorReq.addEventListener('success', function (event) {
            var cursor = event.target.result;
            if (cursor == undefined) {
                console.log(a.join(', '));
                return;
            }
            for (var field in cursor.value) {
                a.push(cursor.value[field]);
            }
            cursor.continue();
        });
        
        /*
        // loading a single element by its keyPath
        os.get('John Smith').addEventListener('success', function (event) {
            var obj = event.target.result;
            if (obj === undefined) {
                $.error('Object not found');
            }
            console.log('Item name: ' + obj.name);
        });*/
    });
    dbReq.addEventListener('upgradeneeded', function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('client')) {
            db.createObjectStore('client', {keyPath: 'name'});
        }
    });
    dbReq.onerror = function(e) {
        console.log("Error",e.target.error.name);
    }
});
