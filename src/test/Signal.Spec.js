describe( "Signal Test", function() {

	let signal;
	let slot;
	let data = {key: "value"};
    let msg;

    beforeAll(() => {
        signal = new Pattern.Signal();

        slot = {
			onMsg: function(msg){}
		};

        spyOn(signal, 'addSlot').and.callThrough();
        spyOn(slot, 'onMsg').and.callThrough();
    });

    it('add method should add the slot', () => {
        signal.add([slot.onMsg]);
        expect(signal.addSlot).toHaveBeenCalledWith(slot.onMsg);
    });

    it('remove method should delete the slot', () => {
        let data = 0;
        let fn = (d) => {data = d;}

        signal.add(fn);
        signal.dispatch(1);

        signal.remove(fn);
        signal.dispatch(2);

        expect(data).toEqual(1);
    });

    it('dispatch method should send a notification with data', () => {
        signal.add(slot.onMsg);
        signal.dispatch('test');

        expect(slot.onMsg).toHaveBeenCalledWith('test');
    });
});
