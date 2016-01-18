/**
 * Timer page class.
 */
var TimerPage = function (db) {
    this._db = db;
    this._init();
};

/**
 * Database connection.
 * @var {IDBDatabase}
 */
TimerPage.prototype._db = null;

/**
 * Initializes the page.
 * 
 * @return {void}
 */
TimerPage.prototype._init = function () {
    var self = this;
    
    $(document).on('click', 'input#start', function () {
        var clientName = $.trim($('input#client').val()) || 'General Client';
        var projectName = $.trim($('input#project').val()) || 'General Project';
        var taskName = $.trim($('input#task').val()) || 'General Task';
        
        var t = self._db.transaction(['client', 'project', 'task'], 'readwrite');
        var clientTable = t.objectStore('client');
        clientTable.put(
            {name: clientName}
        ).addEventListener('success', function (event) {
            var projectTable = t.objectStore('project');
            projectTable.put(
                {clientName: clientName, name: projectName}
            ).addEventListener('success', function () {
                var taskTable = t.objectStore('task');
                taskTable.put(
                    {clientName: clientName, projectName: projectName, name: taskName}
                ).addEventListener('success', function () {
                    self._openTimerDialog();
                });
            });
        });
    });
    
    $(document).on('deviceready', function () {
        //self._openTimerDialog();
    });
};

/**
 * Opens the timer dialog.
 * 
 * @return {void}
 */
TimerPage.prototype._openTimerDialog = function () {
    // TODO: esc button
    $('div#timer-dialog').popup('open');
};
