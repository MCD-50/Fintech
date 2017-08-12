/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Expense Router
	// ----------
	var ExpenseRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.ExpenseFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Expense view items
			app.expenses.trigger('filter');
		}
	});

	app.ExpenseRouter = new ExpenseRouter();
	Backbone.history.start();
})();
