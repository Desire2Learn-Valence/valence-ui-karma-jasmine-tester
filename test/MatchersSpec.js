( function() {
	'use strict';

	var test_record_path;
	var test_record_object;

	describe( 'A matcher to match recorded objects', function() {
		beforeEach(function() {
			test_record_path = ['file', 'branch', 'leaf'];
			test_record_object = { 'branch' : { 'leaf': {
				'key1' : 'value1',
				'key2' : 'value2'
			} } };
			spyOn(d2l.vui.records, 'getRecord').and.returnValue(test_record_object.branch.leaf);
			spyOn(d2l.vui.records, 'setRecord').and.stub();
		});

		//@if RECORDING
		describe( 'in record mode', function() {
			it( 'records expected results', function() {
				d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1', 'key2' : 'value2' },
					test_record_path
				);
				expect(d2l.vui.records.setRecord).toHaveBeenCalled();
				expect(d2l.vui.records.getRecord).not.toHaveBeenCalled();
			});
		});
		//@endif

		//@if !RECORDING
		describe( 'in testing mode', function() {
			it( 'retrieves expected results', function() {
				d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1', 'key2' : 'value2' },
					test_record_path
				);
				expect(d2l.vui.records.getRecord).toHaveBeenCalled();
				expect(d2l.vui.records.setRecord).not.toHaveBeenCalled();
			});

			it( 'returns a pass on matching record', function() {
				var ret = d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1', 'key2' : 'value2' },
					test_record_path
				);
				expect(ret.pass).toBeTruthy();
			});

			it( 'returns a failure on mismatched record value', function() {
				var ret = d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'bad' },
					test_record_path
				);
				expect(ret.pass).toBeFalsy();
			});

			it( 'returns a failure on missing record key', function() {
				var ret = d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'bad' : 'value1' },
					test_record_path
				);
				expect(ret.pass).toBeFalsy();
			});

			it( 'passes on additional record key', function() {
				var ret = d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key2' : 'value2' },
					test_record_path
				);
				expect(ret.pass).toBeTruthy();
			});

			it( 'passes on a maching exception for a stored record key', function() {
				var ret = d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'except' },
					test_record_path,
					{ 'key1' : 'except' }
				);
				expect(ret.pass).toBeTruthy();
			});

			it( 'fails on mismatched exception for a stored record key', function() {
				var ret = d2l.vui.matchers.jasmine.toMatchRecordedObjectAt().compare(
					{ 'key1' : 'value1' },
					test_record_path,
					{ 'key1' : 'except' }
				);
				expect(ret.pass).toBeFalsy();
			});

		});
		//@endif

	});

} )();