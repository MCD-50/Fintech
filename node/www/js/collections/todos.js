/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Expense Collection
	// ---------------

	// The collection of Expenses is backed by *localStorage* instead of a remote
	// server.
	var Expenses = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Expense,

		url: 'api/expenses',

		// Filter down the list of all expense items that are finished.
		completed: function () {
			return this.filter(function (expense) {
				return expense.get('completed');
			});
		},

		// Filter down the list to only expense items that are still not finished.
		remaining: function () {
			return this.without.apply(this, this.completed());
		},

		// We keep the Expenses in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		// Expenses are sorted by their original insertion order.
		comparator: function (expense) {
			return expense.get('order');
		}
	});

	// Create our global collection of **Todos**.
	app.expenses = new Expenses();
})();
