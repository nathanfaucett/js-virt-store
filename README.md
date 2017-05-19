virt-store [![Build Status](https://travis-ci.org/nathanfaucett/js-virt-store.svg?branch=master)](https://travis-ci.org/nathanfaucett/js-virt-store)
=======

store bindings for virt

```javascript
var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    virtDOM = require("@nathanfaucett/virt-dom"),

    createStore = require("@nathanfaucett/store"),

    virtStore = require("@nathanfaucett/virt-store");


var store = createStore(),
    Component = virt.Component,
    Provider = virtStore.Provider,
    connect = virtStore.connect;


store.setInitialState({
    counter: {
        count: 0
    }
});

store.addMiddleware(function counterMiddleware(store, action, next) {
    switch (action.type) {
        case "INC": {
            store.dispatch({
                type: "INC_DONE",
                count: store.getState().counter.count + 1
            });
            break;
        }
    }

    next(action);
});

store.add(function counter(state, action) {
    switch (action.type) {
        case "INC_DONE":
            return {
                count: action.count
            };
        default: {
            return state
        }
    }
});


function Counter(props, children, context) {
    Component.call(this, props, children, context);
}
Component.extend(Counter, "Counter");

Counter.propTypes = {
    count: propTypes.number.isRequired
};

Counter.contextTypes = {
    store: propTypes.object.isRequired
};

Counter.prototype.render = function() {
    return (
        virt.createView("div", this.props.count)
    );
};


function mapDispatchToProps(dispatch) {
    return {};
}

function mapStateToProps(state /*, ownProps */) {
    return {
        count: state.counter.count
    };
}

var CounterContainer = connect(mapStateToProps, mapDispatchToProps, Counter);


virtDOM.render(
    virt.createView(Provider, {
        store: store,
        render: function render() {
            return virt.createView(CounterContainer);
        }
    }),
    document.getElementById("app")
);


(function onSetTimeout() {
    store.dispatch({
        type: "INC"
    });
    setTimeout(onSetTimeout, 100);
}());
```
