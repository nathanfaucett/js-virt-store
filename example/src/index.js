var virt = require("@nathanfaucett/virt"),
    propTypes = require("@nathanfaucett/prop_types"),
    virtDOM = require("@nathanfaucett/virt-dom"),
    createStore = require("@nathanfaucett/store"),

    reduxDevtoolsExtension = require("redux-devtools-extension"),

    virt = require("@nathanfaucett/virt"),
    virtStore = require("../..");


var store = createStore(),

    Component = virt.Component,
    Provider = virtStore.Provider,
    connect = virtStore.connect;


store.setInitialState({
    counter: {
        count: 0
    }
});

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    store.addAndComposeReduxStore(window.__REDUX_DEVTOOLS_EXTENSION__);
}

store.addMiddleware(function counterMiddleware(store, action, next) {
    switch (action.type) {
        case "INC": {
            store.dispatch({
                type: "INC_DONE",
                count: store.getState().counter.count + 1
            });
            break;
        }
        case "DEC": {
            store.dispatch({
                type: "DEC_DONE",
                count: store.getState().counter.count - 1
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
        case "DEC_DONE":
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

Counter.prototype.render = function() {
    return (
        virt.createView("div",
            virt.createView("button", {
                onClick: this.props.incCount
            }, "+"),
            virt.createView("button", {
                onClick: this.props.decCount
            }, "-"),
            virt.createView("p", this.props.count)
        )
    );
};


function mapDispatchToProps(dispatch) {
    return {
        incCount: function() {
            dispatch({
                type: "INC"
            });
        },
        decCount: function() {
            dispatch({
                type: "DEC"
            });
        }
    };
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
