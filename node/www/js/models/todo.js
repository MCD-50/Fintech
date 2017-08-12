/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Expense Model
	// ----------

	// Our basic **Expense** model has `title`, `order`, and `completed` attributes.
	app.Expense = Backbone.Model.extend({
		// Default attributes for the expense
		// and ensure that each expense created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false,
			
		},

		// Toggle the `completed` state of this expense item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		}
	});
})();
